"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const UploadMiddleware_1 = __importDefault(require("../middleware/UploadMiddleware"));
const UploadController_1 = require("../controllers/UploadController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// POST /api/upload
router.post('/upload', auth_1.authenticate, UploadMiddleware_1.default.single('file'), UploadController_1.uploadFile);
exports.default = router;
