import React from 'react';
import { Controls } from '../components/Controls';
import { KpiCards } from '../components/KpiCards';
import { ParametersCard } from '../components/ParametersCard';
import { PciTrendChart } from '../components/PciTrendChart';
import { ActualVsPredictedChart } from '../components/ActualVsPredictedChart';
import { FeatureImportanceChart } from '../components/FeatureImportanceChart';
import { SectionTable } from '../components/SectionTable';
import type { Section, FeatureImportance, LccResponse } from '../types';
import { DollarSign, Award, Clock } from 'lucide-react';

interface DashboardPageProps {
  sections: Section[];
  selectedSection: Section;
  onSelectSection: (sectionId: string) => void;
  featureImportances: FeatureImportance[];
  lccData: LccResponse | null;
  onDownloadPredictionsCsv: () => void;
  onDownloadSummaryCsv: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  sections,
  selectedSection,
  onSelectSection,
  featureImportances,
  lccData,
  onDownloadSummaryCsv,
}) => {
  return (
    <div className="space-y-6">
      {/* Filters Bar */}
      <Controls
        sections={sections}
        selectedSectionId={selectedSection.Section_ID}
        onSelectSection={onSelectSection}
        surveyYear={selectedSection.Survey_Year}
      />

      {/* KPI Cards Row */}
      <KpiCards section={selectedSection} />

      {/* Row 1: PCI Trend & Parameters */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PciTrendChart
            sections={sections}
            selectedSectionId={selectedSection.Section_ID}
            onSelectSection={onSelectSection}
          />
        </div>
        <div className="lg:col-span-1">
          <ParametersCard section={selectedSection} />
        </div>
      </div>

      {/* Row 2: Actual vs Predicted & Feature Importance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <ActualVsPredictedChart sections={sections} />
        </div>
        <div>
          <FeatureImportanceChart importances={featureImportances} />
        </div>
      </div>

      {/* Row 3: Summary Table & LCC Quick Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SectionTable
            sections={sections}
            selectedSectionId={selectedSection.Section_ID}
            onSelectSection={onSelectSection}
            onDownloadCsv={onDownloadSummaryCsv}
          />
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border border-slate-200 p-5 card-shadow h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-2 border-b border-slate-100 pb-3 mb-4">
                <DollarSign className="w-5 h-5 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-800 tracking-tight">
                  Maintenance Cost Analysis (LCC)
                </h3>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm py-1 border-b border-slate-100">
                  <span className="text-slate-600 font-medium">Current Condition (PCI)</span>
                  <span className="font-bold text-slate-900">{selectedSection.PCI}</span>
                </div>

                <div className="flex justify-between items-center text-sm py-1 border-b border-slate-100">
                  <span className="text-slate-600 font-medium">Optimal Treatment</span>
                  <span className="font-extrabold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    {lccData ? lccData.optimal_treatment : 'Preventive Maintenance'}
                  </span>
                </div>

                <div className="flex justify-between items-center text-sm py-1 border-b border-slate-100">
                  <span className="text-slate-600 font-medium">Estimated LCC (per km)</span>
                  <span className="font-black text-slate-900">
                    ₹ {lccData ? lccData.optimal_lcc.toLocaleString() : '1,28,000'}
                  </span>
                </div>

                <div className="flex justify-between items-center text-sm py-1">
                  <span className="text-slate-600 font-medium">Life Extension (years)</span>
                  <span className="font-bold text-emerald-700 flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>6 – 8 years</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 p-3 bg-slate-50 rounded-md border border-slate-200 text-xs text-slate-600">
              <span className="font-bold text-slate-800 flex items-center space-x-1 mb-1">
                <Award className="w-3.5 h-3.5 text-blue-600" />
                <span>Screening Recommendation</span>
              </span>
              Optimal strategy is calculated based on condition triggers, present-value LCC, and minimum performance standards.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
