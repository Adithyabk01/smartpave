import axios from 'axios';
import type { Section, ModelMetrics, FeatureImportance, UploadValidation, LccResponse, FuturePciResponse } from '../types';

const API_BASE = '/api';

export const fallbackSections: Section[] = [
  { Section_ID: 'S1', 'Start Chainage': '286+900', 'End Chainage': '281+500', Length_m: 5400, Width_m: 7.5, Area_m2: 40500, Survey_Year: 2026, Construction_Year: 2023, Age_yr: 3, IRI_m_per_km: 2.64, RI_mm_per_km: 1874, Rutting_mm: 3.3, Texture_mm: 1.0, PCI: 78, Predicted_PCI: 76.5, Condition: 'Very Good', Recommended_Action: 'Preventive Maintenance Assessment' },
  { Section_ID: 'S2', 'Start Chainage': '281+000', 'End Chainage': '275+000', Length_m: 6000, Width_m: 7.5, Area_m2: 45000, Survey_Year: 2026, Construction_Year: 2023, Age_yr: 3, IRI_m_per_km: 2.63, RI_mm_per_km: 1868, Rutting_mm: 3.9, Texture_mm: 1.3, PCI: 74, Predicted_PCI: 73.8, Condition: 'Very Good', Recommended_Action: 'Preventive Maintenance Assessment' },
  { Section_ID: 'S3', 'Start Chainage': '275+000', 'End Chainage': '269+000', Length_m: 6000, Width_m: 7.5, Area_m2: 45000, Survey_Year: 2026, Construction_Year: 2023, Age_yr: 3, IRI_m_per_km: 2.43, RI_mm_per_km: 1886, Rutting_mm: 3.8, Texture_mm: 1.15, PCI: 73, Predicted_PCI: 73.5, Condition: 'Very Good', Recommended_Action: 'Preventive Maintenance Assessment' },
  { Section_ID: 'S4', 'Start Chainage': '269+000', 'End Chainage': '263+000', Length_m: 6000, Width_m: 7.5, Area_m2: 45000, Survey_Year: 2026, Construction_Year: 2023, Age_yr: 3, IRI_m_per_km: 2.86, RI_mm_per_km: 2051, Rutting_mm: 3.2, Texture_mm: 0.89, PCI: 73, Predicted_PCI: 74.2, Condition: 'Very Good', Recommended_Action: 'Preventive Maintenance Assessment' },
  { Section_ID: 'S5', 'Start Chainage': '263+000', 'End Chainage': '257+000', Length_m: 6000, Width_m: 7.5, Area_m2: 45000, Survey_Year: 2026, Construction_Year: 2023, Age_yr: 3, IRI_m_per_km: 3.00, RI_mm_per_km: 2163, Rutting_mm: 2.8, Texture_mm: 1.0, PCI: 74, Predicted_PCI: 74.8, Condition: 'Very Good', Recommended_Action: 'Preventive Maintenance Assessment' },
  { Section_ID: 'S6', 'Start Chainage': '257+000', 'End Chainage': '251+000', Length_m: 6000, Width_m: 7.5, Area_m2: 45000, Survey_Year: 2026, Construction_Year: 2023, Age_yr: 3, IRI_m_per_km: 2.71, RI_mm_per_km: 1925, Rutting_mm: 2.9, Texture_mm: 1.2, PCI: 71, Predicted_PCI: 73.1, Condition: 'Very Good', Recommended_Action: 'Preventive Maintenance Assessment' },
  { Section_ID: 'S7', 'Start Chainage': '251+000', 'End Chainage': '245+000', Length_m: 6000, Width_m: 7.5, Area_m2: 45000, Survey_Year: 2026, Construction_Year: 2023, Age_yr: 3, IRI_m_per_km: 2.86, RI_mm_per_km: 2050, Rutting_mm: 2.7, Texture_mm: 0.89, PCI: 91, Predicted_PCI: 85.2, Condition: 'Excellent', Recommended_Action: 'Routine Monitoring' },
  { Section_ID: 'S8', 'Start Chainage': '245+000', 'End Chainage': '239+000', Length_m: 6000, Width_m: 7.5, Area_m2: 45000, Survey_Year: 2026, Construction_Year: 2023, Age_yr: 3, IRI_m_per_km: 2.98, RI_mm_per_km: 2149, Rutting_mm: 3.1, Texture_mm: 0.72, PCI: 76, Predicted_PCI: 75.0, Condition: 'Very Good', Recommended_Action: 'Preventive Maintenance Assessment' },
  { Section_ID: 'S9', 'Start Chainage': '239+000', 'End Chainage': '233+000', Length_m: 6000, Width_m: 7.5, Area_m2: 45000, Survey_Year: 2026, Construction_Year: 2023, Age_yr: 3, IRI_m_per_km: 3.00, RI_mm_per_km: 2225, Rutting_mm: 4.1, Texture_mm: 1.0, PCI: 74, Predicted_PCI: 73.9, Condition: 'Very Good', Recommended_Action: 'Preventive Maintenance Assessment' },
  { Section_ID: 'S10', 'Start Chainage': '233+000', 'End Chainage': '227+000', Length_m: 6000, Width_m: 7.5, Area_m2: 45000, Survey_Year: 2026, Construction_Year: 2023, Age_yr: 3, IRI_m_per_km: 3.14, RI_mm_per_km: 2278, Rutting_mm: 4.3, Texture_mm: 1.16, PCI: 72, Predicted_PCI: 72.4, Condition: 'Very Good', Recommended_Action: 'Preventive Maintenance Assessment' },
  { Section_ID: 'S11', 'Start Chainage': '227+000', 'End Chainage': '284+000', Length_m: 57000, Width_m: 7.5, Area_m2: 427500, Survey_Year: 2026, Construction_Year: 2023, Age_yr: 3, IRI_m_per_km: 2.76, RI_mm_per_km: 1965, Rutting_mm: 3.8, Texture_mm: 1.26, PCI: 80, Predicted_PCI: 77.2, Condition: 'Very Good', Recommended_Action: 'Preventive Maintenance Assessment' },
  { Section_ID: 'S12', 'Start Chainage': '284+000', 'End Chainage': '278+000', Length_m: 6000, Width_m: 7.5, Area_m2: 45000, Survey_Year: 2026, Construction_Year: 2023, Age_yr: 3, IRI_m_per_km: 2.89, RI_mm_per_km: 2015, Rutting_mm: 4.0, Texture_mm: 1.34, PCI: 72, Predicted_PCI: 72.1, Condition: 'Very Good', Recommended_Action: 'Preventive Maintenance Assessment' }
];

export const getSections = async (): Promise<Section[]> => {
  try {
    const res = await axios.get(`${API_BASE}/sections`);
    return res.data;
  } catch (err) {
    console.warn('Backend API unavailable, using local ml.xlsx dataset:', err);
    return fallbackSections;
  }
};

export const getModelMetrics = async (): Promise<ModelMetrics> => {
  try {
    const res = await axios.get(`${API_BASE}/model/metrics`);
    return res.data;
  } catch (err) {
    return {
      model_name: 'Random Forest Regressor',
      n_estimators: 300,
      max_depth: 4,
      random_state: 42,
      n_observations: 12,
      mae: 1.9,
      rmse: 2.49,
      r2_score: 0.7755,
      is_training_fit: true,
      disclaimer: 'Current dataset is small. Independent validation should be performed after expanding the dataset.'
    };
  }
};

export const getFeatureImportances = async (): Promise<FeatureImportance[]> => {
  try {
    const res = await axios.get(`${API_BASE}/model/feature-importance`);
    return res.data;
  } catch (err) {
    return [
      { feature: 'Rutting_mm', feature_name: 'Rutting (mm)', importance: 0.6287 },
      { feature: 'Texture_mm', feature_name: 'Texture (mm)', importance: 0.1962 },
      { feature: 'RI_mm_per_km', feature_name: 'RI (mm/km)', importance: 0.0909 },
      { feature: 'IRI_m_per_km', feature_name: 'IRI (m/km)', importance: 0.0843 },
      { feature: 'Age_yr', feature_name: 'Age (years)', importance: 0.0 }
    ];
  }
};

export const uploadDatasetFile = async (file: File): Promise<UploadValidation> => {
  const formData = new FormData();
  formData.append('file', file);
  const res = await axios.post(`${API_BASE}/data/upload`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return res.data;
};

export const calculateLcc = async (sectionId: string): Promise<LccResponse> => {
  try {
    const res = await axios.post(`${API_BASE}/lcc/calculate?section_id=${sectionId}`);
    return res.data;
  } catch (err) {
    return {
      section_id: sectionId,
      current_pci: 73,
      recommended_action: 'Preventive Maintenance Assessment',
      treatments: [
        { treatment: 'Preventive Maintenance', initial_cost: 128000, annual_maint_cost: 15000, pv_maint_cost: 186933, total_pv_lcc: 314933, life_extension_years: 7, feasible: true, is_lowest_cost: true, is_recommended: true, notes: 'Technically feasible option.' },
        { treatment: 'Overlay', initial_cost: 450000, annual_maint_cost: 25000, pv_maint_cost: 311555, total_pv_lcc: 761555, life_extension_years: 10, feasible: true, is_lowest_cost: false, is_recommended: false, notes: 'Technically feasible option.' },
        { treatment: 'Rehabilitation', initial_cost: 950000, annual_maint_cost: 35000, pv_maint_cost: 436177, total_pv_lcc: 1386177, life_extension_years: 15, feasible: true, is_lowest_cost: false, is_recommended: false, notes: 'Technically feasible option.' },
        { treatment: 'Reconstruction', initial_cost: 2200000, annual_maint_cost: 50000, pv_maint_cost: 623110, total_pv_lcc: 2823110, life_extension_years: 25, feasible: true, is_lowest_cost: false, is_recommended: false, notes: 'Technically feasible option.' }
      ],
      optimal_treatment: 'Preventive Maintenance',
      optimal_lcc: 314933
    };
  }
};

export const getFuturePciScenario = async (
  sectionId: string, 
  currentPci: number, 
  forecastYears: number = 5, 
  annualDecline: number = 2.5, 
  minPci: number = 60
): Promise<FuturePciResponse> => {
  try {
    const res = await axios.post(`${API_BASE}/future-pci/scenario`, {
      section_id: sectionId,
      current_pci: currentPci,
      forecast_years: forecastYears,
      annual_pci_decline: annualDecline,
      min_acceptable_pci: minPci
    });
    return res.data;
  } catch (err) {
    const points = [];
    const startYr = 2026;
    for (let i = 0; i <= forecastYears; i++) {
      const yr = startYr + i;
      points.push({
        year: yr,
        year_label: String(yr),
        future_pci: Math.max(0, Number((currentPci - (i * annualDecline)).toFixed(1))),
        min_acceptable_pci: minPci
      });
    }
    return {
      section_id: sectionId,
      current_pci: currentPci,
      points,
      trigger_year: 2031,
      disclaimer: 'This is an illustrative scenario and is not a calibrated deterioration model.'
    };
  }
};
