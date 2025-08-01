import { Request, Response } from 'express';
import fs from 'fs';
import {
  getFilePath,
  loadSheetRows,
  validateRows,
  insertRowsToDB
} from '../services/ImportService';
import { ValidateAndImportRequest } from '../models/ImportTypes';

export const validateAndImport = async (req: Request, res: Response): Promise<void> => {
  const { fileId, requiredFields, fieldTypes } = req.body as ValidateAndImportRequest;

  const start = Date.now(); // mesure execution time

  const filePath = getFilePath(fileId);

  if (!fs.existsSync(filePath)) {
    res.status(404).json({ message: 'File not found' });
    return;
  }

  try {
    const { sheetName, rows } = loadSheetRows(filePath);

    const { validRows, errors } = validateRows(rows, requiredFields, fieldTypes);

    const executionTimeMs = Date.now() - start;

    if (errors.length > 0) {
      const uniqueErrorMessages = new Set<string>();
      const errorRowNumbers = new Set<number>();

      errors.forEach(error => {
        uniqueErrorMessages.add(error.split(':')[1]);
        const rowNumberMatch = error.match(/Row (\d+)/);
        if (rowNumberMatch) errorRowNumbers.add(Number(rowNumberMatch[1]));
      });

      res.status(400).json({
        status: 'error',
        message: 'Import Failed',
        description: 'Errors were detected during the import of your Excel file. Please correct them before retrying.',
        errorStats: {
          errorRows: errorRowNumbers.size,
          errorTypes: uniqueErrorMessages.size,
          validRowsNotInserted: validRows.length
        },
        errors,
        executionTimeMs
      });
      return;
    }

    const { insertedCount, collectionStatus } = await insertRowsToDB(sheetName, validRows);
    const executionTime = Date.now() - start;

    res.status(200).json({
      status: 'success',
      message: 'Import Completed Successfully',
      collection: sheetName,
      collectionStatus,
      rowsInserted: insertedCount,
      fieldsMapped: Object.keys(fieldTypes).length,
      executionTimeMs: executionTime
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Internal server error during import',
      error: (error as Error).message
    });
  }
};








