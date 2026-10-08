import React from 'react';
import type { Section } from '../types';
import { ShieldCheck, Info, CheckCircle2 } from 'lucide-react';

interface MaintenanceOptimizationPageProps {
  section: Section;
}

export const MaintenanceOptimizationPage: React.FC<MaintenanceOptimizationPageProps> = ({ section }) => {
  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-lg p-5 border border-slate-200 card-shadow flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-black text-slate-900">Maintenance Decision & Optimization</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Intervention screening rules, priority matrix, and optimal strategy for Section {section.Section_ID}.
          </p>
        </div>

        <div className="bg-blue-50 px-3 py-1.5 rounded border border-blue-200 text-xs font-bold text-blue-900">
          Section Selected: {section.Section_ID} ({section['Start Chainage']} - {section['End Chainage']})
        </div>
      </div>

      {/* Selected Section Current Status */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-slate-200 card-shadow">
          <span className="text-xs font-bold text-slate-500 uppercase">Current PCI</span>
          <div className="text-3xl font-black text-slate-900 mt-1">{section.PCI}</div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 card-shadow">
          <span className="text-xs font-bold text-slate-500 uppercase">Condition Rating</span>
          <div className="text-lg font-extrabold text-emerald-800 mt-1">{section.Condition}</div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 card-shadow md:col-span-2">
          <span className="text-xs font-bold text-slate-500 uppercase">AI Recommended Action</span>
          <div className="text-base font-extrabold text-blue-900 mt-1">{section.Recommended_Action}</div>
        </div>
      </div>

      {/* Decision Guidelines Table */}
      <div className="bg-white rounded-lg border border-slate-200 card-shadow overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200">
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">
            Application Screening Rules & Interventions Matrix
          </h3>
          <p className="text-xs text-slate-500">
            Rule-based maintenance decision framework evaluated against current PCI ratings.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-900 text-white font-bold uppercase text-[11px]">
              <tr>
                <th className="py-3 px-4">PCI Range</th>
                <th className="py-3 px-4">Condition Band</th>
                <th className="py-3 px-4">Screening Recommendation</th>
                <th className="py-3 px-4">Priority Level</th>
                <th className="py-3 px-4 text-center">Active for Section {section.Section_ID}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              <tr className={section.PCI >= 85 ? 'bg-emerald-50 font-bold border-l-4 border-l-emerald-600' : ''}>
                <td className="py-3 px-4 font-mono">≥ 85</td>
                <td className="py-3 px-4 text-emerald-800 font-bold">Excellent</td>
                <td className="py-3 px-4">Routine Monitoring</td>
                <td className="py-3 px-4 text-slate-500">Low (Routine)</td>
                <td className="py-3 px-4 text-center">
                  {section.PCI >= 85 && <CheckCircle2 className="w-5 h-5 text-emerald-600 mx-auto" />}
                </td>
              </tr>

              <tr className={section.PCI >= 70 && section.PCI < 85 ? 'bg-emerald-50 font-bold border-l-4 border-l-emerald-600' : ''}>
                <td className="py-3 px-4 font-mono">70 – 84</td>
                <td className="py-3 px-4 text-emerald-700 font-bold">Very Good</td>
                <td className="py-3 px-4">Preventive Maintenance Assessment</td>
                <td className="py-3 px-4 text-blue-700 font-semibold">Medium-Low</td>
                <td className="py-3 px-4 text-center">
                  {section.PCI >= 70 && section.PCI < 85 && <CheckCircle2 className="w-5 h-5 text-emerald-600 mx-auto" />}
                </td>
              </tr>

              <tr className={section.PCI >= 55 && section.PCI < 70 ? 'bg-amber-50 font-bold border-l-4 border-l-amber-600' : ''}>
                <td className="py-3 px-4 font-mono">55 – 69</td>
                <td className="py-3 px-4 text-amber-800 font-bold">Good</td>
                <td className="py-3 px-4">Preventive / Minor Rehabilitation Assessment</td>
                <td className="py-3 px-4 text-amber-700 font-semibold">Medium</td>
                <td className="py-3 px-4 text-center">
                  {section.PCI >= 55 && section.PCI < 70 && <CheckCircle2 className="w-5 h-5 text-amber-600 mx-auto" />}
                </td>
              </tr>

              <tr className={section.PCI >= 40 && section.PCI < 55 ? 'bg-orange-50 font-bold border-l-4 border-l-orange-600' : ''}>
                <td className="py-3 px-4 font-mono">40 – 54</td>
                <td className="py-3 px-4 text-orange-800 font-bold">Fair</td>
                <td className="py-3 px-4">Rehabilitation Assessment</td>
                <td className="py-3 px-4 text-orange-700 font-bold">High</td>
                <td className="py-3 px-4 text-center">
                  {section.PCI >= 40 && section.PCI < 55 && <CheckCircle2 className="w-5 h-5 text-orange-600 mx-auto" />}
                </td>
              </tr>

              <tr className={section.PCI >= 25 && section.PCI < 40 ? 'bg-red-50 font-bold border-l-4 border-l-red-600' : ''}>
                <td className="py-3 px-4 font-mono">25 – 39</td>
                <td className="py-3 px-4 text-red-800 font-bold">Poor</td>
                <td className="py-3 px-4">Major Rehabilitation Assessment</td>
                <td className="py-3 px-4 text-red-700 font-black">Urgent</td>
                <td className="py-3 px-4 text-center">
                  {section.PCI >= 25 && section.PCI < 40 && <CheckCircle2 className="w-5 h-5 text-red-600 mx-auto" />}
                </td>
              </tr>

              <tr className={section.PCI < 25 ? 'bg-red-100 font-bold border-l-4 border-l-red-700' : ''}>
                <td className="py-3 px-4 font-mono">&lt; 25</td>
                <td className="py-3 px-4 text-red-900 font-black">Very Poor / Failed</td>
                <td className="py-3 px-4">Reconstruction Assessment</td>
                <td className="py-3 px-4 text-red-900 font-black">Critical</td>
                <td className="py-3 px-4 text-center">
                  {section.PCI < 25 && <CheckCircle2 className="w-5 h-5 text-red-700 mx-auto" />}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Distinction Note */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-xs text-slate-700 flex items-start space-x-3">
        <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-slate-900 block mb-1">
            Distinguishing "Lowest Cost" from "Recommended Strategy":
          </span>
          The lowest-cost treatment is not automatically recommended if it fails to meet structural standards or structural integrity triggers. The SmartPave recommendation integrates pavement condition, expected life extension, and present-value Life-Cycle Cost.
        </div>
      </div>
    </div>
  );
};
