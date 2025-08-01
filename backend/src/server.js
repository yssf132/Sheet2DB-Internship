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
// Server entry point (starts app)
const app_1 = __importDefault(require("./app"));
const db_1 = __importDefault(require("./config/db"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
dotenv_1.default.config();
const PORT = process.env.PORT || 5000;
// Connexion à la base, puis démarrage du serveur
(0, db_1.default)().then(() => {
    const server = app_1.default.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}`);
        console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
    // Graceful shutdown
    process.on('SIGINT', () => __awaiter(void 0, void 0, void 0, function* () {
        console.log('\nShutting down gracefully...');
        server.close(() => {
            mongoose_1.default.connection.close().then(() => {
                console.log('Database connection closed.');
                process.exit(0);
            });
        });
    }));
    process.on('SIGTERM', () => __awaiter(void 0, void 0, void 0, function* () {
        console.log('SIGTERM received. Shutting down gracefully...');
        server.close(() => {
            mongoose_1.default.connection.close().then(() => {
                console.log('Database connection closed.');
                process.exit(0);
            });
        });
    }));
});
