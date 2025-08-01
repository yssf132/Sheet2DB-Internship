"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginValidation = exports.registerValidation = void 0;
const joi_1 = __importDefault(require("joi"));
const registerValidation = (req, res, next) => {
    const schema = joi_1.default.object({
        name: joi_1.default.string().min(2).max(100).required(),
        email: joi_1.default.string().email().required(),
        password: joi_1.default.string().min(6).required()
    });
    const { error } = schema.validate(req.body);
    if (error) {
        res.status(400).json({
            success: false,
            message: error.details[0].message
        });
        return;
    }
    next();
};
exports.registerValidation = registerValidation;
const loginValidation = (req, res, next) => {
    const schema = joi_1.default.object({
        email: joi_1.default.string().email().required(),
        password: joi_1.default.string().required()
    });
    const { error } = schema.validate(req.body);
    if (error) {
        res.status(400).json({
            success: false,
            message: error.details[0].message
        });
        return;
    }
    next();
};
exports.loginValidation = loginValidation;
