import numpy as np
from boruta.boruta_py import BorutaPy
from sklearn.base import BaseEstimator


class Boruta(BorutaPy):
    @property
    def feature_importances_(self):
        ranking = np.asarray(self.ranking_)
        return ranking / sum(ranking)
