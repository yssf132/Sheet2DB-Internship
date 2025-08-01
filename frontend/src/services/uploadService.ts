import { env } from '../config/env';

export const uploadFile = async (file: File) => {
  if (!file) throw new Error('No file provided');
  
  // Validate file size (10MB max)
  const MAX_SIZE = 10 * 1024 * 1024; // 10MB
  if (file.size > MAX_SIZE) {
    throw new Error(`File size exceeds maximum allowed size of 10MB`);
  }

  // Validate file format
  const ACCEPTED_FORMATS = ['.xlsx', '.xls', '.csv'];
  const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
  if (!ACCEPTED_FORMATS.includes(fileExtension)) {
    throw new Error(`File format not supported. Accepted formats: ${ACCEPTED_FORMATS.join(', ')}`);
  }
  
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch(`${env.API_BASE_URL}/upload`, {
    method: 'POST',
    body: formData
  });

  if (!response.ok) {
    throw new Error(`Upload failed: ${response.statusText}`);
  }

  const result = await response.json();
  return result;
};
