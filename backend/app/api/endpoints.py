from fastapi import APIRouter, UploadFile, File, HTTPException, Query
from typing import List, Optional
import pandas as pd
import io

from app.schemas.pydantic_models import (
    SectionData, ModelMetrics, FeatureImportanceItem, 
    UploadValidationResponse, LccTreatmentInput, LccResponse, 
    FuturePciRequest, FuturePciResponse, FuturePciYearPoint
)
from app.services.data_loader import data_loader_service
from app.ml.rf_model import rf_model_service
from app.services.lcc_service import lcc_service

router = APIRouter()

@router.get("/health")
def health_check():
    return {"status": "ok", "service": "SmartPave AI API", "version": "1.0.0"}

def _get_processed_df() -> pd.DataFrame:
    raw_df = data_loader_service.get_dataframe()
    processed_df = rf_model_service.fit_and_predict(raw_df)
    return processed_df

@router.get("/sections")
def get_sections():
    df = _get_processed_df()
    sections = df.to_dict(orient="records")
    # Clean keys for response
    cleaned = []
    for s in sections:
        s_clean = {
            "Section_ID": str(s["Section_ID"]),
            "Start Chainage": str(s["Start Chainage"]),
            "End Chainage": str(s["End Chainage"]),
            "Length_m": float(s["Length_m"]),
            "Width_m": float(s["Width_m"]),
            "Area_m2": float(s["Area_m2"]),
            "Survey_Year": int(s["Survey_Year"]),
            "Construction_Year": int(s["Construction_Year"]),
            "Age_yr": float(s["Age_yr"]),
            "IRI_m_per_km": float(s["IRI_m_per_km"]),
            "RI_mm_per_km": float(s["RI_mm_per_km"]),
            "Rutting_mm": float(s["Rutting_mm"]),
            "Texture_mm": float(s["Texture_mm"]),
            "PCI": float(s["PCI"]),
            "Predicted_PCI": float(s["Predicted_PCI"]),
            "Condition": str(s["Condition"]),
            "Recommended_Action": str(s["Recommended_Action"])
        }
        cleaned.append(s_clean)
    return cleaned

@router.get("/section/{section_id}")
def get_section(section_id: str):
    df = _get_processed_df()
    match = df[df["Section_ID"].str.upper() == section_id.upper()]
    if match.empty:
        raise HTTPException(status_code=404, detail=f"Section '{section_id}' not found.")
    s = match.iloc[0].to_dict()
    return {
        "Section_ID": str(s["Section_ID"]),
        "Start Chainage": str(s["Start Chainage"]),
        "End Chainage": str(s["End Chainage"]),
        "Length_m": float(s["Length_m"]),
        "Width_m": float(s["Width_m"]),
        "Area_m2": float(s["Area_m2"]),
        "Survey_Year": int(s["Survey_Year"]),
        "Construction_Year": int(s["Construction_Year"]),
        "Age_yr": float(s["Age_yr"]),
        "IRI_m_per_km": float(s["IRI_m_per_km"]),
        "RI_mm_per_km": float(s["RI_mm_per_km"]),
        "Rutting_mm": float(s["Rutting_mm"]),
        "Texture_mm": float(s["Texture_mm"]),
        "PCI": float(s["PCI"]),
        "Predicted_PCI": float(s["Predicted_PCI"]),
        "Condition": str(s["Condition"]),
        "Recommended_Action": str(s["Recommended_Action"])
    }

@router.get("/predictions")
def get_predictions():
    df = _get_processed_df()
    results = []
    for _, row in df.iterrows():
        results.append({
            "Section_ID": str(row["Section_ID"]),
            "Chainage": f"{row['Start Chainage']} - {row['End Chainage']}",
            "Actual_PCI": float(row["PCI"]),
            "Predicted_PCI": float(row["Predicted_PCI"]),
            "Difference": round(float(row["PCI"]) - float(row["Predicted_PCI"]), 1),
            "Condition": str(row["Condition"]),
            "Recommended_Action": str(row["Recommended_Action"])
        })
    return results

@router.get("/model/metrics", response_model=ModelMetrics)
def get_model_metrics():
    _get_processed_df()
    return rf_model_service.get_metrics()

@router.get("/model/feature-importance", response_model=List[FeatureImportanceItem])
def get_feature_importance():
    _get_processed_df()
    return rf_model_service.get_feature_importances()

@router.post("/data/upload", response_model=UploadValidationResponse)
async def upload_dataset(file: UploadFile = File(...)):
    filename = file.filename
    if not (filename.endswith(".xlsx") or filename.endswith(".xls") or filename.endswith(".csv")):
        raise HTTPException(status_code=400, detail="Invalid file type. Only Excel (.xlsx, .xls) and CSV (.csv) files are allowed.")
    
    contents = await file.read()
    try:
        if filename.endswith(".csv"):
            df = pd.read_csv(io.BytesIO(contents))
        else:
            df = pd.read_excel(io.BytesIO(contents))
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to parse file: {str(e)}")

    val_res, df_valid = data_loader_service.validate_dataframe(df, filename)
    if val_res.is_valid:
        data_loader_service.set_data(df_valid)
        # Refit ML model on new dataset
        rf_model_service.fit_and_predict(df_valid)
    
    return val_res

@router.post("/lcc/calculate", response_model=LccResponse)
def calculate_lcc(
    section_id: str = Query("S1"),
    custom_treatments: Optional[List[LccTreatmentInput]] = None
):
    df = _get_processed_df()
    match = df[df["Section_ID"].str.upper() == section_id.upper()]
    if match.empty:
        current_pci = 73.0
        rec_action = "Preventive Maintenance Assessment"
    else:
        current_pci = float(match.iloc[0]["PCI"])
        rec_action = str(match.iloc[0]["Recommended_Action"])

    return lcc_service.calculate_lcc(
        section_id=section_id,
        current_pci=current_pci,
        recommended_action=rec_action,
        custom_treatments=custom_treatments
    )

@router.post("/future-pci/scenario", response_model=FuturePciResponse)
def future_pci_scenario(req: FuturePciRequest):
    start_year = 2026
    points: List[FuturePciYearPoint] = []
    
    curr_pci = req.current_pci
    decline = req.annual_pci_decline
    min_pci = req.min_acceptable_pci
    trigger_yr = None

    for i in range(req.forecast_years + 1):
        yr = start_year + i
        proj_pci = max(0.0, round(curr_pci - (i * decline), 1))
        
        if proj_pci < min_pci and trigger_yr is None:
            trigger_yr = yr

        points.append(FuturePciYearPoint(
            year=yr,
            year_label=str(yr),
            future_pci=proj_pci,
            min_acceptable_pci=min_pci
        ))

    return FuturePciResponse(
        section_id=req.section_id,
        current_pci=req.current_pci,
        points=points,
        trigger_year=trigger_yr,
        disclaimer="This is an illustrative scenario and is not a calibrated deterioration model."
    )
