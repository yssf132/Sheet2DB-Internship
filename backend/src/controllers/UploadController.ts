import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import xlsx from 'xlsx';
import { getAvailableCollections } from '../services/DatabaseService';

export const uploadFile = async (req: Request, res: Response): Promise<void> => {
  if (!req.file) {
    res.status(400).json({ message: 'No files received' });
    return;
  }

  const filePath = req.file.path;
  const extension = path.extname(filePath).toLowerCase();
  const originalName = req.file.originalname;
  const fileId = path.basename(filePath); // nom du fichier dans /uploads
  let sheetNames: string[] = [];

  if (extension === '.xlsx' || extension === '.xls' || extension === '.csv') {
    try {
      const workbook = xlsx.readFile(filePath);
      sheetNames = workbook.SheetNames || [];
    } catch (error) {
      res.status(500).json({ message: 'Error reading Excel file' });
      return;
    }
  }

  try {
    const availableCollections = await getAvailableCollections();
    
    res.status(200).json({
      status: 'success',
      data: {
        file: {
          fileId,
          originalName,
          extension,
          sheetNames
        },
        database: {
          availableCollections
        }
      },
      message: 'File uploaded successfully'
    });
  } catch (error) {
    console.error('Error in uploadFile:', error);
    res.status(500).json({ 
      status: 'error',
      message: 'Failed to process uploaded file',
      error: (error as Error).message
    });
  }
};
