import os
import pandas as pd
import numpy as np
from typing import Dict, Any, Tuple, List
from app.schemas.pydantic_models import UploadValidationResponse

REQUIRED_COLUMNS = [
    'Section_ID', 'Start Chainage', 'End Chainage', 'Length_m', 
    'Width_m', 'Area_m2', 'Survey_Year', 'Construction_Year', 
    'Age_yr', 'IRI_m_per_km', 'RI_mm_per_km', 'Rutting_mm', 
    'Texture_mm', 'PCI'
]

DEFAULT_DATA_PATH = os.path.abspath(
    os.path.join(os.path.dirname(__file__), '..', '..', '..', 'data', 'ml.xlsx')
)

class DataLoaderService:
    def __init__(self):
        self._df: pd.DataFrame = pd.DataFrame()
        self.load_default_data()

    def get_condition_category(self, pci: float) -> str:
        if pci >= 85:
            return "Excellent"
        elif pci >= 70:
            return "Very Good"
        elif pci >= 55:
            return "Good"
        elif pci >= 40:
            return "Fair"
        elif pci >= 25:
            return "Poor"
        else:
            return "Very Poor / Failed"

    def get_recommended_action(self, pci: float) -> str:
        if pci >= 85:
            return "Routine Monitoring"
        elif pci >= 70:
            return "Preventive Maintenance Assessment"
        elif pci >= 55:
            return "Preventive / Minor Rehabilitation Assessment"
        elif pci >= 40:
            return "Rehabilitation Assessment"
        elif pci >= 25:
            return "Major Rehabilitation Assessment"
        else:
            return "Reconstruction Assessment"

    def validate_dataframe(self, df: pd.DataFrame, filename: str = "dataset") -> Tuple[UploadValidationResponse, pd.DataFrame]:
        cols = list(df.columns)
        found_cols = [c for c in REQUIRED_COLUMNS if c in cols]
        missing_cols = [c for c in REQUIRED_COLUMNS if c not in cols]

        missing_vals = {}
        for c in found_cols:
            missing_count = int(df[c].isna().sum())
            if missing_count > 0:
                missing_vals[c] = missing_count

        duplicate_sections = []
        if 'Section_ID' in cols:
            duplicates = df[df['Section_ID'].duplicated()]['Section_ID'].tolist()
            duplicate_sections = [str(x) for x in set(duplicates)]

        is_valid = len(missing_cols) == 0 and len(duplicate_sections) == 0

        msg = "File validated successfully." if is_valid else "Validation failed due to missing required columns or duplicates."

        val_response = UploadValidationResponse(
            file_name=filename,
            file_loaded=True,
            n_sections=len(df),
            required_columns_found=found_cols,
            missing_columns=missing_cols,
            missing_values_count=missing_vals,
            duplicate_sections=duplicate_sections,
            is_valid=is_valid,
            message=msg
        )
        return val_response, df

    def set_data(self, df: pd.DataFrame):
        # Calculate condition & recommended action
        df['PCI'] = pd.to_numeric(df['PCI'], errors='coerce')
        df['Condition'] = df['PCI'].apply(self.get_condition_category)
        df['Recommended_Action'] = df['PCI'].apply(self.get_recommended_action)
        self._df = df

    def load_default_data(self) -> pd.DataFrame:
        if os.path.exists(DEFAULT_DATA_PATH):
            df = pd.read_excel(DEFAULT_DATA_PATH)
        else:
            csv_path = DEFAULT_DATA_PATH.replace('.xlsx', '.csv')
            if os.path.exists(csv_path):
                df = pd.read_csv(csv_path)
            else:
                raise FileNotFoundError(f"Default dataset not found at {DEFAULT_DATA_PATH}")
        
        _, df_valid = self.validate_dataframe(df, "ml.xlsx")
        self.set_data(df_valid)
        return self._df

    def get_dataframe(self) -> pd.DataFrame:
        if self._df.empty:
            self.load_default_data()
        return self._df

data_loader_service = DataLoaderService()
