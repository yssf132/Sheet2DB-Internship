import { env } from '../config/env';

export type FieldType = 'string' | 'integer' | 'float' | 'boolean' | 'date' | 'datetime' | 'time' | 'text' | 'decimal' | 'json';

export interface ProcessColumnsRequest {
  fileId: string;
  sheetName: string;
  requiredFields: string[];
  fieldTypes: Record<string, FieldType>;
  collection: string;
}

export const processColumns = async (data: ProcessColumnsRequest) => {
  const response = await fetch(`${env.API_BASE_URL}/validate-and-import`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    console.error(`Failed to process columns: ${response.statusText}`);
  }

  return await response.json();
};
