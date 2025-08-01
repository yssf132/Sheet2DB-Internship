import fs from 'fs';
import path from 'path';
import xlsx from 'xlsx';
import mongoose from 'mongoose';
import { FieldType } from '../models/ImportTypes';
import { parseCellValue } from '../utils/ParseUtils';

export const getFilePath = (fileId: string): string => {
  return path.join(__dirname, '../../uploads', fileId);
};

export const loadSheetRows = (filePath: string): { sheetName: string; rows: Record<string, any>[] } => {
  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const rows = xlsx.utils.sheet_to_json<Record<string, any>>(sheet, { defval: '' });
  return { sheetName, rows };
};

export const validateRows = (
  rows: any[],
  requiredFields: string[],
  fieldTypes: Record<string, FieldType>
): { validRows: any[]; errors: string[] } => {
  const validRows: any[] = [];
  const errors: string[] = [];
  const seenRows = new Set<string>();

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const rowErrors: string[] = [];
    const parsedRow: Record<string, any> = {};

    for (const field of requiredFields) {
      if (!row[field] && row[field] !== 0) {
        rowErrors.push(`Row ${i + 2}: Missing required field - ${field}`);
      }
    }

    for (const [field, expectedType] of Object.entries(fieldTypes)) {
      try {
        parsedRow[field] = parseCellValue(row[field], expectedType);
      } catch {
        rowErrors.push(`Row ${i + 2}: Invalid format for ${field} (${row[field]})`);
      }
    }

    const rowSignature = JSON.stringify(parsedRow);
    if (seenRows.has(rowSignature)) {
      rowErrors.push(`Row ${i + 2}: Duplicate detected`);
    }

    if (rowErrors.length > 0) {
      errors.push(...rowErrors);
    } else {
      validRows.push(parsedRow);
      seenRows.add(rowSignature);
    }
  }

  return { validRows, errors };
};

export const insertRowsToDB = async (
  collectionName: string,
  validRows: any[]
): Promise<{ insertedCount: number; collectionStatus: string }> => {
  const db = mongoose.connection;

  if (!db.db) throw new Error('MongoDB not connected');

  const collectionNames = (await db.db.listCollections().toArray()).map(c => c.name);
  const collectionStatus = collectionNames.includes(collectionName) ? 'collection found' : 'collection created';

  const result = await db.collection(collectionName).insertMany(validRows);

  return {
    insertedCount: result.insertedCount,
    collectionStatus
  };
};
