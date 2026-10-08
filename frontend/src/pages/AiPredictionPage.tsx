import React from 'react';
import type { ModelMetrics, FeatureImportance, Section } from '../types';
import { ActualVsPredictedChart } from '../components/ActualVsPredictedChart';
import { FeatureImportanceChart } from '../components/FeatureImportanceChart';
import { Cpu, AlertTriangle, CheckCircle, Info } from 'lucide-react';

interface AiPredictionPageProps {
  metrics: ModelMetrics | null;
  featureImportances: FeatureImportance[];
  sections: Section[];
}

export const AiPredictionPage: React.FC<AiPredictionPageProps> = ({
  metrics,
  featureImportances,
  sections,
}) => {
  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="bg-white rounded-lg p-5 border border-slate-200 card-shadow flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Cpu className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-black text-slate-900">AI / ML Model Diagnostic Page</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Random Forest PCI Regression model architecture, performance metrics, and feature importance analysis.
          </p>
        </div>
        <div className="flex items-center space-x-2 bg-blue-50 px-3 py-1.5 rounded-md border border-blue-200 text-xs text-blue-800 font-semibold">
          <CheckCircle className="w-4 h-4 text-blue-600" />
          <span>Scikit-Learn Python ML Engine</span>
        </div>
      </div>

      {/* Warning Alert */}
      <div className="bg-amber-50 border border-amber-300 rounded-lg p-4 text-xs text-amber-900 flex items-start space-x-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-extrabold block text-amber-950">Demonstration / Training-Fit Metrics Disclaimer:</span>
          {metrics?.disclaimer ?? 'Current dataset is small. Independent validation should be performed after expanding the dataset.'}
        </div>
      </div>

      {/* Model Specification & Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-slate-200 card-shadow">
          <span className="text-xs font-bold text-slate-500 uppercase">Model Algorithm</span>
          <div className="text-base font-extrabold text-slate-900 mt-1">Random Forest Regressor</div>
          <div className="text-xs text-slate-500 mt-1">n_estimators=300, max_depth=4</div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 card-shadow">
          <span className="text-xs font-bold text-slate-500 uppercase">R² Coefficient</span>
          <div className="text-2xl font-black text-blue-700 mt-1">{metrics?.r2_score ?? 0.7755}</div>
          <div className="text-xs text-slate-500 mt-1">Goodness of fit</div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 card-shadow">
          <span className="text-xs font-bold text-slate-500 uppercase">MAE (Mean Absolute Error)</span>
          <div className="text-2xl font-black text-emerald-700 mt-1">{metrics?.mae ?? 1.9}</div>
          <div className="text-xs text-slate-500 mt-1">Average PCI error</div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 card-shadow">
          <span className="text-xs font-bold text-slate-500 uppercase">RMSE</span>
          <div className="text-2xl font-black text-slate-900 mt-1">{metrics?.rmse ?? 2.49}</div>
          <div className="text-xs text-slate-500 mt-1">Root Mean Square Error</div>
        </div>
      </div>

      {/* Inputs vs Target Specifications */}
      <div className="bg-white rounded-lg border border-slate-200 p-5 card-shadow">
        <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center space-x-2">
          <Info className="w-4 h-4 text-blue-600" />
          <span>Model Features & Target Variable Definition</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-slate-50 p-3.5 rounded border border-slate-200 space-y-1.5">
            <span className="font-extrabold text-slate-900 block">Input Features (Independent Variables X):</span>
            <ul className="list-disc list-inside text-slate-700 space-y-1">
              <li><strong className="text-slate-900">Age_yr:</strong> Pavement service age in years</li>
              <li><strong className="text-slate-900">IRI_m_per_km:</strong> International Roughness Index (m/km)</li>
              <li><strong className="text-slate-900">RI_mm_per_km:</strong> Roughness Index (mm/km)</li>
              <li><strong className="text-slate-900">Rutting_mm:</strong> Wheel path rut depth in mm</li>
              <li><strong className="text-slate-900">Texture_mm:</strong> Surface macrotexture depth in mm</li>
            </ul>
          </div>

          <div className="bg-blue-50/60 p-3.5 rounded border border-blue-200 space-y-1.5">
            <span className="font-extrabold text-blue-950 block">Target Variable (Dependent Variable Y):</span>
            <p className="text-blue-900 leading-relaxed">
              <strong className="text-blue-950">PCI (Pavement Condition Index):</strong> A numerical indicator rating overall structural and surface condition from 0 (failed) to 100 (excellent).
            </p>
            <p className="text-[11px] text-blue-800 pt-1">
              Missing values are automatically handled using median imputation before feeding into the Random Forest.
            </p>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <ActualVsPredictedChart sections={sections} />
        </div>
        <div>
          <FeatureImportanceChart importances={featureImportances} />
        </div>
      </div>
    </div>
  );
};
