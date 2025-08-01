export type FieldType =
  | 'string'
  | 'integer'
  | 'float'
  | 'boolean'
  | 'date'
  | 'datetime'
  | 'time'
  | 'text'
  | 'decimal'
  | 'json';

export interface ValidateAndImportRequest {
  fileId: string;
  requiredFields: string[];
  fieldTypes: Record<string, FieldType>;
}
