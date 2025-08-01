"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const PreviewController_1 = require("../controllers/PreviewController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.get('/preview/:fileId', auth_1.authenticate, PreviewController_1.previewFile);
exports.default = router;
