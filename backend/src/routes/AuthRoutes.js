"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const AuthController_1 = require("../controllers/AuthController");
const auth_1 = require("../middleware/auth");
const validation_1 = require("../middleware/validation");
const router = express_1.default.Router();
// Public routes
router.post('/register', validation_1.registerValidation, AuthController_1.register);
router.post('/login', validation_1.loginValidation, AuthController_1.login);
// Protected routes
router.get('/me', auth_1.authenticate, AuthController_1.getMe);
exports.default = router;
