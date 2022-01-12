import os
import time
from logging import Logger, getLogger
from pathlib import Path

import pandas as pd
from fseval.types import TerminalColor
from omegaconf import DictConfig, OmegaConf

from ._base_export_callback import BaseExportCallback


class CSVCallback(BaseExportCallback):
    """CSV support for fseval. Uploads general information on the experiment to
    a `experiments` table and provides a hook for uploading custom tables. Use the
    `on_table` hook in your pipeline to upload a DataFrame to a certain database table.
    """

    def __init__(self, **kwargs):
        super(CSVCallback, self).__init__()

        # extract config
        self.dir = kwargs.get("dir")
        self.mode = kwargs.get("mode", "a")

        # assert dir param was given
        assert self.dir, (
            "The CSV callback did not receive a `dir` param. All results will be "
            + "written to files in this dir. This is required to export to CSV files."
        )

        # upgrade dir to Path type
        self.dir = Path(self.dir)
        if not self.dir.exists():
            os.makedirs(self.dir)  # ensure directories exist

        # print save path
        dir_abs_str = TerminalColor.blue(self.dir.absolute())
        self.logger: Logger = getLogger(__name__)
        self.logger.info(f"CSV callback enabled. Writing .csv files to: {dir_abs_str}")

    def should_insert_header(self, filepath: Path) -> bool:
        if filepath.exists():
            # when the target `.csv` file already exists, omit header.
            return False
        else:
            # otherwise, add a header to the csv file.
            return True

    def on_begin(self, config: DictConfig):
        df = self.get_experiment_config(config)

        # write experiment config to `experiments.csv`
        filepath = self.dir / "experiments.csv"
        header = self.should_insert_header(filepath)
        df.to_csv(filepath, mode=self.mode, header=header)

        # log
        filepath_abs_str = TerminalColor.blue(filepath.absolute())
        self.logger.info(
            f"Written experiment config to: {filepath_abs_str} {TerminalColor.green('✓')}"
        )

    def on_table(self, df: pd.DataFrame, name: str):
        # make sure experiment `id` is added to this table. this allows a user to JOIN
        # the results back into each other, after being distributed over several
        # database tables.
        df = self.add_experiment_id(df)

        # upload table to CSV file, named after the table name
        filepath = self.dir / f"{name}.csv"
        header = self.should_insert_header(filepath)
        df.to_csv(filepath, mode=self.mode, header=header)

        # log table upload
        filepath_abs_str = TerminalColor.blue(filepath.absolute())
        self.logger.info(
            f"Written `{name}` table to: {filepath_abs_str} {TerminalColor.green('✓')}"
        )
