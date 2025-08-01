import { createContext, useState, useContext } from 'react';
import type { ReactNode } from 'react';
import type { PreviewData } from '../services/previewService';

interface SheetSelection {
  sheetName: string;
  selected : boolean;
  collection : string;
}

// Define the type for our context state
interface FileUploadContextType {
  selectedFile: File | null;
  setSelectedFile: (file: File | null) => void;
  previewData: PreviewData | null;
  setPreviewData: (data: PreviewData | null) => void;
  isUploading: boolean;
  setIsUploading: (isUploading: boolean) => void;
  isLoadingPreview: boolean;
  setIsLoadingPreview: (isLoading: boolean) => void;
  selectedColumns: string[];
  setSelectedColumns: (columns: string[]) => void;
  columnTypes: Record<string, string>;
  setColumnTypes: (types: Record<string, string>) => void;
  fileId: string | null;
  setFileId: (id: string | null) => void;
  sheetSelections: SheetSelection[];
  setSheetSelections: (selection: SheetSelection[]) => void;
  availableCollections: string[];
  setAvailableCollections: (collections: string[]) => void;
  currentSheet: string | null;
  setCurrentSheet: (sheet: string | null) => void;
}

// Create the context with a default value
export const FileUploadContext = createContext<FileUploadContextType | undefined>(undefined);

// Provider component
export function FileUploadProvider({ children }: { children: ReactNode }) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<PreviewData | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [columnTypes, setColumnTypes] = useState<Record<string, string>>({});
  const [fileId, setFileId] = useState<string | null>(null);
  const [sheetSelections, setSheetSelections] = useState<SheetSelection[]>([]);
  const [availableCollections, setAvailableCollections] = useState<string[]>([]);
  const [currentSheet, setCurrentSheet] = useState<string | null>(null);

  const value = {
    selectedFile,
    setSelectedFile,
    previewData,
    setPreviewData,
    isUploading,
    setIsUploading,
    isLoadingPreview,
    setIsLoadingPreview,
    selectedColumns,
    setSelectedColumns,
    columnTypes,
    setColumnTypes,
    fileId,
    setFileId,
    sheetSelections,
    setSheetSelections,
    availableCollections,
    setAvailableCollections,
    currentSheet,
    setCurrentSheet
  };

  return (
    <FileUploadContext.Provider value={value}>
      {children}
    </FileUploadContext.Provider>
  );
}

// Custom hook for using the context
export function useFileUpload() {
  const context = useContext(FileUploadContext);
  if (context === undefined) {
    throw new Error('useFileUpload must be used within a FileUploadProvider');
  }
  return context;
}
