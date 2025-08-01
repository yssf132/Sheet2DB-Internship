import { env } from '../config/env';

// Define the types for preview data
export interface PreviewData {
    columns: string[];
    rows: Record<string, any>[];
}

export const fetchPreviewData = async (id: string): Promise<PreviewData> => {
    const response = await fetch(`${env.API_BASE_URL}/preview/${id}`);
    
    if (!response.ok) {
        throw new Error(`Failed to fetch preview data: ${response.statusText}`);
    }
    
    return await response.json();
};
