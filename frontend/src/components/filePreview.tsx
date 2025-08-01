import React from "react";
import { useFileUpload } from "../context/FileUploadContext";

interface FilePreviewProps {
  currentSheet: string | null;
  setCurrentSheet: (sheet: string) => void;
}

const FilePreview: React.FC<FilePreviewProps> = ({ currentSheet, setCurrentSheet }) => {
  const { previewData, availableCollections, sheetSelections, setSheetSelections } = useFileUpload();

  if (!previewData || !currentSheet || !previewData.sheets[currentSheet]) {
    return null;
  }

  const sheetData = previewData.sheets[currentSheet];
  const currentSelection = sheetSelections.find(sel => sel.sheetName === currentSheet);

  const handleCollectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCollection = e.target.value;
    const updatedSelections = sheetSelections.map(sel =>
      sel.sheetName === currentSheet ? { ...sel, collection: newCollection } : sel
    );
    setSheetSelections(updatedSelections);
  };

  return (
    <div className="mt-6 overflow-x-auto">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold">Preview Data</h3>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-gray-300 mb-4">
        {previewData.sheetNames.map((sheetName) => (
          <button
            key={sheetName}
            onClick={() => setCurrentSheet(sheetName)}
            className={`px-4 py-2 text-sm font-medium ${currentSheet === sheetName
              ? "border-b-2 border-green-500 text-green-700"
              : "text-gray-600"
              }`}
          >
            {sheetName}
          </button>
        ))}
      </div>

      {/* Collection Selector */}
      <div className="mb-3">
        <label className="text-sm font-medium mr-2">Target Collection:</label>
        <div className="relative inline-block">
          <select
            className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm font-medium text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 cursor-pointer shadow-sm"
            value={currentSelection?.collection || ""}
            onChange={handleCollectionChange}
          >
            <option value="" disabled>
              Select a collection
            </option>
            {availableCollections.map((col) => (
              <option key={col} value={col}>
                {col}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Data Preview Table */}
      <table className="min-w-full divide-y divide-gray-200 border">
        <thead className="bg-gray-50">
          <tr>
            {sheetData.columns?.map((column, idx) => (
              <th
                key={idx}
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sheetData.rows?.slice(0, 5).map((row, rowIdx) => (
            <tr key={rowIdx}>
              {sheetData.columns?.map((column, colIdx) => (
                <td
                  key={`${rowIdx}-${colIdx}`}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                >
                  {row[column] !== undefined && row[column] !== null ? String(row[column]) : ""}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-2 flex justify-between items-center">
        <p className="text-sm text-gray-500">
          Showing first 5 of {sheetData.rows.length} rows
        </p>
        <p className="text-sm text-gray-500">
          Use the table below to select columns for processing
        </p>
      </div>
    </div>
  );
};

export default FilePreview;
