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
exports.insertRowsToDB = exports.validateRows = exports.loadSheetRows = exports.getFilePath = void 0;
const path_1 = __importDefault(require("path"));
const xlsx_1 = __importDefault(require("xlsx"));
const mongoose_1 = __importDefault(require("mongoose"));
const ParseUtils_1 = require("../utils/ParseUtils");
const getFilePath = (fileId) => {
    return path_1.default.join(__dirname, '../../uploads', fileId);
};
exports.getFilePath = getFilePath;
const loadSheetRows = (filePath) => {
    const workbook = xlsx_1.default.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rows = xlsx_1.default.utils.sheet_to_json(sheet, { defval: '' });
    return { sheetName, rows };
};
exports.loadSheetRows = loadSheetRows;
const validateRows = (rows, requiredFields, fieldTypes) => {
    const validRows = [];
    const errors = [];
    const seenRows = new Set();
    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const rowErrors = [];
        const parsedRow = {};
        for (const field of requiredFields) {
            if (!row[field] && row[field] !== 0) {
                rowErrors.push(`Row ${i + 2}: Missing required field - ${field}`);
            }
        }
        for (const [field, expectedType] of Object.entries(fieldTypes)) {
            try {
                parsedRow[field] = (0, ParseUtils_1.parseCellValue)(row[field], expectedType);
            }
            catch (_a) {
                rowErrors.push(`Row ${i + 2}: Invalid format for ${field} (${row[field]})`);
            }
        }
        const rowSignature = JSON.stringify(parsedRow);
        if (seenRows.has(rowSignature)) {
            rowErrors.push(`Row ${i + 2}: Duplicate detected`);
        }
        if (rowErrors.length > 0) {
            errors.push(...rowErrors);
        }
        else {
            validRows.push(parsedRow);
            seenRows.add(rowSignature);
        }
    }
    return { validRows, errors };
};
exports.validateRows = validateRows;
const insertRowsToDB = (collectionName, validRows) => __awaiter(void 0, void 0, void 0, function* () {
    const db = mongoose_1.default.connection;
    if (!db.db)
        throw new Error('MongoDB not connected');
    const collectionNames = (yield db.db.listCollections().toArray()).map(c => c.name);
    const collectionStatus = collectionNames.includes(collectionName) ? 'collection found' : 'collection created';
    const result = yield db.collection(collectionName).insertMany(validRows);
    return {
        insertedCount: result.insertedCount,
        collectionStatus
    };
});
exports.insertRowsToDB = insertRowsToDB;
