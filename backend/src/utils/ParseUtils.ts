import { FieldType } from '../models/ImportTypes';

export const parseCellValue = (value: any, expectedType: FieldType): any => {
  if (value === undefined || value === null || value === '') return null;

  try {
    switch (expectedType) {
      case 'string':
      case 'text':
        return String(value);
      case 'integer':
        const intVal = parseInt(value);
        if (isNaN(intVal)) throw new Error('Invalid integer');
        return intVal;
      case 'float':
      case 'decimal':
        const floatVal = parseFloat(value);
        if (isNaN(floatVal)) throw new Error('Invalid float');
        return floatVal;
      case 'boolean':
        if (value === 'true' || value === true) return true;
        if (value === 'false' || value === false) return false;
        throw new Error('Invalid boolean');
      case 'json':
        return typeof value === 'object' ? value : JSON.parse(value);
      case 'date':
      case 'datetime':
      case 'time':
        if (value instanceof Date) return value;
        if (typeof value === 'string' && !isNaN(Date.parse(value))) return new Date(value);
        if (typeof value === 'number') {
          const excelEpoch = new Date(Date.UTC(1899, 11, 30));
          return new Date(excelEpoch.getTime() + value * 24 * 60 * 60 * 1000);
        }
        throw new Error('Invalid date');
    }
  } catch {
    throw new Error(`Invalid ${expectedType}`);
  }
};

