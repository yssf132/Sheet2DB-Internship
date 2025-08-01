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
exports.validateAndImport = void 0;
const fs_1 = __importDefault(require("fs"));
const ImportService_1 = require("../services/ImportService");
const validateAndImport = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { fileId, requiredFields, fieldTypes, collection } = req.body;
    const start = Date.now(); // mesure execution time
    const filePath = (0, ImportService_1.getFilePath)(fileId);
    if (!fs_1.default.existsSync(filePath)) {
        res.status(404).json({ message: 'File not found' });
        return;
    }
    try {
        const { sheetName, rows } = (0, ImportService_1.loadSheetRows)(filePath);
        const { validRows, errors } = (0, ImportService_1.validateRows)(rows, requiredFields, fieldTypes);
        const executionTimeMs = Date.now() - start;
        if (errors.length > 0) {
            const uniqueErrorMessages = new Set();
            const errorRowNumbers = new Set();
            errors.forEach(error => {
                uniqueErrorMessages.add(error.split(':')[1]);
                const rowNumberMatch = error.match(/Row (\d+)/);
                if (rowNumberMatch)
                    errorRowNumbers.add(Number(rowNumberMatch[1]));
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
        const { insertedCount, collectionStatus } = yield (0, ImportService_1.insertRowsToDB)(collection, validRows);
        const executionTime = Date.now() - start;
        res.status(200).json({
            status: 'success',
            message: 'Import Completed Successfully',
            collection: collection,
            collectionStatus,
            rowsInserted: insertedCount,
            fieldsMapped: Object.keys(fieldTypes).length,
            executionTimeMs: executionTime
        });
    }
    catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Internal server error during import',
            error: error.message
        });
    }
});
exports.validateAndImport = validateAndImport;
