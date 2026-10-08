import React from 'react';
import { ShieldCheck, BarChart3, Settings2, HelpCircle, Layers, FileSpreadsheet, Printer, LineChart, Cpu } from 'lucide-react';
import type { TabType } from '../types';

interface HeaderProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  return (
    <header className="bg-navy-header text-white shadow-md">
      {/* Top Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-600 p-2.5 rounded-lg flex items-center justify-center shadow-lg">
            <Layers className="w-7 h-7 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-extrabold tracking-tight text-white">SmartPave</h1>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-500/30 text-blue-200 border border-blue-400/30">AI Prototype</span>
            </div>
            <p className="text-xs text-blue-200 font-medium">AI-Powered Pavement Maintenance Dashboard</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs sm:text-sm font-semibold tracking-wide text-blue-200 uppercase">
            Smarter Roads <span className="text-blue-400 mx-1.5">|</span> Better Decisions <span className="text-blue-400 mx-1.5">|</span> Longer Life
          </p>
          <p className="text-xs text-slate-300 mt-0.5">Project Corridor: NH-275 (Mysuru, Karnataka)</p>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="bg-slate-900/80 border-t border-slate-700/60 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex overflow-x-auto space-x-1 py-1.5 scrollbar-thin">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center space-x-2 px-3 py-2 text-xs sm:text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'dashboard' ? 'bg-blue-600 text-white shadow' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Main Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('ai-prediction')}
            className={`flex items-center space-x-2 px-3 py-2 text-xs sm:text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'ai-prediction' ? 'bg-blue-600 text-white shadow' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>AI Prediction</span>
          </button>

          <button
            onClick={() => setActiveTab('summary')}
            className={`flex items-center space-x-2 px-3 py-2 text-xs sm:text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'summary' ? 'bg-blue-600 text-white shadow' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Section Summary</span>
          </button>

          <button
            onClick={() => setActiveTab('maintenance')}
            className={`flex items-center space-x-2 px-3 py-2 text-xs sm:text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'maintenance' ? 'bg-blue-600 text-white shadow' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Maintenance & Optimization</span>
          </button>

          <button
            onClick={() => setActiveTab('future-pci')}
            className={`flex items-center space-x-2 px-3 py-2 text-xs sm:text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'future-pci' ? 'bg-blue-600 text-white shadow' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <LineChart className="w-4 h-4" />
            <span>Future PCI Scenario</span>
          </button>

          <button
            onClick={() => setActiveTab('lcc')}
            className={`flex items-center space-x-2 px-3 py-2 text-xs sm:text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'lcc' ? 'bg-blue-600 text-white shadow' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Settings2 className="w-4 h-4" />
            <span>LCC Analysis</span>
          </button>

          <button
            onClick={() => setActiveTab('uploader')}
            className={`flex items-center space-x-2 px-3 py-2 text-xs sm:text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'uploader' ? 'bg-blue-600 text-white shadow' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>Dataset Validator</span>
          </button>

          <button
            onClick={() => setActiveTab('report')}
            className={`flex items-center space-x-2 px-3 py-2 text-xs sm:text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'report' ? 'bg-blue-600 text-white shadow' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Printer className="w-4 h-4" />
            <span>Viva Report View</span>
          </button>
        </div>
      </div>
    </header>
  );
};
