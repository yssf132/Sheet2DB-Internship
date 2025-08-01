"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadFile = void 0;
const path_1 = __importDefault(require("path"));
const xlsx_1 = __importDefault(require("xlsx"));
const DatabaseService_1 = require("../services/DatabaseService");
const uploadFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.file) {
        res.status(400).json({ message: 'No files received' });
        return;
    }
    const filePath = req.file.path;
    const extension = path_1.default.extname(filePath).toLowerCase();
    const originalName = req.file.originalname;
    const fileId = path_1.default.basename(filePath); // nom du fichier dans /uploads
    let sheetNames = [];
    if (extension === '.xlsx' || extension === '.xls' || extension === '.csv') {
        try {
            const workbook = xlsx_1.default.readFile(filePath);
            sheetNames = workbook.SheetNames || [];
        }
        catch (error) {
            res.status(500).json({ message: 'Error reading Excel file' });
            return;
        }
    }
    try {
        const availableCollections = yield (0, DatabaseService_1.getAvailableCollections)();
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
    }
    catch (error) {
        console.error('Error in uploadFile:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to process uploaded file',
            error: error.message
        });
    }
});
exports.uploadFile = uploadFile;
