import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import type { FeatureImportance } from '../types';

interface FeatureImportanceChartProps {
  importances: FeatureImportance[];
}

export const FeatureImportanceChart: React.FC<FeatureImportanceChartProps> = ({ importances }) => {
  const COLORS = ['#2563eb', '#0284c7', '#0891b2', '#0d9488', '#059669'];

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-5 card-shadow h-full flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-slate-800 tracking-tight">Feature Importance (Random Forest)</h3>
        <span className="text-xs text-blue-600 font-semibold bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
          Calculated dynamically
        </span>
      </div>

      <div className="w-full h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={importances}
            margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
          >
            <XAxis type="number" domain={[0, 1]} tick={{ fontSize: 11, fill: '#64748b' }} />
            <YAxis dataKey="feature_name" type="category" tick={{ fontSize: 11, fill: '#334155', fontWeight: 600 }} width={100} />
            <Tooltip
              contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
              formatter={(val: any) => [(Number(val) * 100).toFixed(1) + '%', 'Relative Importance']}
            />
            <Bar dataKey="importance" radius={[0, 4, 4, 0]} barSize={18}>
              {importances.map((_, idx) => (
                <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-2 text-xs text-slate-500 text-center">
        Values represent Gini impurity importance extracted directly from <code className="text-blue-700 bg-blue-50 px-1 py-0.5 rounded">model.feature_importances_</code>.
      </div>
    </div>
  );
};
