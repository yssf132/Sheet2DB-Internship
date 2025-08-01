import React from 'react';
import { CheckCircle, XCircle, Database, Clock, AlertTriangle } from 'lucide-react';

export interface ImportResult {
  status: 'success' | 'error';
  message: string;
  description?: string;
  collection?: string;
  collectionStatus?: string;
  rowsInserted?: number;
  fieldsMapped?: number;
  executionTimeMs?: number;
  errorStats?: {
    errorRows: number;
    errorTypes: number;
    validRowsNotInserted: number;
  };
  errors?: string[];
}

interface ImportSummaryProps {
  result: ImportResult;
  onRetry?: () => void;
}

const ImportSummary: React.FC<ImportSummaryProps> = ({ result, onRetry }) => {
  const isSuccess = result.status === 'success';
  
  return (
    <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        {isSuccess ? (
          <CheckCircle className="w-8 h-8 text-green-500" />
        ) : (
          <XCircle className="w-8 h-8 text-red-500" />
        )}
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Import Operation Summary
          </h2>
          <p className="text-gray-600 mt-1">
            Results of the import operation
          </p>
        </div>
      </div>

      {/* Status Message */}
      <div className={`p-4 rounded-lg mb-6 ${
        isSuccess 
          ? 'bg-green-50 border border-green-200' 
          : 'bg-red-50 border border-red-200'
      }`}>
        <div className="flex items-center gap-2 mb-2">
          {isSuccess ? (
            <CheckCircle className="w-5 h-5 text-green-600" />
          ) : (
            <XCircle className="w-5 h-5 text-red-600" />
          )}
          <h3 className={`font-medium ${
            isSuccess ? 'text-green-800' : 'text-red-800'
          }`}>
            {result.message}
          </h3>
        </div>
        
        {result.description && (
          <p className={`text-sm ${
            isSuccess ? 'text-green-700' : 'text-red-700'
          }`}>
            {result.description}
          </p>
        )}
      </div>

      {/* Success Details */}
      {isSuccess && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {result.collection && (
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Database className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-900">Collection</p>
                <p className="text-sm text-gray-600">{result.collection}</p>
                {result.collectionStatus && (
                  <p className="text-xs text-gray-500 capitalize">
                    {result.collectionStatus}
                  </p>
                )}
              </div>
            </div>
          )}
          
          {result.rowsInserted !== undefined && (
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-900">Rows Inserted</p>
                <p className="text-sm text-gray-600">{result.rowsInserted}</p>
              </div>
            </div>
          )}
          
          {result.fieldsMapped !== undefined && (
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Database className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-900">Fields Mapped</p>
                <p className="text-sm text-gray-600">{result.fieldsMapped}</p>
              </div>
            </div>
          )}
          
          {result.executionTimeMs !== undefined && (
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Clock className="w-5 h-5 text-gray-600" />
              <div>
                <p className="text-sm font-medium text-gray-900">Execution Time</p>
                <p className="text-sm text-gray-600">{result.executionTimeMs}ms</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Error Details */}
      {!isSuccess && result.errorStats && (
        <div className="mb-6">
          <h4 className="font-medium text-gray-900 mb-3">Error Statistics</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <div>
                <p className="text-sm font-medium text-red-800">Error Rows</p>
                <p className="text-sm text-red-700">{result.errorStats.errorRows}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
              <XCircle className="w-5 h-5 text-red-600" />
              <div>
                <p className="text-sm font-medium text-red-800">Error Types</p>
                <p className="text-sm text-red-700">{result.errorStats.errorTypes}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-green-800">Valid Rows</p>
                <p className="text-sm text-green-700">{result.errorStats.validRowsNotInserted}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error List */}
      {!isSuccess && result.errors && result.errors.length > 0 && (
        <div className="mb-6">
          <h4 className="font-medium text-gray-900 mb-3">Error Details</h4>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <ul className="space-y-2">
              {result.errors.map((error, index) => (
                <li key={index} className="text-sm text-red-700 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                  {error}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Execution Time */}
      {result.executionTimeMs !== undefined && !isSuccess && (
        <div className="mb-6">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <Clock className="w-5 h-5 text-gray-600" />
            <div>
              <p className="text-sm font-medium text-gray-900">Execution Time</p>
              <p className="text-sm text-gray-600">{result.executionTimeMs}ms</p>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        {!isSuccess && (
          <button
            onClick={onRetry}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md font-medium transition-colors"
          >
            Retry Import
          </button>
        )}
      </div>
    </div>
  );
};

export default ImportSummary;
