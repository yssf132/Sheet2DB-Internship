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
exports.getMe = exports.login = exports.register = void 0;
const User_1 = __importDefault(require("../models/User"));
const jwt_1 = require("../utils/jwt");
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password } = req.body;
        // Check if user already exists
        const existingUser = yield User_1.default.findOne({ email });
        if (existingUser) {
            res.status(400).json({
                success: false,
                message: 'User with this email already exists'
            });
            return;
        }
        // Create new user
        const user = new User_1.default({ name, email, password });
        yield user.save();
        // Generate token
        const token = (0, jwt_1.generateToken)({ id: user._id });
        // Return user data (without password)
        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            },
            token
        });
    }
    catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during registration'
        });
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        // Find user and include password for comparison
        const user = yield User_1.default.findOne({ email }).select('+password');
        if (!user) {
            res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
            return;
        }
        // Check password
        const isPasswordValid = yield user.comparePassword(password);
        if (!isPasswordValid) {
            res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
            return;
        }
        // Generate token
        const token = (0, jwt_1.generateToken)({ id: user._id });
        // Return user data (without password)
        res.json({
            success: true,
            message: 'Login successful',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            },
            token
        });
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during login'
        });
    }
});
exports.login = login;
const getMe = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // req.user is set by authenticate middleware
        if (!req.user) {
            res.status(401).json({
                success: false,
                message: 'User not authenticated'
            });
            return;
        }
        res.json({
            success: true,
            user: {
                id: req.user._id,
                name: req.user.name,
                email: req.user.email,
                role: req.user.role
            }
        });
    }
    catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});
exports.getMe = getMe;
