"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
// Destination et nom de fichier
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // stocké dans /uploads
    },
    filename: (req, file, cb) => {
        const ext = path_1.default.extname(file.originalname);
        const baseName = path_1.default.basename(file.originalname, ext);
        const timestamp = Date.now();
        const uniqueName = `${baseName}_${timestamp}${ext}`;
        cb(null, uniqueName);
    }
});
// Filtrer les formats autorisés
const fileFilter = (req, file, cb) => {
    const allowed = ['.xlsx', '.xls', '.csv'];
    const ext = path_1.default.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) {
        cb(null, true);
    }
    else {
        cb(new Error('Unauthorized format. Use .xlsx, .xls, or .csv.'));
    }
};
const upload = (0, multer_1.default)({
    storage,
    fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024, // Max file size: 10MB
        files: 1 // Max number of files per request
    }
});
exports.default = upload;
