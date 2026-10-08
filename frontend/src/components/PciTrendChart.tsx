import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceDot } from 'recharts';
import type { Section } from '../types';

interface PciTrendChartProps {
  sections: Section[];
  selectedSectionId: string;
  onSelectSection: (sectionId: string) => void;
}

export const PciTrendChart: React.FC<PciTrendChartProps> = ({
  sections,
  selectedSectionId,
  onSelectSection,
}) => {
  const chartData = sections.map((sec) => ({
    section: sec.Section_ID,
    pci: sec.PCI,
    predicted: sec.Predicted_PCI ?? sec.PCI,
    isSelected: sec.Section_ID === selectedSectionId,
  }));

  const selectedDataPoint = chartData.find((d) => d.section === selectedSectionId);

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-5 card-shadow h-full flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-slate-800 tracking-tight">PCI Trend by Section</h3>
        <span className="text-xs text-slate-500 font-medium">Sections S1 – S12</span>
      </div>

      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 10, right: 20, left: -20, bottom: 5 }}
            onClick={(e) => {
              if (e && e.activeLabel) {
                onSelectSection(String(e.activeLabel));
              }
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="section" tick={{ fontSize: 12, fill: '#64748b' }} />
            <YAxis domain={[40, 100]} tick={{ fontSize: 12, fill: '#64748b' }} />
            <Tooltip
              contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
              itemStyle={{ color: '#60a5fa' }}
              formatter={(val: any) => [`PCI: ${val}`, 'PCI Score']}
            />
            <Line
              type="monotone"
              dataKey="pci"
              stroke="#0284c7"
              strokeWidth={3}
              activeDot={{ r: 8, stroke: '#0284c7', strokeWidth: 2, fill: '#38bdf8' }}
              dot={(props: any) => {
                const { cx, cy, payload } = props;
                const isSel = payload.section === selectedSectionId;
                return (
                  <circle
                    key={payload.section}
                    cx={cx}
                    cy={cy}
                    r={isSel ? 7 : 4}
                    fill={isSel ? '#ef4444' : '#0284c7'}
                    stroke="#ffffff"
                    strokeWidth={2}
                    className="cursor-pointer transition-all"
                    onClick={() => onSelectSection(payload.section)}
                  />
                );
              }}
            />

            {selectedDataPoint && (
              <ReferenceDot
                x={selectedDataPoint.section}
                y={selectedDataPoint.pci}
                r={8}
                fill="#ef4444"
                stroke="#ffffff"
                strokeWidth={2}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-2 text-xs text-center text-slate-500 italic">
        Click any section point to switch section view. Red marker highlights active selection ({selectedSectionId}).
      </div>
    </div>
  );
};
