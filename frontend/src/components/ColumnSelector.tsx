import { useState } from 'react';
import { useFileUpload } from '../context/FileUploadContext';
import { processColumns } from '../services/processService';
import type { FieldType } from '../services/processService';
import ImportSummary, { type ImportResult } from './ImportSummary';
import toast from 'react-hot-toast';

const COLUMN_TYPES = [
  { value: 'string', label: 'String' },
  { value: 'integer', label: 'Integer' },
  { value: 'float', label: 'Float' },
  { value: 'boolean', label: 'Boolean' },
  { value: 'date', label: 'Date' },
  { value: 'datetime', label: 'DateTime' },
  { value: 'time', label: 'Time' },
  { value: 'text', label: 'Text (Long String)' },
  { value: 'decimal', label: 'Decimal' },
  { value: 'json', label: 'JSON' }
];

const ColumnSelector = () => {
  const {
    previewData,
    selectedColumns,
    setSelectedColumns,
    columnTypes,
    setColumnTypes,
    fileId,
    currentSheet,
    setCurrentSheet,
    sheetSelections
  } = useFileUpload();
  
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);


  const columns = currentSheet && previewData ? previewData.sheets[currentSheet]?.columns || [] : [];
  const rows = currentSheet && previewData ? previewData.sheets[currentSheet]?.rows || [] : [];

  const currentSelection = sheetSelections.find(sel => sel.sheetName === currentSheet);

  const handleSelectColumn = (column: string, isSelected: boolean) => {
    if (isSelected) {
      setSelectedColumns([...selectedColumns, column]);
      if (!columnTypes[column]) {
        setColumnTypes({ ...columnTypes, [column]: 'string' });
      }
    } else {
      setSelectedColumns(selectedColumns.filter(col => col !== column));
    }
  };

  const handleSelectAll = () => {
    if (columns.length > 0) {
      if (selectedColumns.length === columns.length) {
        setSelectedColumns([]);
      } else {
        setSelectedColumns([...columns]);
        const newTypes = { ...columnTypes };
        columns.forEach(column => {
          if (!newTypes[column]) {
            newTypes[column] = 'string';
          }
        });
        setColumnTypes(newTypes);
      }
    }
  };

  const handleTypeChange = (column: string, type: string) => {
    setColumnTypes({ ...columnTypes, [column]: type });
  };

  const handleSubmit = async () => {
    if (!previewData || selectedColumns.length === 0) {
      toast.error('Please select at least one column to process');
      return;
    }
    if (!fileId) {
      toast.error('File ID is missing');
      return;
    }
    if (!currentSheet) {
      toast.error('No sheet selected');
      return;
    }

    const currentSelection = sheetSelections.find(sel => sel.sheetName === currentSheet);
    if (!currentSelection || !currentSelection.collection) {
      toast.error('Please select a target collection for the current sheet');
      return;
    }

    setIsProcessing(true);
    setImportResult(null);
    try {
      const fieldTypes: Record<string, FieldType> = {};
      selectedColumns.forEach(column => {
        fieldTypes[column] = (columnTypes[column] || 'string') as FieldType;
      });
      const result = await processColumns({
        fileId,
        sheetName: currentSheet,
        requiredFields: selectedColumns,
        fieldTypes,
        collection: currentSelection.collection
      });
      setImportResult(result);
      if (result.status === 'success') {
        toast.success('Import completed successfully!');
      } else {
        toast.error('Import failed - please check the details below');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to process columns');
      console.error('Failed to process columns:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!previewData || !currentSheet || columns.length === 0) return null;

  return (
    <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Select Columns to Process</h2>
        <div className="flex gap-2 items-center">
          {previewData.sheetNames.length > 1 && (
            <select
              value={currentSheet || ''}
              onChange={e => setCurrentSheet(e.target.value)}
              className="px-2 py-1 border rounded text-sm mr-2"
            >
              {previewData.sheetNames.map(sheetName => (
                <option key={sheetName} value={sheetName}>{sheetName}</option>
              ))}
            </select>
          )}
          <button
            onClick={handleSelectAll}
            className="px-3 py-1 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors"
          >
            {selectedColumns.length === columns.length ? 'Deselect All' : 'Select All'}
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 border">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Select
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Column Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Data Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sample Data
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {columns.map((column, idx) => {
              const sampleValue = rows[0]?.[column];
              return (
                <tr key={idx} className={selectedColumns.includes(column) ? 'bg-blue-50' : ''}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      id={`column-${idx}`}
                      checked={selectedColumns.includes(column)}
                      onChange={(e) => handleSelectColumn(column, e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {column}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {selectedColumns.includes(column) && (
                      <select
                        value={columnTypes[column] || 'string'}
                        onChange={(e) => handleTypeChange(column, e.target.value)}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      >
                        {COLUMN_TYPES.map(type => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {sampleValue !== undefined && sampleValue !== null
                      ? String(sampleValue)
                      : ""}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex justify-between items-center">
        <p className="text-sm font-medium text-blue-600">
          {selectedColumns.length} of {columns.length} columns selected
        </p>
        {selectedColumns.length > 0 && (
          <button
            onClick={handleSubmit}
            disabled={isProcessing}
            className="px-4 py-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white rounded-md font-medium transition-colors"
          >
            {isProcessing ? 'Processing...' : `Process ${selectedColumns.length} Column${selectedColumns.length !== 1 ? 's' : ''}`}
          </button>
        )}
      </div>
      {importResult && (
        <ImportSummary
          result={importResult}
          onRetry={() => setImportResult(null)}
        />
      )}
    </div>
  );
};

export default ColumnSelector;

