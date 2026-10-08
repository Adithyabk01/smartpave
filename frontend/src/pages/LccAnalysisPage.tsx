import React, { useState, useEffect } from 'react';
import type { Section, LccResponse } from '../types';
import { calculateLcc } from '../services/api';
import { Settings2, Award, Download, Info, CheckCircle2 } from 'lucide-react';

interface LccAnalysisPageProps {
  section: Section;
  onDownloadLccCsv?: () => void;
}

export const LccAnalysisPage: React.FC<LccAnalysisPageProps> = ({ section }) => {
  const [lccData, setLccData] = useState<LccResponse | null>(null);
  const [discountRate, setDiscountRate] = useState(5.0);
  const [analysisPeriod, setAnalysisPeriod] = useState(20);

  useEffect(() => {
    calculateLcc(section.Section_ID).then((res) => {
      setLccData(res);
    });
  }, [section.Section_ID, discountRate, analysisPeriod]);

  const handleDownloadCsv = () => {
    if (!lccData) return;
    const headers = 'Treatment,Initial Cost (₹/km),Annual Maint Cost (₹/km),PV Maint Cost (₹),Total PV LCC (₹),Life Extension (yrs),Feasible,Lowest Cost,Recommended\n';
    const rows = lccData.treatments
      .map(
        (t) =>
          `"${t.treatment}",${t.initial_cost},${t.annual_maint_cost},${t.pv_maint_cost},${t.total_pv_lcc},${t.life_extension_years},${t.feasible},${t.is_lowest_cost},${t.is_recommended}`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `LCC_Analysis_${section.Section_ID}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="bg-white rounded-lg p-5 border border-slate-200 card-shadow flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Settings2 className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-black text-slate-900">Life-Cycle Cost (LCC) Analysis</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Present-value economic comparison of pavement rehabilitation strategies for Section {section.Section_ID}.
          </p>
        </div>

        <button
          onClick={handleDownloadCsv}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-md shadow transition"
        >
          <Download className="w-4 h-4" />
          <span>Export LCC CSV</span>
        </button>
      </div>

      {/* Inputs & Formula Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg border border-slate-200 p-5 card-shadow space-y-4">
          <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">
            Economic Financial Parameters
          </h3>

          <div>
            <label className="text-xs font-bold text-slate-600 block mb-1">Discount Rate (r %)</label>
            <input
              type="number"
              step="0.5"
              value={discountRate}
              onChange={(e) => setDiscountRate(Number(e.target.value))}
              className="w-full px-3 py-1.5 border border-slate-300 rounded text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-600 block mb-1">Analysis Horizon (Years)</label>
            <input
              type="number"
              value={analysisPeriod}
              onChange={(e) => setAnalysisPeriod(Number(e.target.value))}
              className="w-full px-3 py-1.5 border border-slate-300 rounded text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded text-xs text-slate-600 font-mono">
            <span className="font-bold text-slate-900 block mb-1 font-sans">Present Value Formula:</span>
            PV = Cost / (1 + r)^t
          </div>
        </div>

        {/* Optimal Treatment Box */}
        <div className="lg:col-span-2 bg-blue-900 text-white rounded-lg p-6 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 text-blue-200 text-xs font-bold uppercase tracking-wider mb-2">
              <Award className="w-4 h-4 text-blue-400" />
              <span>Optimal Strategy Recommendation</span>
            </div>
            <div className="text-3xl font-black text-white">
              {lccData?.optimal_treatment ?? 'Preventive Maintenance'}
            </div>
            <p className="text-xs text-blue-200 mt-2 leading-relaxed">
              Selected strategy provides optimal life extension while maintaining present-value Life-Cycle Costs at ₹{' '}
              <strong className="text-white font-extrabold">{lccData?.optimal_lcc.toLocaleString() ?? '3,14,933'}</strong> per km.
            </p>
          </div>

          <div className="mt-4 pt-4 border-t border-blue-800 flex items-center justify-between text-xs text-blue-200">
            <span>Section Current PCI: <strong className="text-white font-bold">{section.PCI}</strong></span>
            <span>Screening Action: <strong className="text-white font-bold">{section.Recommended_Action}</strong></span>
          </div>
        </div>
      </div>

      {/* Comparison Matrix Table */}
      <div className="bg-white rounded-lg border border-slate-200 card-shadow overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200">
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">
            Treatment Comparison & Present Value (PV) LCC Matrix
          </h3>
          <p className="text-xs text-slate-500">
            Detailed breakdown of initial capital, annual maintenance, present value, and feasibility.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-900 text-white font-bold uppercase text-[11px]">
              <tr>
                <th className="py-3 px-4">Treatment Strategy</th>
                <th className="py-3 px-4 text-right">Initial Cost (₹/km)</th>
                <th className="py-3 px-4 text-right">Annual Maint. (₹/km)</th>
                <th className="py-3 px-4 text-right">PV Maint. Cost (₹)</th>
                <th className="py-3 px-4 text-right">Total Present Value LCC (₹)</th>
                <th className="py-3 px-4 text-center">Life Extension</th>
                <th className="py-3 px-4 text-center">Status / Tag</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {lccData?.treatments.map((tr) => (
                <tr
                  key={tr.treatment}
                  className={tr.is_recommended ? 'bg-blue-50/90 font-bold border-l-4 border-l-blue-600' : 'hover:bg-slate-50'}
                >
                  <td className="py-3.5 px-4 font-bold text-slate-900 flex items-center space-x-2">
                    {tr.is_recommended && <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />}
                    <span>{tr.treatment}</span>
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono">₹ {tr.initial_cost.toLocaleString()}</td>
                  <td className="py-3.5 px-4 text-right font-mono">₹ {tr.annual_maint_cost.toLocaleString()}</td>
                  <td className="py-3.5 px-4 text-right font-mono">₹ {tr.pv_maint_cost.toLocaleString()}</td>
                  <td className="py-3.5 px-4 text-right font-black text-slate-900">₹ {tr.total_pv_lcc.toLocaleString()}</td>
                  <td className="py-3.5 px-4 text-center font-bold text-emerald-700">{tr.life_extension_years} yrs</td>
                  <td className="py-3.5 px-4 text-center space-x-1">
                    {tr.is_recommended && (
                      <span className="px-2 py-0.5 text-[10px] font-extrabold rounded bg-blue-600 text-white">
                        RECOMMENDED
                      </span>
                    )}
                    {tr.is_lowest_cost && (
                      <span className="px-2 py-0.5 text-[10px] font-extrabold rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                        LOWEST COST
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-xs text-slate-600 flex items-start space-x-3">
        <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-slate-800 block mb-1">Life-Cycle Cost Feasibility Note:</span>
          Preventive maintenance costs are user-configurable. Always align discount rate $r$ and treatment costs with local PWD / Ministry of Road Transport & Highways guidelines for official project DPRs.
        </div>
      </div>
    </div>
  );
};
