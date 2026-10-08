export interface Section {
  Section_ID: string;
  'Start Chainage': string;
  'End Chainage': string;
  Length_m: number;
  Width_m: number;
  Area_m2: number;
  Survey_Year: number;
  Construction_Year: number;
  Age_yr: number;
  IRI_m_per_km: number;
  RI_mm_per_km: number;
  Rutting_mm: number;
  Texture_mm: number;
  PCI: number;
  Predicted_PCI?: number;
  Condition?: string;
  Recommended_Action?: string;
}

export interface ModelMetrics {
  model_name: string;
  n_estimators: number;
  max_depth: number;
  random_state: number;
  n_observations: number;
  mae: number;
  rmse: number;
  r2_score: number;
  is_training_fit: boolean;
  disclaimer: string;
}

export interface FeatureImportance {
  feature: string;
  feature_name: string;
  importance: number;
}

export interface UploadValidation {
  file_name: string;
  file_loaded: boolean;
  n_sections: number;
  required_columns_found: string[];
  missing_columns: string[];
  missing_values_count: Record<string, number>;
  duplicate_sections: string[];
  is_valid: boolean;
  message: string;
}

export interface LccTreatment {
  treatment: string;
  initial_cost: number;
  annual_maint_cost: number;
  pv_maint_cost: number;
  total_pv_lcc: number;
  life_extension_years: number;
  feasible: boolean;
  is_lowest_cost: boolean;
  is_recommended: boolean;
  notes: string;
}

export interface LccResponse {
  section_id: string;
  current_pci: number;
  recommended_action: string;
  treatments: LccTreatment[];
  optimal_treatment: string;
  optimal_lcc: number;
}

export interface FuturePciPoint {
  year: number;
  year_label: string;
  future_pci: number;
  min_acceptable_pci: number;
}

export interface FuturePciResponse {
  section_id: string;
  current_pci: number;
  points: FuturePciPoint[];
  trigger_year?: number;
  disclaimer: string;
}

export type TabType = 
  | 'dashboard' 
  | 'ai-prediction' 
  | 'summary' 
  | 'maintenance' 
  | 'future-pci' 
  | 'lcc' 
  | 'uploader' 
  | 'report';
