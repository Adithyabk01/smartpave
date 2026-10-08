import React from 'react';
import { Calendar, Filter, MapPin } from 'lucide-react';
import type { Section } from '../types';

interface ControlsProps {
  sections: Section[];
  selectedSectionId: string;
  onSelectSection: (sectionId: string) => void;
  surveyYear: number;
}

export const Controls: React.FC<ControlsProps> = ({
  sections,
  selectedSectionId,
  onSelectSection,
  surveyYear,
}) => {
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-4 mb-6 card-shadow flex flex-wrap items-center justify-between gap-4">
      <div className="flex flex-wrap items-center gap-4 sm:gap-6">
        {/* Road Selection */}
        <div className="flex items-center space-x-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Road</label>
          <div className="relative flex items-center">
            <MapPin className="w-4 h-4 text-blue-600 absolute left-2.5 pointer-events-none" />
            <select
              disabled
              className="pl-8 pr-4 py-1.5 bg-slate-50 border border-slate-300 rounded-md text-sm font-semibold text-slate-800 shadow-sm cursor-not-allowed"
            >
              <option>NH-275</option>
            </select>
          </div>
        </div>

        {/* Section Dropdown */}
        <div className="flex items-center space-x-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Section</label>
          <div className="relative flex items-center">
            <Filter className="w-4 h-4 text-blue-600 absolute left-2.5 pointer-events-none" />
            <select
              value={selectedSectionId}
              onChange={(e) => onSelectSection(e.target.value)}
              className="pl-8 pr-8 py-1.5 bg-white border border-blue-400 rounded-md text-sm font-bold text-blue-900 shadow-sm hover:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              {sections.map((sec) => (
                <option key={sec.Section_ID} value={sec.Section_ID}>
                  {sec.Section_ID} ({sec['Start Chainage']} - {sec['End Chainage']})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Survey Year Indicator */}
      <div className="flex items-center space-x-2 bg-slate-50 px-3 py-1.5 rounded-md border border-slate-200">
        <Calendar className="w-4 h-4 text-slate-500" />
        <span className="text-xs font-medium text-slate-600">Survey Year:</span>
        <span className="text-xs font-bold text-slate-900">{surveyYear}</span>
      </div>
    </div>
  );
};
