import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine } from 'recharts';
import type { Section, FuturePciResponse } from '../types';
import { getFuturePciScenario } from '../services/api';
import { LineChart as LineChartIcon, AlertTriangle, Sliders, Info } from 'lucide-react';

interface FuturePciPageProps {
  section: Section;
}

export const FuturePciPage: React.FC<FuturePciPageProps> = ({ section }) => {
  const [forecastYears, setForecastYears] = useState(5);
  const [annualDecline, setAnnualDecline] = useState(2.5);
  const [minPci, setMinPci] = useState(60.0);
  const [scenarioData, setScenarioData] = useState<FuturePciResponse | null>(null);

  useEffect(() => {
    getFuturePciScenario(section.Section_ID, section.PCI, forecastYears, annualDecline, minPci).then((res) => {
      setScenarioData(res);
    });
  }, [section.Section_ID, section.PCI, forecastYears, annualDecline, minPci]);

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="bg-white rounded-lg p-5 border border-slate-200 card-shadow flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <LineChartIcon className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-black text-slate-900">Illustrative Future PCI Scenario</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Simulate future pavement condition deterioration over a multi-year forecast horizon for Section {section.Section_ID}.
          </p>
        </div>

        <div className="bg-blue-50 px-3 py-1.5 rounded border border-blue-200 text-xs font-bold text-blue-900">
          Current PCI: {section.PCI}
        </div>
      </div>

      {/* Mandatory Academic Disclaimer Warning */}
      <div className="bg-amber-50 border border-amber-300 rounded-lg p-4 text-xs text-amber-900 flex items-start space-x-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-extrabold block text-amber-950">Illustrative Scenario Disclaimer:</span>
          This is an illustrative scenario and is not a calibrated deterioration model. When multi-year historical survey data become available, this will be replaced with a calibrated deterioration curve.
        </div>
      </div>

      {/* Scenario Controls & Chart Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls Card */}
        <div className="bg-white rounded-lg border border-slate-200 p-5 card-shadow space-y-5">
          <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
            <Sliders className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-800">Scenario Simulation Controls</h3>
          </div>

          <div>
            <div className="flex justify-between items-center text-xs font-bold text-slate-700 mb-1">
              <span>Forecast Horizon</span>
              <span className="text-blue-600 font-extrabold">{forecastYears} Years</span>
            </div>
            <input
              type="range"
              min={3}
              max={15}
              value={forecastYears}
              onChange={(e) => setForecastYears(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
            <span className="text-[11px] text-slate-400">Simulate 2026 to {2026 + forecastYears}</span>
          </div>

          <div>
            <div className="flex justify-between items-center text-xs font-bold text-slate-700 mb-1">
              <span>Annual PCI Decline Rate</span>
              <span className="text-blue-600 font-extrabold">{annualDecline} PCI pts / yr</span>
            </div>
            <input
              type="range"
              min={0.5}
              max={8.0}
              step={0.5}
              value={annualDecline}
              onChange={(e) => setAnnualDecline(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
            <span className="text-[11px] text-slate-400">Assumed rate of deterioration</span>
          </div>

          <div>
            <div className="flex justify-between items-center text-xs font-bold text-slate-700 mb-1">
              <span>Minimum Acceptable PCI Trigger</span>
              <span className="text-red-600 font-extrabold">{minPci} PCI</span>
            </div>
            <input
              type="range"
              min={40}
              max={75}
              step={1}
              value={minPci}
              onChange={(e) => setMinPci(Number(e.target.value))}
              className="w-full accent-red-600 cursor-pointer"
            />
            <span className="text-[11px] text-slate-400">Threshold requiring intervention</span>
          </div>

          {scenarioData?.trigger_year ? (
            <div className="p-3 bg-red-50 border border-red-200 rounded text-xs text-red-900 font-medium">
              <strong className="block text-red-950 font-bold">Intervention Trigger Year:</strong>
              PCI drops below threshold ({minPci}) in year <span className="font-black text-red-700">{scenarioData.trigger_year}</span>.
            </div>
          ) : (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded text-xs text-emerald-900 font-medium">
              <strong className="block text-emerald-950 font-bold">Condition Safe:</strong>
              PCI remains above minimum threshold ({minPci}) throughout the {forecastYears}-year horizon.
            </div>
          )}
        </div>

        {/* Future PCI Line Chart */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-slate-200 p-5 card-shadow flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-800">Future PCI Deterioration Trajectory</h3>
            <span className="text-xs text-slate-500 font-semibold">Section {section.Section_ID}</span>
          </div>

          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={scenarioData?.points ?? []} margin={{ top: 10, right: 20, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="year_label" tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis domain={[30, 100]} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '12px', fontWeight: 600 }} />
                <ReferenceLine y={minPci} label={`Min Threshold (${minPci})`} stroke="#ef4444" strokeDasharray="3 3" />
                <Line
                  type="monotone"
                  dataKey="future_pci"
                  name="Projected PCI"
                  stroke="#0284c7"
                  strokeWidth={3}
                  dot={{ r: 5, fill: '#0284c7' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-2 text-xs text-slate-500 text-center flex items-center justify-center space-x-1">
            <Info className="w-3.5 h-3.5 text-blue-600" />
            <span>Red dashed horizontal line represents minimum acceptable PCI threshold limit ({minPci}).</span>
          </div>
        </div>
      </div>
    </div>
  );
};
