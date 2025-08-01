import { Request,Response } from "express";
import path from "path";
import fs from 'fs';
import xlsx from 'xlsx';

export const previewFile = (req: Request, res: Response): void => {
    const fileId = req.params.fileId;
    const filePath =path.join(__dirname,'../../uploads', fileId);

    //verify if the file exists 
    if(!fs.existsSync(filePath)){
        res.status(404).json({Message : 'file is missing'});
        return;
    }

    const extension = path.extname(filePath).toLowerCase();

    try{
        // reads files from xlsx / csv
        const workbook = xlsx.readFile(filePath,{type : 'file'});
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        // converts to JSON
        const jsonData = xlsx.utils.sheet_to_json(sheet,{defval: ''});

        if (jsonData.length ===0){
            res.status(200).json({columns: [], rows: []});
            return;
        }

        // gets columns from the first line
        const columns = Object.keys(jsonData[0] as Record<string, any>);

        const rows = jsonData.slice(0,5); // returns first 5 lines

        res.status(200).json({columns, rows});

    }catch(error){
        res.status(500).json({message: 'Error reading file' , error});
    }
    
};