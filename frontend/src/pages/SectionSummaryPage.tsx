import React from 'react';
import { SectionTable } from '../components/SectionTable';
import type { Section } from '../types';
import { FileSpreadsheet, Download } from 'lucide-react';

interface SectionSummaryPageProps {
  sections: Section[];
  selectedSectionId: string;
  onSelectSection: (sectionId: string) => void;
  onDownloadSummaryCsv: () => void;
}

export const SectionSummaryPage: React.FC<SectionSummaryPageProps> = ({
  sections,
  selectedSectionId,
  onSelectSection,
  onDownloadSummaryCsv,
}) => {
  return (
    <div className="space-y-6">
      {/* Title Bar */}
      <div className="bg-white rounded-lg p-5 border border-slate-200 card-shadow flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <FileSpreadsheet className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-black text-slate-900">Section-wise Condition Summary Table</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Complete tabulated inventory of all sections S1–S12, chainages, PCI ratings, and maintenance actions.
          </p>
        </div>

        <button
          onClick={onDownloadSummaryCsv}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-md shadow transition"
        >
          <Download className="w-4 h-4" />
          <span>Download Summary CSV</span>
        </button>
      </div>

      {/* Main Table */}
      <SectionTable
        sections={sections}
        selectedSectionId={selectedSectionId}
        onSelectSection={onSelectSection}
        onDownloadCsv={onDownloadSummaryCsv}
      />
    </div>
  );
};
