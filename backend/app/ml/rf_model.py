import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.impute import SimpleImputer
from sklearn.metrics import mean_absolute_error, root_mean_squared_error, r2_score
from typing import Dict, Any, List, Tuple
from app.schemas.pydantic_models import ModelMetrics, FeatureImportanceItem

FEATURE_COLUMNS = ['Age_yr', 'IRI_m_per_km', 'RI_mm_per_km', 'Rutting_mm', 'Texture_mm']
FEATURE_DISPLAY_NAMES = {
    'Age_yr': 'Age (years)',
    'IRI_m_per_km': 'IRI (m/km)',
    'RI_mm_per_km': 'RI (mm/km)',
    'Rutting_mm': 'Rutting (mm)',
    'Texture_mm': 'Texture (mm)'
}

class RandomForstPciModel:
    def __init__(self):
        self.model = RandomForestRegressor(
            n_estimators=300,
            max_depth=4,
            random_state=42
        )
        self.imputer = SimpleImputer(strategy='median')
        self.is_fitted = False
        self.cached_df_hash = None
        self.metrics: ModelMetrics = None
        self.feature_importances: List[FeatureImportanceItem] = []

    def fit_and_predict(self, df: pd.DataFrame) -> pd.DataFrame:
        df_copy = df.copy()
        
        # Extract features and target
        X = df_copy[FEATURE_COLUMNS].copy()
        y = df_copy['PCI'].copy()

        # Handle missing values via median imputer
        X_imputed = self.imputer.fit_transform(X)

        # Fit model
        self.model.fit(X_imputed, y)
        self.is_fitted = True

        # Generate predictions
        predictions = self.model.predict(X_imputed)
        df_copy['Predicted_PCI'] = np.round(predictions, 1)

        # Calculate metrics
        mae = float(mean_absolute_error(y, predictions))
        rmse = float(root_mean_squared_error(y, predictions))
        r2 = float(r2_score(y, predictions))

        self.metrics = ModelMetrics(
            model_name="Random Forest Regressor",
            n_estimators=300,
            max_depth=4,
            random_state=42,
            n_observations=len(df),
            mae=round(mae, 2),
            rmse=round(rmse, 2),
            r2_score=round(r2, 4),
            is_training_fit=True,
            disclaimer="Current dataset is small. Independent validation should be performed after expanding the dataset."
        )

        # Calculate dynamic feature importances
        importances = self.model.feature_importances_
        feat_items = []
        for feat, imp in zip(FEATURE_COLUMNS, importances):
            feat_items.append(FeatureImportanceItem(
                feature=feat,
                feature_name=FEATURE_DISPLAY_NAMES.get(feat, feat),
                importance=round(float(imp), 4)
            ))
        
        # Sort by importance descending
        feat_items.sort(key=lambda x: x.importance, reverse=True)
        self.feature_importances = feat_items

        return df_copy

    def get_metrics(self) -> ModelMetrics:
        return self.metrics

    def get_feature_importances(self) -> List[FeatureImportanceItem]:
        return self.feature_importances

rf_model_service = RandomForstPciModel()
