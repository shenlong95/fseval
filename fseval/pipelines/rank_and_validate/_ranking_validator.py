from abc import ABC, abstractmethod
from dataclasses import dataclass
from logging import Logger, getLogger
from typing import Any, Dict, List, Optional

import numpy as np
import pandas as pd
from fseval.pipeline.cv import CrossValidator
from fseval.pipeline.dataset import Dataset, DatasetConfig
from fseval.pipeline.estimator import Estimator, TaskedEstimatorConfig
from fseval.pipeline.resample import Resample, ResampleConfig
from fseval.types import AbstractEstimator, Task
from hydra.core.config_store import ConfigStore
from hydra.utils import instantiate
from omegaconf import II, MISSING
from sklearn.base import BaseEstimator, clone
from sklearn.ensemble import VotingClassifier, VotingRegressor
from sklearn.ensemble._base import _BaseHeterogeneousEnsemble
from sklearn.feature_selection import SelectFromModel, SelectKBest
from sklearn.metrics import log_loss, r2_score
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import MinMaxScaler
from sklearn.utils import _print_elapsed_time
from sklearn.utils.metaestimators import _BaseComposition
from tqdm import tqdm

from .._experiment import Experiment
from ._config import RankAndValidatePipeline


@dataclass
class RankingValidator(Experiment, RankAndValidatePipeline):
    bootstrap_state: int = MISSING

    logger: Logger = getLogger(__name__)

    def _get_estimator(self):
        yield self.ranker

    def fit(self, X, y):
        override = f"bootstrap_state={self.bootstrap_state}"
        filename = f"ranking[{override}].pickle"
        restored = self.storage_provider.restore_pickle(filename)

        if restored:
            self.ranker.estimator = restored
            self.logger.info("restored ranking from storage provider ✓")
        else:
            super(RankingValidator, self).fit(X, y)
            self.storage_provider.save_pickle(filename, self.ranker.estimator)

    def score(self, X, y):
        """Scores a feature ranker, if a ground-truth on the desired dataset
        feature importances is available. If this is the case, the estimated normalized
        feature importances are compared to the desired ones using two metrics:
        log loss and the R^2 score. Whilst the log loss converts the ground-truth
        desired feature rankings to a binary value, 0/1, the R^2 score always works."""

        X_importances = self.dataset.feature_importances
        if X_importances is None:
            return pd.DataFrame()  # no ground-truth available: don't score ranking

        assert np.ndim(X_importances) == 1, "instance-based not supported yet."
        ranking = self.feature_importances_

        # r2 score
        y_true = X_importances
        y_pred = ranking
        r2 = r2_score(y_true, y_pred)

        # log loss
        y_true = X_importances > 0
        y_pred = ranking
        log_loss_score = log_loss(y_true, y_pred, labels=[0, 1])

        # construct score, send to callback
        score = {
            "r2_score": r2,
            "log_loss": log_loss_score,
            "fit_time": self.ranker.fit_time_,
            "bootstrap_state": self.bootstrap_state,
        }
        self.callbacks.on_metrics(score)

        # put a in a dataframe so can be easily merged with other pipeline scores
        scores = pd.DataFrame([score])
        return scores

    @property
    def feature_importances_(self):
        """Normalized ranker feature importance score."""
        ranking = self.ranker.feature_importances_
        summation = sum(ranking)
        return np.asarray(ranking) / summation
