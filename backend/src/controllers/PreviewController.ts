import { Request,Response } from "express";
import path from "path";
import fs from 'fs';
import xlsx from 'xlsx';

export const previewFile = (req: Request, res: Response): void => {
    const fileId = req.params.fileId;
    const filePath =path.join(__dirname,'../../uploads', fileId);

    //verify if the file exists 
    if(!fs.existsSync(filePath)){
        res.status(404).json({
            status: 'error',
            message: 'File not found',
            error: 'The requested file does not exist'
        });
        return;
    }

    const extension = path.extname(filePath).toLowerCase();

    try{
        // reads files from xlsx / csv
        const workbook = xlsx.readFile(filePath,{type : 'file'});
        const sheetNames = workbook.SheetNames;

        // Process all sheets
        const sheetsPreview: { [sheetName: string]: { columns: string[], rows: any[] } } = {};

        sheetNames.forEach(sheetName => {
            const sheet = workbook.Sheets[sheetName];
            
            // converts to JSON
            const jsonData = xlsx.utils.sheet_to_json(sheet,{defval: ''});

            if (jsonData.length === 0){
                sheetsPreview[sheetName] = {columns: [], rows: []};
                return;
            }

            // gets columns from the first line
            const columns = Object.keys(jsonData[0] as Record<string, any>);
            const rows = jsonData.slice(0,5); // returns first 5 lines

            sheetsPreview[sheetName] = {columns, rows};
        });

        res.status(200).json({
            status: 'success',
            data: {
                fileId,
                totalSheets: sheetNames.length,
                sheetNames,
                sheets: sheetsPreview
            },
            message: 'File preview generated successfully'
        });

    }catch(error){
        res.status(500).json({
            status: 'error',
            message: 'Error reading file',
            error: (error as Error).message
        });
    }
    
};