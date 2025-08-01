"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ImportController_1 = require("../controllers/ImportController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.post('/validate-and-import', auth_1.authenticate, ImportController_1.validateAndImport);
exports.default = router;
