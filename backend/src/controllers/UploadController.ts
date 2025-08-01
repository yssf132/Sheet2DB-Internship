import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import xlsx from 'xlsx';

export const uploadFile = (req: Request, res: Response): void => {
  if (!req.file) {
    res.status(400).json({ message: 'No files received' });
    return;
  }

  const filePath = req.file.path;
  const extension = path.extname(filePath).toLowerCase();
  const originalName = req.file.originalname;
  const fileId = path.basename(filePath); // nom du fichier dans /uploads
  let sheetName: string | null = null;

  if (extension === '.xlsx' || extension === '.xls' || extension === '.csv') {
    try {
      const workbook = xlsx.readFile(filePath);
      const sheets = workbook.SheetNames;
      sheetName = sheets[0] || null;
    } catch (error) {
      res.status(500).json({ message: 'Error reading Excel file' });
      return;
    }
  }

  res.status(200).json({
    fileId,
    originalName,
    extension,
    sheetName
  });
};
