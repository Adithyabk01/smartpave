import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import type { Section } from '../types';

interface ActualVsPredictedChartProps {
  sections: Section[];
}

export const ActualVsPredictedChart: React.FC<ActualVsPredictedChartProps> = ({ sections }) => {
  const chartData = sections.map((sec) => ({
    section: sec.Section_ID,
    'Actual PCI': sec.PCI,
    'Predicted PCI': sec.Predicted_PCI ?? sec.PCI,
  }));

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-5 card-shadow h-full flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-slate-800 tracking-tight">Actual vs Predicted PCI</h3>
        <span className="text-xs text-slate-500 font-medium">Random Forest Model Fit</span>
      </div>

      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 20, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="section" tick={{ fontSize: 12, fill: '#64748b' }} />
            <YAxis domain={[40, 100]} tick={{ fontSize: 12, fill: '#64748b' }} />
            <Tooltip
              contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
            />
            <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '12px', fontWeight: 600 }} />
            <Line
              type="monotone"
              dataKey="Actual PCI"
              stroke="#1d4ed8"
              strokeWidth={2.5}
              dot={{ r: 4, fill: '#1d4ed8' }}
            />
            <Line
              type="monotone"
              dataKey="Predicted PCI"
              stroke="#ea580c"
              strokeWidth={2.5}
              strokeDasharray="4 4"
              dot={{ r: 4, fill: '#ea580c' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-2 text-xs text-center text-slate-500">
        Blue line = Surveyed PCI; Orange dashed line = Random Forest ML model estimate.
      </div>
    </div>
  );
};
