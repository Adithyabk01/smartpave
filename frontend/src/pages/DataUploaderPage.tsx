import React, { useState } from 'react';
import { uploadDatasetFile } from '../services/api';
import type { UploadValidation } from '../types';
import { Upload, CheckCircle, AlertTriangle, FileSpreadsheet, RefreshCw } from 'lucide-react';

interface DataUploaderPageProps {
  onDatasetUpdated: () => void;
}

export const DataUploaderPage: React.FC<DataUploaderPageProps> = ({ onDatasetUpdated }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [validationResult, setValidationResult] = useState<UploadValidation | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setValidationResult(null);
      setErrorMsg(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setIsUploading(true);
    setErrorMsg(null);
    try {
      const result = await uploadDatasetFile(selectedFile);
      setValidationResult(result);
      if (result.is_valid) {
        onDatasetUpdated();
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.detail ?? 'Failed to upload and validate file.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="bg-white rounded-lg p-5 border border-slate-200 card-shadow">
        <div className="flex items-center space-x-2">
          <Upload className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-black text-slate-900">Dataset Upload & Validator</h2>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Upload custom Excel (.xlsx, .xls) or CSV (.csv) pavement inspection survey datasets.
        </p>
      </div>

      {/* Upload Drag & Drop Area */}
      <div className="bg-white rounded-lg border-2 border-dashed border-blue-300 p-8 card-shadow text-center flex flex-col items-center justify-center space-y-4 hover:border-blue-500 transition-colors">
        <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
          <FileSpreadsheet className="w-8 h-8" />
        </div>

        <div>
          <h3 className="text-base font-extrabold text-slate-900">Select Pavement Dataset File</h3>
          <p className="text-xs text-slate-500 mt-1">Supports XLSX, XLS, or CSV files</p>
        </div>

        <input
          type="file"
          accept=".xlsx,.xls,.csv"
          onChange={handleFileChange}
          className="hidden"
          id="dataset-upload-input"
        />

        <label
          htmlFor="dataset-upload-input"
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-md text-xs font-bold cursor-pointer transition shadow"
        >
          Browse Files
        </label>

        {selectedFile && (
          <div className="flex items-center space-x-2 bg-slate-100 px-3 py-1.5 rounded text-xs font-semibold text-slate-800">
            <span>Selected: {selectedFile.name}</span>
            <span className="text-slate-500 font-normal">({(selectedFile.size / 1024).toFixed(1)} KB)</span>
          </div>
        )}

        {selectedFile && (
          <button
            onClick={handleUpload}
            disabled={isUploading}
            className="flex items-center space-x-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold text-xs rounded-md shadow transition"
          >
            {isUploading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            <span>Validate & Import Dataset</span>
          </button>
        )}
      </div>

      {errorMsg && (
        <div className="bg-red-50 border border-red-300 text-red-900 p-4 rounded-lg text-xs flex items-center space-x-3">
          <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
          <div>
            <strong className="block font-bold">Error:</strong>
            {errorMsg}
          </div>
        </div>
      )}

      {/* Validation Report Result */}
      {validationResult && (
        <div className="bg-white rounded-lg border border-slate-200 p-5 card-shadow space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
            {validationResult.is_valid ? (
              <CheckCircle className="w-5 h-5 text-emerald-600" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-red-600" />
            )}
            <h3 className="text-sm font-bold text-slate-900">
              Validation Report: {validationResult.file_name}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="bg-slate-50 p-3 rounded border border-slate-200">
              <span className="text-slate-500 font-medium block">Total Sections</span>
              <span className="text-lg font-black text-slate-900">{validationResult.n_sections}</span>
            </div>

            <div className="bg-slate-50 p-3 rounded border border-slate-200">
              <span className="text-slate-500 font-medium block">Required Columns Status</span>
              <span
                className={`text-lg font-black ${
                  validationResult.missing_columns.length === 0 ? 'text-emerald-600' : 'text-red-600'
                }`}
              >
                {validationResult.required_columns_found.length} / 14 Found
              </span>
            </div>

            <div className="bg-slate-50 p-3 rounded border border-slate-200">
              <span className="text-slate-500 font-medium block">Validation Status</span>
              <span
                className={`text-lg font-black ${
                  validationResult.is_valid ? 'text-emerald-600' : 'text-red-600'
                }`}
              >
                {validationResult.is_valid ? 'VALID PASSED' : 'FAILED'}
              </span>
            </div>
          </div>

          {validationResult.missing_columns.length > 0 && (
            <div className="p-3 bg-red-50 border border-red-200 rounded text-xs text-red-900">
              <strong className="block font-bold mb-1">Missing Required Columns:</strong>
              <ul className="list-disc list-inside space-y-0.5 font-mono">
                {validationResult.missing_columns.map((col) => (
                  <li key={col}>{col}</li>
                ))}
              </ul>
            </div>
          )}

          {validationResult.is_valid && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded text-xs text-emerald-900 font-medium">
              ✓ File validated successfully. Dataset and Random Forest ML predictions updated!
            </div>
          )}
        </div>
      )}
    </div>
  );
};
