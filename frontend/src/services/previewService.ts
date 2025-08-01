import { env } from '../config/env';

export interface SheetPreview {
    columns: string[];
    rows: Record<string, any>[];
}
// Define the types for preview data
export interface PreviewData {
    fileId: string;
    totalSheets: number;
    sheetNames: string[];
    sheets: {
        [key: string]: SheetPreview;
    };
}

export const fetchPreviewData = async (id: string): Promise<PreviewData> => {
    const response = await fetch(`${env.API_BASE_URL}/preview/${id}`);

    if (!response.ok) {
        throw new Error(`Failed to fetch preview data: ${response.statusText}`);
    }

    const json = await response.json();

    if (json.status !== "success") {
        throw new Error(`API Error : ${json.message || "Unknown error"}`);
    }


    return json.data;
};
