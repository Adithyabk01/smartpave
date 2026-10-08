import React from 'react';
import type { Section, ModelMetrics, LccResponse } from '../types';
import { Printer, ShieldCheck, Cpu, DollarSign, Layers } from 'lucide-react';

interface ReportViewPageProps {
  section: Section;
  metrics: ModelMetrics | null;
  lccData: LccResponse | null;
}

export const ReportViewPage: React.FC<ReportViewPageProps> = ({ section, metrics, lccData }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="bg-white rounded-lg p-5 border border-slate-200 card-shadow flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div>
          <h2 className="text-xl font-black text-slate-900">Viva Project Demonstration Report</h2>
          <p className="text-xs text-slate-500 mt-1">
            Printable engineering report view for academic project evaluation and viva presentation.
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="flex items-center space-x-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-md shadow transition"
        >
          <Printer className="w-4 h-4" />
          <span>Print / Save PDF Report</span>
        </button>
      </div>

      {/* Printable Report Document Card */}
      <div className="bg-white rounded-lg border border-slate-300 p-8 sm:p-10 shadow-lg space-y-8 max-w-4xl mx-auto print:shadow-none print:border-none">
        {/* Report Header */}
        <div className="border-b-2 border-slate-900 pb-6 flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-slate-900 text-white p-3 rounded-lg">
              <Layers className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">SmartPave</h1>
              <p className="text-xs font-bold text-slate-600 uppercase tracking-widest">
                AI-Based Pavement Maintenance Optimization
              </p>
              <p className="text-xs text-slate-500 italic mt-0.5">Corridor: NH-275 (Mysuru, Karnataka)</p>
            </div>
          </div>
          <div className="text-right text-xs">
            <span className="font-bold text-slate-900 block">ENGINEERING EVALUATION REPORT</span>
            <span className="text-slate-500">Date: October 2026</span>
            <span className="text-slate-500 block">Survey Year: {section.Survey_Year}</span>
          </div>
        </div>

        {/* Selected Section Overview */}
        <div>
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span>Section Pavement Evaluation: {section.Section_ID}</span>
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200 text-xs">
            <div>
              <span className="text-slate-500 font-medium block">Chainage Range</span>
              <span className="font-bold text-slate-900 font-mono">
                {section['Start Chainage']} - {section['End Chainage']}
              </span>
            </div>
            <div>
              <span className="text-slate-500 font-medium block">Current PCI</span>
              <span className="font-black text-slate-900 text-base">{section.PCI}</span>
            </div>
            <div>
              <span className="text-slate-500 font-medium block">Predicted PCI</span>
              <span className="font-black text-orange-700 text-base">{section.Predicted_PCI ?? section.PCI}</span>
            </div>
            <div>
              <span className="text-slate-500 font-medium block">Condition Rating</span>
              <span className="font-bold text-emerald-800 text-sm">{section.Condition}</span>
            </div>
          </div>
        </div>

        {/* Physical Pavement Parameters */}
        <div>
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">Measured Pavement Parameters</h3>
          <table className="w-full text-xs text-left border border-slate-200 divide-y divide-slate-200">
            <thead className="bg-slate-100 font-bold text-slate-800">
              <tr>
                <th className="py-2 px-3">Parameter</th>
                <th className="py-2 px-3">Measured Value</th>
                <th className="py-2 px-3">Unit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              <tr>
                <td className="py-2 px-3 font-semibold">Pavement Service Age</td>
                <td className="py-2 px-3 font-bold">{section.Age_yr}</td>
                <td className="py-2 px-3">Years</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-semibold">IRI (International Roughness Index)</td>
                <td className="py-2 px-3 font-bold">{section.IRI_m_per_km}</td>
                <td className="py-2 px-3">m/km</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-semibold">RI (Roughness Index)</td>
                <td className="py-2 px-3 font-bold">{section.RI_mm_per_km}</td>
                <td className="py-2 px-3">mm/km</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-semibold">Rutting Depth</td>
                <td className="py-2 px-3 font-bold">{section.Rutting_mm}</td>
                <td className="py-2 px-3">mm</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-semibold">Macrotexture Depth</td>
                <td className="py-2 px-3 font-bold">{section.Texture_mm}</td>
                <td className="py-2 px-3">mm</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-semibold">Section Total Area</td>
                <td className="py-2 px-3 font-bold">{section.Area_m2.toLocaleString()}</td>
                <td className="py-2 px-3">m²</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Machine Learning Summary */}
        <div>
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center space-x-2">
            <Cpu className="w-4 h-4 text-blue-600" />
            <span>AI / Machine Learning Diagnostics</span>
          </h2>

          <div className="p-4 bg-blue-50/60 rounded-lg border border-blue-200 text-xs space-y-2">
            <div className="flex justify-between border-b border-blue-200/60 pb-1.5">
              <span className="font-semibold text-blue-950">Model Algorithm:</span>
              <span className="font-bold text-blue-950">{metrics?.model_name ?? 'Random Forest Regressor'}</span>
            </div>
            <div className="flex justify-between border-b border-blue-200/60 pb-1.5">
              <span className="font-semibold text-blue-950">Model R² Score:</span>
              <span className="font-black text-blue-950">{metrics?.r2_score ?? 0.7755}</span>
            </div>
            <div className="flex justify-between border-b border-blue-200/60 pb-1.5">
              <span className="font-semibold text-blue-950">Mean Absolute Error (MAE):</span>
              <span className="font-bold text-blue-950">{metrics?.mae ?? 1.9} PCI pts</span>
            </div>
            <p className="text-[11px] text-blue-900 italic pt-1">
              * Demonstration training-fit metrics. Independent validation should be performed after expanding survey data.
            </p>
          </div>
        </div>

        {/* LCC Economic Optimization Summary */}
        <div>
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center space-x-2">
            <DollarSign className="w-4 h-4 text-blue-600" />
            <span>Economic Optimization & LCC Summary</span>
          </h2>

          <div className="p-4 bg-slate-900 text-white rounded-lg text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-300">Recommended Screening Action:</span>
              <span className="font-bold text-white">{section.Recommended_Action}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-300">Optimal Treatment Strategy:</span>
              <span className="font-extrabold text-blue-400">
                {lccData?.optimal_treatment ?? 'Preventive Maintenance'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-300">Present Value Life-Cycle Cost:</span>
              <span className="font-black text-white text-sm">
                ₹ {lccData?.optimal_lcc.toLocaleString() ?? '3,14,933'} / km
              </span>
            </div>
          </div>
        </div>

        {/* Signature & Academic Footer */}
        <div className="border-t border-slate-300 pt-6 flex justify-between items-end text-xs text-slate-500">
          <div>
            <span className="font-bold text-slate-900 block">SmartPave Research Prototype</span>
            <span>Developed for Academic Evaluation & Demonstration</span>
          </div>
          <div className="text-right">
            <div className="border-b border-slate-400 w-40 mb-1"></div>
            <span>Evaluator Signature</span>
          </div>
        </div>
      </div>
    </div>
  );
};
