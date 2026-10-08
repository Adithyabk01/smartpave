import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { DashboardPage } from './pages/DashboardPage';
import { AiPredictionPage } from './pages/AiPredictionPage';
import { SectionSummaryPage } from './pages/SectionSummaryPage';
import { MaintenanceOptimizationPage } from './pages/MaintenanceOptimizationPage';
import { FuturePciPage } from './pages/FuturePciPage';
import { LccAnalysisPage } from './pages/LccAnalysisPage';
import { DataUploaderPage } from './pages/DataUploaderPage';
import { ReportViewPage } from './pages/ReportViewPage';

import type { Section, ModelMetrics, FeatureImportance, LccResponse, TabType } from './types';
import { getSections, getModelMetrics, getFeatureImportances, calculateLcc, fallbackSections } from './services/api';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [sections, setSections] = useState<Section[]>(fallbackSections);
  const [selectedSectionId, setSelectedSectionId] = useState<string>('S1');
  const [metrics, setMetrics] = useState<ModelMetrics | null>(null);
  const [featureImportances, setFeatureImportances] = useState<FeatureImportance[]>([]);
  const [lccData, setLccData] = useState<LccResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadAllData = async () => {
    setIsLoading(true);
    try {
      const secData = await getSections();
      setSections(secData);
      if (secData.length > 0 && !secData.find((s) => s.Section_ID === selectedSectionId)) {
        setSelectedSectionId(secData[0].Section_ID);
      }

      const met = await getModelMetrics();
      setMetrics(met);

      const feats = await getFeatureImportances();
      setFeatureImportances(feats);
    } catch (err) {
      console.warn('Error loading initial data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const selectedSection =
    sections.find((s) => s.Section_ID === selectedSectionId) ?? sections[0] ?? fallbackSections[0];

  useEffect(() => {
    if (selectedSection) {
      calculateLcc(selectedSection.Section_ID).then((res) => setLccData(res));
    }
  }, [selectedSectionId, sections]);

  const handleDownloadPredictionsCsv = () => {
    const headers = 'Section_ID,Start_Chainage,End_Chainage,Actual_PCI,Predicted_PCI,Condition,Recommended_Action\n';
    const rows = sections
      .map(
        (s) =>
          `"${s.Section_ID}","${s['Start Chainage']}","${s['End Chainage']}",${s.PCI},${s.Predicted_PCI ?? s.PCI},"${s.Condition}","${s.Recommended_Action}"`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'SmartPave_PCI_Predictions.csv';
    a.click();
  };

  const handleDownloadSummaryCsv = () => {
    const headers = 'Section_ID,Start_Chainage,End_Chainage,Length_m,Width_m,Area_m2,Age_yr,IRI,RI,Rutting,Texture,PCI,Predicted_PCI,Condition,Recommended_Action\n';
    const rows = sections
      .map(
        (s) =>
          `"${s.Section_ID}","${s['Start Chainage']}","${s['End Chainage']}",${s.Length_m},${s.Width_m},${s.Area_m2},${s.Age_yr},${s.IRI_m_per_km},${s.RI_mm_per_km},${s.Rutting_mm},${s.Texture_mm},${s.PCI},${s.Predicted_PCI ?? s.PCI},"${s.Condition}","${s.Recommended_Action}"`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'SmartPave_Section_Summary.csv';
    a.click();
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans antialiased text-slate-900">
      {/* Header */}
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {isLoading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent"></div>
            <p className="text-xs text-slate-500 font-medium mt-2">Loading SmartPave Engine...</p>
          </div>
        )}

        {!isLoading && (
          <>
            {activeTab === 'dashboard' && (
              <DashboardPage
                sections={sections}
                selectedSection={selectedSection}
                onSelectSection={setSelectedSectionId}
                featureImportances={featureImportances}
                lccData={lccData}
                onDownloadPredictionsCsv={handleDownloadPredictionsCsv}
                onDownloadSummaryCsv={handleDownloadSummaryCsv}
              />
            )}

            {activeTab === 'ai-prediction' && (
              <AiPredictionPage
                metrics={metrics}
                featureImportances={featureImportances}
                sections={sections}
              />
            )}

            {activeTab === 'summary' && (
              <SectionSummaryPage
                sections={sections}
                selectedSectionId={selectedSectionId}
                onSelectSection={setSelectedSectionId}
                onDownloadSummaryCsv={handleDownloadSummaryCsv}
              />
            )}

            {activeTab === 'maintenance' && (
              <MaintenanceOptimizationPage section={selectedSection} />
            )}

            {activeTab === 'future-pci' && <FuturePciPage section={selectedSection} />}

            {activeTab === 'lcc' && <LccAnalysisPage section={selectedSection} />}

            {activeTab === 'uploader' && <DataUploaderPage onDatasetUpdated={loadAllData} />}

            {activeTab === 'report' && (
              <ReportViewPage section={selectedSection} metrics={metrics} lccData={lccData} />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-4 text-xs text-slate-400 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <span className="font-bold text-white">SmartPave</span> | Pavement Inspection + Machine Learning + Life-Cycle Cost Analysis
          </div>
          <div>© 2026 SmartPave Prototype. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
};

export default App;
