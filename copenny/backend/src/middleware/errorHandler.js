"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    console.error(`[Error] ${statusCode} - ${message}`);
    if (err.stack) {
        console.error(err.stack);
    }
    res.status(statusCode).json({
        success: false,
        error: message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    });
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=errorHandler.js.map