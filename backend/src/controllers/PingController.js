"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ping = void 0;
const ping = (req, res) => {
    res.status(200).json({ message: 'pong' });
};
exports.ping = ping;
