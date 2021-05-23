from abc import ABC, abstractmethod
from dataclasses import dataclass
from logging import Logger, getLogger
from typing import Dict, List, cast

import numpy as np
import pandas as pd
from fseval.callbacks import WandbCallback
from fseval.pipeline.cv import CrossValidator
from fseval.pipeline.dataset import Dataset, DatasetConfig
from fseval.pipeline.estimator import Estimator, TaskedEstimatorConfig
from fseval.pipeline.resample import Resample, ResampleConfig
from fseval.types import AbstractEstimator, Callback, Task
from hydra.core.config_store import ConfigStore
from hydra.utils import instantiate
from omegaconf import II, MISSING
from sklearn.base import BaseEstimator, clone
from sklearn.ensemble import VotingClassifier, VotingRegressor
from sklearn.ensemble._base import _BaseHeterogeneousEnsemble
from sklearn.feature_selection import SelectFromModel, SelectKBest
from sklearn.metrics import log_loss, r2_score
from sklearn.preprocessing import MinMaxScaler
from sklearn.utils.metaestimators import _BaseComposition
from tqdm import tqdm

from .._experiment import Experiment
from .._pipeline import Pipeline
from ._config import RankAndValidatePipeline
from ._ranking_validator import RankingValidator


@dataclass
class SubsetValidator(Experiment, RankAndValidatePipeline):
    """Validates one feature subset using a given validation estimator. i.e. it first
    performs feature selection using the ranking made available in the fitted ranker,
    `self.ranker`, and then fits/scores an estimator on that subset."""

    bootstrap_state: int = MISSING
    n_features_to_select: int = MISSING

    def _get_estimator(self):
        yield self.validator

    def _logger(self, estimator):
        return lambda text: None

    def _prepare_data(self, X, y):
        # select n features: perform feature selection
        selector = SelectFromModel(
            estimator=self.ranker,
            threshold=-np.inf,
            max_features=self.n_features_to_select,
            prefit=True,
        )
        X = selector.transform(X)
        return X, y

    def fit(self, X, y):
        override = f"bootstrap_state={self.bootstrap_state}"
        override += f",n_features_to_select={self.n_features_to_select}"
        filename = f"validation[{override}].cloudpickle"
        restored = self.storage_provider.restore_pickle(filename)

        if restored:
            self.validator.estimator = restored
            self.logger.info("restored validator from storage provider ✓")
        else:
            super(SubsetValidator, self).fit(X, y)
            self.storage_provider.save_pickle(filename, self.validator.estimator)

    def score(self, X, y):
        score = super(SubsetValidator, self).score(X, y)
        score["n_features_to_select"] = self.n_features_to_select
        score["fit_time"] = self.validator.fit_time_
        return score


@dataclass
class DatasetValidator(Experiment, RankAndValidatePipeline):
    """Validates an entire dataset, given a fitted ranker and its feature ranking. Fits
    at most 50 feature subsets, at each step incrementally including more top-features."""

    bootstrap_state: int = MISSING

    def _get_estimator(self):
        for n_features_to_select in np.arange(1, min(50, self.dataset.p) + 1):
            config = self._get_config()
            validator = config.pop("validator")

            yield SubsetValidator(
                **config,
                validator=clone(validator),
                n_features_to_select=n_features_to_select,
                bootstrap_state=self.bootstrap_state,
            )

    def _get_estimator_repr(self, estimator):
        return Estimator._get_estimator_repr(estimator.validator)

    def _get_overrides_text(self, estimator):
        return f"[n_features_to_select={estimator.n_features_to_select}] "

    def score(self, X, y):
        scores = super(DatasetValidator, self).score(X, y)
        # self.callbacks.on_metrics(scores)  # upload validator results
        return scores


@dataclass
class RankAndValidate(Experiment, RankAndValidatePipeline):
    """First fits a feature ranker (or feature selector, as long as the estimator will
    attach at `feature_importances_` property to its class), and then validates the
    feature ranking by fitting a 'validation' estimator. The validation estimator can be
    any normal sklearn estimator; just as long it supports the specified dataset type -
    regression or classification."""

    bootstrap_state: int = MISSING
    logger: Logger = getLogger(__name__)

    def _get_estimator(self):
        # instantiate ranking validator. pass bootstrap state for the cache filename
        self.ranking_validator = RankingValidator(
            **self._get_config(), bootstrap_state=self.bootstrap_state
        )

        # instantiate dataset validator.
        self.dataset_validator = DatasetValidator(
            **self._get_config(), bootstrap_state=self.bootstrap_state
        )

        # first fit ranker, then run all validations
        return [
            self.ranking_validator,
            self.dataset_validator,
        ]

    def _prepare_data(self, X, y):
        # resample dataset: perform a bootstrap
        self.resample.random_state = self.bootstrap_state
        X, y = self.resample.transform(X, y)
        return X, y

    def score(self, X, y):
        ranking_score = self.ranking_validator.score(X, y)
        ranking_score["group"] = "ranking"

        validation_score = self.dataset_validator.score(X, y)
        validation_score["group"] = "validation"

        scores = pd.DataFrame()
        scores = scores.append(ranking_score)
        scores = scores.append(validation_score)
        scores["bootstrap_state"] = self.bootstrap_state

        self.logger.info(f"scored bootstrap_state={self.bootstrap_state} ✓")
        return scores


@dataclass
class BootstrappedRankAndValidate(Experiment, RankAndValidatePipeline):
    """Provides an experiment that performs a 'bootstrap' procedure: using different
    `random_state` seeds the dataset is continuously resampled with replacement, such
    that various metrics can be better approximated."""

    logger: Logger = getLogger(__name__)

    def _get_estimator(self):
        for bootstrap_state in np.arange(1, self.n_bootstraps + 1):
            config = self._get_config()
            ranker = config.pop("ranker")

            yield RankAndValidate(
                **config,
                ranker=clone(ranker),
                bootstrap_state=bootstrap_state,
            )

    def _get_overrides_text(self, estimator):
        return f"[bootstrap_state={estimator.bootstrap_state}] "

    def score(self, X, y):
        scores = super(BootstrappedRankAndValidate, self).score(X, y)
        self.storage_provider.save(
            "scores.csv", lambda file: scores.to_csv(file, index=False)
        )

        ranking_scores = scores[scores["group"] == "ranking"].dropna(axis=1)
        validation_scores = scores[scores["group"] == "validation"].dropna(axis=1)

        wandb_callback = getattr(self.callbacks, "wandb", False)
        if wandb_callback:
            wandb_callback = cast(WandbCallback, wandb_callback)
            table_plot = wandb_callback._table_plot(
                validation_scores,
                fields=dict(
                    n_features_to_select="n_features_to_select",
                    score="score",
                    bootstrap_state="bootstrap_state",
                ),
                vega_spec_name="dunnkers/fseval/bootstrapped-validation-score",
            )
            wandb_callback.on_metrics({"validation_scores": table_plot})

        # Ranking scores - aggregation
        ranking_result = pd.DataFrame(
            [
                {
                    "r2_score_mean": scores["r2_score"].mean(),
                    "r2_score_std": scores["r2_score"].std(),
                    "log_loss_mean": scores["log_loss"].mean(),
                    "log_loss_std": scores["log_loss"].std(),
                }
            ]
        )
        self.logger.info(f"{self.ranker.name} scores:")
        print(ranking_result)
        self.callbacks.on_metrics(ranking_result)

        # Validation scores - aggregation
        by_dimension = scores.groupby("n_features_to_select")
        validation_result = pd.DataFrame(
            {
                "score_mean": by_dimension["score"].mean(),
                "score_std": by_dimension["score"].std(),
                "fit_time_mean": by_dimension["fit_time"].mean(),
                "fit_time_std": by_dimension["fit_time"].std(),
            }
        ).reset_index()
        validation_result["n_features_to_select"] = validation_result[
            "n_features_to_select"
        ].astype(int)
        self.logger.info(f"{self.validator.name} validation scores:")
        print(validation_result)
        self.callbacks.on_metrics(validation_result)

        # Summary
        best_subset_index = validation_result["score_mean"].argmax()
        best_subset = validation_result.iloc[best_subset_index]
        summary = dict(best_subset=best_subset.to_dict())

        return summary
