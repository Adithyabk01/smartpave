from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class SectionData(BaseModel):
    Section_ID: str
    Start_Chainage: str = Field(..., alias="Start Chainage")
    End_Chainage: str = Field(..., alias="End Chainage")
    Length_m: float
    Width_m: float
    Area_m2: float
    Survey_Year: int
    Construction_Year: int
    Age_yr: float
    IRI_m_per_km: float
    RI_mm_per_km: float
    Rutting_mm: float
    Texture_mm: float
    PCI: float
    Predicted_PCI: Optional[float] = None
    Condition: Optional[str] = None
    Recommended_Action: Optional[str] = None

    class Config:
        populate_by_name = True

class ModelMetrics(BaseModel):
    model_name: str = "Random Forest Regressor"
    n_estimators: int = 300
    max_depth: int = 4
    random_state: int = 42
    n_observations: int
    mae: float
    rmse: float
    r2_score: float
    is_training_fit: bool = True
    disclaimer: str = "Current dataset is small. Independent validation should be performed after expanding the dataset."

class FeatureImportanceItem(BaseModel):
    feature: str
    feature_name: str
    importance: float

class UploadValidationResponse(BaseModel):
    file_name: str
    file_loaded: bool
    n_sections: int
    required_columns_found: List[str]
    missing_columns: List[str]
    missing_values_count: Dict[str, int]
    duplicate_sections: List[str]
    is_valid: bool
    message: str

class LccTreatmentInput(BaseModel):
    treatment: str
    initial_cost_per_km: float  # ₹/km
    annual_maint_cost_per_km: float  # ₹/km
    life_extension_years: int
    discount_rate_pct: float  # e.g., 5.0
    analysis_period_years: int  # e.g., 20

class LccTreatmentResult(BaseModel):
    treatment: str
    initial_cost: float
    annual_maint_cost: float
    pv_maint_cost: float
    total_pv_lcc: float
    life_extension_years: int
    feasible: bool
    is_lowest_cost: bool
    is_recommended: bool
    notes: str

class LccResponse(BaseModel):
    section_id: str
    current_pci: float
    recommended_action: str
    treatments: List[LccTreatmentResult]
    optimal_treatment: str
    optimal_lcc: float

class FuturePciRequest(BaseModel):
    section_id: str
    current_pci: float
    forecast_years: int = 5
    annual_pci_decline: float = 2.5
    min_acceptable_pci: float = 60.0

class FuturePciYearPoint(BaseModel):
    year: int
    year_label: str
    future_pci: float
    min_acceptable_pci: float

class FuturePciResponse(BaseModel):
    section_id: str
    current_pci: float
    points: List[FuturePciYearPoint]
    trigger_year: Optional[int] = None
    disclaimer: str = "This is an illustrative scenario and is not a calibrated deterioration model."
