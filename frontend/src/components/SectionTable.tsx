import React, { useState } from 'react';
import { Search, ArrowUpDown, Download } from 'lucide-react';
import type { Section } from '../types';

interface SectionTableProps {
  sections: Section[];
  selectedSectionId: string;
  onSelectSection: (sectionId: string) => void;
  onDownloadCsv?: () => void;
}

export const SectionTable: React.FC<SectionTableProps> = ({
  sections,
  selectedSectionId,
  onSelectSection,
  onDownloadCsv,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof Section>('Section_ID');
  const [sortAsc, setSortAsc] = useState(true);

  const handleSort = (field: keyof Section) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const getConditionBadgeClass = (condition?: string) => {
    switch (condition) {
      case 'Excellent':
        return 'badge-excellent';
      case 'Very Good':
        return 'badge-very-good';
      case 'Good':
        return 'badge-good';
      case 'Fair':
        return 'badge-fair';
      case 'Poor':
        return 'badge-poor';
      default:
        return 'badge-failed';
    }
  };

  const filteredSections = sections.filter(
    (sec) =>
      sec.Section_ID.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sec['Start Chainage'].includes(searchTerm) ||
      sec['End Chainage'].includes(searchTerm) ||
      (sec.Condition && sec.Condition.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const sortedSections = [...filteredSections].sort((a, b) => {
    const valA = a[sortField] ?? '';
    const valB = b[sortField] ?? '';

    if (typeof valA === 'number' && typeof valB === 'number') {
      return sortAsc ? valA - valB : valB - valA;
    }
    return sortAsc
      ? String(valA).localeCompare(String(valB))
      : String(valB).localeCompare(String(valA));
  });

  return (
    <div className="bg-white rounded-lg border border-slate-200 card-shadow overflow-hidden">
      {/* Table Controls */}
      <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50">
        <div>
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">
            Section-wise Summary & Maintenance Recommendation
          </h3>
          <p className="text-xs text-slate-500">
            Click any row to view detailed parameters and charts for that section.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {/* Search Box */}
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-slate-400 absolute left-2.5" />
            <input
              type="text"
              placeholder="Search section or condition..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-white border border-slate-300 rounded-md text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 w-48 sm:w-60"
            />
          </div>

          {onDownloadCsv && (
            <button
              onClick={onDownloadCsv}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-bold transition shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          )}
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-700">
          <thead className="bg-slate-900 text-white font-bold uppercase tracking-wider text-[11px]">
            <tr>
              <th
                onClick={() => handleSort('Section_ID')}
                className="py-3 px-4 cursor-pointer hover:bg-slate-800"
              >
                <div className="flex items-center space-x-1">
                  <span>Section</span>
                  <ArrowUpDown className="w-3 h-3 opacity-60" />
                </div>
              </th>
              <th className="py-3 px-4">Chainage (km)</th>
              <th
                onClick={() => handleSort('PCI')}
                className="py-3 px-4 cursor-pointer hover:bg-slate-800 text-right"
              >
                <div className="flex items-center justify-end space-x-1">
                  <span>Current PCI</span>
                  <ArrowUpDown className="w-3 h-3 opacity-60" />
                </div>
              </th>
              <th
                onClick={() => handleSort('Predicted_PCI')}
                className="py-3 px-4 cursor-pointer hover:bg-slate-800 text-right"
              >
                <div className="flex items-center justify-end space-x-1">
                  <span>Predicted PCI</span>
                  <ArrowUpDown className="w-3 h-3 opacity-60" />
                </div>
              </th>
              <th className="py-3 px-4 text-center">Condition</th>
              <th className="py-3 px-4">Recommended Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {sortedSections.map((sec) => {
              const isSelected = sec.Section_ID === selectedSectionId;
              return (
                <tr
                  key={sec.Section_ID}
                  onClick={() => onSelectSection(sec.Section_ID)}
                  className={`cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-blue-50/90 border-l-4 border-l-blue-600 font-bold'
                      : 'hover:bg-slate-50'
                  }`}
                >
                  <td className="py-3 px-4 font-bold text-slate-900">{sec.Section_ID}</td>
                  <td className="py-3 px-4 font-mono text-slate-600">
                    {sec['Start Chainage']} - {sec['End Chainage']}
                  </td>
                  <td className="py-3 px-4 text-right font-black text-slate-900">{sec.PCI}</td>
                  <td className="py-3 px-4 text-right font-black text-orange-700">
                    {sec.Predicted_PCI ?? sec.PCI}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-extrabold ${getConditionBadgeClass(
                        sec.Condition
                      )}`}
                    >
                      {sec.Condition}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-800">
                    {sec.Recommended_Action}
                  </td>
                </tr>
              );
            })}
            {sortedSections.length === 0 && (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-500 italic">
                  No sections match search term "{searchTerm}".
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
