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
    const token = localStorage.getItem('auth_token');
    if (!token) {
        throw new Error('Authentication required. Please log in first.');
    }

    const response = await fetch(`${env.API_BASE_URL}/preview/${id}`, {
        method: 'GET',
        headers: {
            ...(token && { Authorization: `Bearer ${token}` }),
        }
    });

    if (!response.ok) {
        if (response.status === 401) {
            throw new Error('Authentication failed. Please log in again.');
        }
        throw new Error(`Failed to fetch preview data: ${response.statusText}`);
    }

    const json = await response.json();

    if (json.status !== "success") {
        throw new Error(`API Error : ${json.message || "Unknown error"}`);
    }


    return json.data;
};
