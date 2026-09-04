"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    // Format: "Bearer <token>"
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ success: false, error: 'Access denied. No token provided.' });
    }
    try {
        const jwtSecret = process.env.JWT_SECRET || 'fallback_secret_for_development';
        const decoded = jsonwebtoken_1.default.verify(token, jwtSecret);
        // Attach the decoded token payload to the request object
        req.user = decoded;
        next();
    }
    catch (error) {
        return res.status(401).json({ success: false, error: 'Invalid token.' });
    }
};
exports.authenticateToken = authenticateToken;
//# sourceMappingURL=auth.js.map