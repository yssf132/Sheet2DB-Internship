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
exports.getAvailableCollections = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const getAvailableCollections = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!mongoose_1.default.connection || !mongoose_1.default.connection.db) {
            console.warn('MongoDB connection not established');
            return [];
        }
        const collections = yield mongoose_1.default.connection.db.listCollections().toArray();
        return collections.map(col => col.name).filter(name => !name.startsWith('system.'));
    }
    catch (error) {
        console.error('Error getting collections:', error);
        return [];
    }
});
exports.getAvailableCollections = getAvailableCollections;
