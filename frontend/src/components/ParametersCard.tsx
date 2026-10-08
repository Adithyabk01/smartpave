import React from 'react';
import type { Section } from '../types';

interface ParametersCardProps {
  section: Section;
}

export const ParametersCard: React.FC<ParametersCardProps> = ({ section }) => {
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-5 card-shadow h-full flex flex-col justify-between">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">PAVEMENT PARAMETERS</h3>
        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
          Section {section.Section_ID}
        </span>
      </div>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between items-center py-1 border-b border-slate-100">
          <span className="text-slate-600 font-medium">Age</span>
          <span className="font-bold text-slate-900">{section.Age_yr} years</span>
        </div>

        <div className="flex justify-between items-center py-1 border-b border-slate-100">
          <span className="text-slate-600 font-medium">IRI (Roughness)</span>
          <span className="font-bold text-slate-900">{section.IRI_m_per_km} m/km</span>
        </div>

        <div className="flex justify-between items-center py-1 border-b border-slate-100">
          <span className="text-slate-600 font-medium">RI (Roughness Index)</span>
          <span className="font-bold text-slate-900">{section.RI_mm_per_km} mm/km</span>
        </div>

        <div className="flex justify-between items-center py-1 border-b border-slate-100">
          <span className="text-slate-600 font-medium">Rutting Depth</span>
          <span className="font-bold text-slate-900">{section.Rutting_mm} mm</span>
        </div>

        <div className="flex justify-between items-center py-1 border-b border-slate-100">
          <span className="text-slate-600 font-medium">Macrotexture</span>
          <span className="font-bold text-slate-900">{section.Texture_mm} mm</span>
        </div>

        <div className="flex justify-between items-center py-1">
          <span className="text-slate-600 font-medium">Section Area</span>
          <span className="font-bold text-slate-900">{section.Area_m2.toLocaleString()} m²</span>
        </div>
      </div>
    </div>
  );
};
