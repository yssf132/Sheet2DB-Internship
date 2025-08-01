"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.previewFile = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const xlsx_1 = __importDefault(require("xlsx"));
const previewFile = (req, res) => {
    const fileId = req.params.fileId;
    const filePath = path_1.default.join(__dirname, '../../uploads', fileId);
    //verify if the file exists 
    if (!fs_1.default.existsSync(filePath)) {
        res.status(404).json({
            status: 'error',
            message: 'File not found',
            error: 'The requested file does not exist'
        });
        return;
    }
    const extension = path_1.default.extname(filePath).toLowerCase();
    try {
        // reads files from xlsx / csv
        const workbook = xlsx_1.default.readFile(filePath, { type: 'file' });
        const sheetNames = workbook.SheetNames;
        // Process all sheets
        const sheetsPreview = {};
        sheetNames.forEach(sheetName => {
            const sheet = workbook.Sheets[sheetName];
            // converts to JSON
            const jsonData = xlsx_1.default.utils.sheet_to_json(sheet, { defval: '' });
            if (jsonData.length === 0) {
                sheetsPreview[sheetName] = { columns: [], rows: [] };
                return;
            }
            // gets columns from the first line
            const columns = Object.keys(jsonData[0]);
            const rows = jsonData.slice(0, 5); // returns first 5 lines
            sheetsPreview[sheetName] = { columns, rows };
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
    }
    catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error reading file',
            error: error.message
        });
    }
};
exports.previewFile = previewFile;
