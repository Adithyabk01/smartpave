import React from 'react';
import type { Section } from '../types';

interface KpiCardsProps {
  section: Section;
}

export const KpiCards: React.FC<KpiCardsProps> = ({ section }) => {
  const pci = section.PCI;
  const predictedPci = section.Predicted_PCI ?? pci;
  const condition = section.Condition ?? 'Very Good';
  const action = section.Recommended_Action ?? 'Preventive Maintenance Assessment';

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* CURRENT PCI */}
      <div className="kpi-current-pci rounded-lg p-5 border-2 card-shadow flex flex-col justify-between transition-all hover:scale-[1.01]">
        <div className="text-xs font-extrabold uppercase tracking-wider opacity-80">CURRENT PCI</div>
        <div className="text-4xl sm:text-5xl font-black my-2 tracking-tight text-yellow-950">
          {pci}
        </div>
        <div className="text-xs font-semibold opacity-70">Surveyed Score (0-100)</div>
      </div>

      {/* PREDICTED PCI */}
      <div className="kpi-predicted-pci rounded-lg p-5 border-2 card-shadow flex flex-col justify-between transition-all hover:scale-[1.01]">
        <div className="text-xs font-extrabold uppercase tracking-wider opacity-80">PREDICTED PCI</div>
        <div className="text-4xl sm:text-5xl font-black my-2 tracking-tight text-orange-950">
          {predictedPci}
        </div>
        <div className="text-xs font-semibold opacity-70">Random Forest Prediction</div>
      </div>

      {/* CONDITION */}
      <div className="kpi-condition rounded-lg p-5 border-2 card-shadow flex flex-col justify-between transition-all hover:scale-[1.01]">
        <div className="text-xs font-extrabold uppercase tracking-wider opacity-80">CONDITION</div>
        <div className="text-2xl sm:text-3xl font-extrabold my-2 tracking-tight text-emerald-950 leading-snug">
          {condition}
        </div>
        <div className="text-xs font-semibold opacity-70">Dashboard Rating</div>
      </div>

      {/* RECOMMENDED ACTION */}
      <div className="kpi-recommended-action rounded-lg p-5 border-2 card-shadow flex flex-col justify-between transition-all hover:scale-[1.01]">
        <div className="text-xs font-extrabold uppercase tracking-wider opacity-80">RECOMMENDED ACTION</div>
        <div className="text-lg sm:text-xl font-extrabold my-2 tracking-tight text-sky-950 leading-snug">
          {action}
        </div>
        <div className="text-xs font-semibold opacity-70">Screening Strategy</div>
      </div>
    </div>
  );
};
