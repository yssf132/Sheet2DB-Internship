import { env } from '../config/env';

const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem('auth_token');
  return {
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const uploadFile = async (file: File) => {
  if (!file) throw new Error('No file provided');
  
  const token = localStorage.getItem('auth_token');
  if (!token) {
    throw new Error('Authentication required. Please log in first.');
  }
  
  const MAX_SIZE = 10 * 1024 * 1024;
  if (file.size > MAX_SIZE) {
    throw new Error(`File size exceeds maximum allowed size of 10MB`);
  }

  const ACCEPTED_FORMATS = ['.xlsx', '.xls', '.csv'];
  const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
  if (!ACCEPTED_FORMATS.includes(fileExtension)) {
    throw new Error(`File format not supported. Accepted formats: ${ACCEPTED_FORMATS.join(', ')}`);
  }
  
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch(`${env.API_BASE_URL}/upload`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: formData
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Authentication failed. Please log in again.');
    }
    throw new Error(`Upload failed: ${response.statusText}`);
  }

  const result = await response.json();
  return result;
};
