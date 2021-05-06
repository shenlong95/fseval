import logging
from dataclasses import dataclass
from typing import Generator, List, Tuple

from fseval.base import Configurable
from fseval.config import CrossValidatorConfig

logger = logging.getLogger(__name__)


@dataclass
class CrossValidator(CrossValidatorConfig, Configurable):
    def split(self, X, y=None, groups=None) -> Generator[Tuple[List, List], None, None]:
        return self.splitter.split(X, y, groups)

    def get_n_splits(self):
        return self.splitter.get_n_splits()

    def get_split(self, X) -> Tuple[List, List]:
        splits = list(self.split(X))
        train_index, test_index = splits[self.fold]
        logger.info(
            f"using {len(train_index)} training samples and "
            + f"{len(test_index)} testing samples "
            + f"(fold={self.fold}, n_splits={self.get_n_splits()})"
        )
        return train_index, test_index
