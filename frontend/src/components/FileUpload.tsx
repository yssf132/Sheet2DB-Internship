import { useState, useRef } from "react";
import { Upload } from "lucide-react";
import { uploadFile } from "../services/uploadService";
import { fetchPreviewData } from "../services/previewService";
import { useFileUpload } from "../context/FileUploadContext";
import toast from "react-hot-toast";

const FileUpload = () => {
    const [isDragOver, setIsDragOver] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    // Use the global context instead of local state
    const { 
        selectedFile, 
        setSelectedFile, 
        previewData, 
        setPreviewData, 
        isUploading, 
        setIsUploading,
        isLoadingPreview, 
        setIsLoadingPreview,
        setFileId
    } = useFileUpload();

    // Define accepted formats
    const acceptedFormats = ['.xlsx', '.xls', '.csv'];


    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragOver(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragOver(false);

        const file = e.dataTransfer.files[0];
        if (file && acceptedFormats.some((format: string) => file.name.endsWith(format))) {
            setSelectedFile(file);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    const handleChooseFile = () => {
        fileInputRef.current?.click();
    };

    const getPreviewData = async (id: string) => {
        setIsLoadingPreview(true);
        
        try {
            const data = await fetchPreviewData(id);
            setPreviewData(data);
        } catch (error) {
            toast.error('Failed to load preview data');
        } finally {
            setIsLoadingPreview(false);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) return;

        setIsUploading(true);

        try {
            // Use the uploadFile service function
            const result = await uploadFile(selectedFile);
            
            // Extract any useful info from the result
            const { originalName, fileId, sheetName } = result;
            
            toast.success(`File "${originalName}"${sheetName ? ` (Sheet: ${sheetName})` : ''} successfully uploaded!`);
            
            // Store the fileId in context for other components to use
            setFileId(fileId);
            
            // Fetch preview data if we have an ID
            if (fileId) {
                getPreviewData(fileId);
            } else {
                toast.error('Preview data not available');
            }
        } catch (error) {
            toast.error(`${error instanceof Error ? error.message : String(error)}`);
        } finally {
            setIsUploading(false);
        }
    };


    return (
        <div className="mx-auto">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    File Upload
                </h2>

                <div
                    className={`relative border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
                        isDragOver
                            ? "border-blue-400 bg-blue-50"
                            : "border-gray-300 bg-gray-50"
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={handleChooseFile}
                    style={{ cursor: "pointer" }}
                >
                    <div className="flex flex-col items-center gap-4">
                        <Upload className="w-8 h-8 text-gray-400" />                                                                

                        <div className="text-gray-600">
                            <p className="text-lg font-medium">Drop files here</p>
                            <p className="text-sm">
                                or click to browse ({acceptedFormats.join(", ")})
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleChooseFile();
                            }}
                            className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md font-medium transition-colors"
                        >
                            Choose File
                        </button>
                    </div>

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept={acceptedFormats.join(",")}
                        onChange={handleFileSelect}
                        className="hidden"
                    />
                </div>

                {selectedFile && (
                    <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-green-800 font-medium">File selected:</p>
                        <p className="text-green-700 text-sm">{selectedFile.name}</p>
                        
                        <button
                            onClick={handleUpload}
                            disabled={isUploading}
                            className="mt-3 px-4 py-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white rounded-md font-medium transition-colors"
                        >
                            {isUploading ? "Uploading..." : "Upload File"}
                        </button>
                    </div>
                )}

                {isLoadingPreview && (
                    <div className="mt-4 p-3 text-center">
                        <p className="text-gray-600">Loading preview data...</p>
                    </div>
                )}

                {previewData && (
                    <div className="mt-6 overflow-x-auto">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="text-lg font-semibold">Preview Data</h3>
                        </div>
                        
                        <table className="min-w-full divide-y divide-gray-200 border">
                            <thead className="bg-gray-50">
                                <tr>
                                    {previewData.columns?.map((column, idx) => (
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
                                {previewData.rows?.slice(0, 5).map((row, rowIdx) => (
                                    <tr key={rowIdx}>
                                        {previewData.columns?.map((column, colIdx) => (
                                            <td 
                                                key={`${rowIdx}-${colIdx}`} 
                                                className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                                            >
                                                {row[column] || ""}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {previewData.rows && (
                            <div className="mt-2 flex justify-between items-center">
                                <p className="text-sm text-gray-500">
                                    Showing first 5 of {previewData.rows.length} rows
                                </p>
                                <p className="text-sm text-gray-500">
                                    Use the table below to select columns for processing
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FileUpload;