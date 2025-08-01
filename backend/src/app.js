"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Main Express application setup
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
// import route de l'imprt
const UploadRoutes_1 = __importDefault(require("./routes/UploadRoutes"));
// import route preview file
const PreviewRoutes_1 = __importDefault(require("./routes/PreviewRoutes"));
//import route validate and import
const ImportRoutes_1 = __importDefault(require("./routes/ImportRoutes"));
// import auth routes
const AuthRoutes_1 = __importDefault(require("./routes/AuthRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true
}));
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true }));
// Routes
// Auth routes
app.use('/api/auth', AuthRoutes_1.default);
//route de l'import
app.use('/api', UploadRoutes_1.default);
// preview route
app.use('/api', PreviewRoutes_1.default);
// validate import route
app.use('/api', ImportRoutes_1.default);
// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
});
// Error handling middleware
app.use((error, req, res, next) => {
    console.error('Error:', error);
    // Mongoose validation error
    if (error.name === 'ValidationError') {
        const errors = Object.values(error.errors).map((e) => e.message);
        res.status(400).json({
            success: false,
            message: 'Validation Error',
            errors
        });
        return;
    }
    // Mongoose duplicate key error
    if (error.code === 11000) {
        const field = Object.keys(error.keyValue)[0];
        res.status(400).json({
            success: false,
            message: `${field} already exists`
        });
        return;
    }
    // JWT errors
    if (error.name === 'JsonWebTokenError') {
        res.status(401).json({
            success: false,
            message: 'Invalid token'
        });
        return;
    }
    if (error.name === 'TokenExpiredError') {
        res.status(401).json({
            success: false,
            message: 'Token expired'
        });
        return;
    }
    // Default error
    res.status(500).json({
        success: false,
        message: 'Internal server error'
    });
});
// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});
exports.default = app;
