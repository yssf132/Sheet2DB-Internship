import { env } from '../config/env';

export type FieldType = 'string' | 'integer' | 'float' | 'boolean' | 'date' | 'datetime' | 'time' | 'text' | 'decimal' | 'json';

export interface ProcessColumnsRequest {
  fileId: string;
  requiredFields: string[];
  fieldTypes: Record<string, FieldType>;
  collection: string;
}

const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem('auth_token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const processColumns = async (data: ProcessColumnsRequest) => {
  const token = localStorage.getItem('auth_token');
  if (!token) {
    throw new Error('Authentication required. Please log in first.');
  }

  // Add validation
  if (!data.collection || data.collection.trim() === '') {
    throw new Error('Please select a target collection before processing.');
  }

  if (!data.requiredFields || data.requiredFields.length === 0) {
    throw new Error('Please select at least one column to process.');
  }

  console.log('Sending data to backend:', data); // Debug log

  const response = await fetch(`${env.API_BASE_URL}/validate-and-import`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Authentication failed. Please log in again.');
    }
    
    // Try to get more detailed error information
    try {
      const errorData = await response.json();
      console.error('Backend error response:', errorData); // Debug log
      
      // If it's a validation error with specific error details, return that instead of generic error
      if (errorData.status === 'error' && errorData.errors && Array.isArray(errorData.errors)) {
        // Return the error data so the frontend can display validation errors properly
        throw { 
          isValidationError: true, 
          ...errorData 
        };
      }
      
      throw new Error(errorData.message || `Failed to process columns: ${response.statusText}`);
    } catch (parseError) {
      // If we couldn't parse the error or it was already thrown above, handle appropriately
      if (parseError && typeof parseError === 'object' && 'isValidationError' in parseError) {
        throw parseError; // Re-throw validation errors
      }
      console.error(`Failed to process columns: ${response.statusText}`);
      throw new Error(`Failed to process columns: ${response.statusText}`);
    }
  }

  return await response.json();
};
