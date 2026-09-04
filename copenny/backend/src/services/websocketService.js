"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeWebSocket = initializeWebSocket;
exports.emitToUser = emitToUser;
exports.broadcast = broadcast;
const socket_io_1 = require("socket.io");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
let io;
const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_key_change_in_production';
function initializeWebSocket(server) {
    io = new socket_io_1.Server(server, {
        cors: {
            origin: '*', // For dev; adjust in prod
            methods: ['GET', 'POST'],
        },
    });
    // Authentication middleware
    io.use((socket, next) => {
        // We expect the token to be sent in the query string or auth payload
        const token = socket.handshake.auth.token || socket.handshake.query.token;
        if (!token) {
            return next(new Error('Authentication error: Token missing'));
        }
        try {
            const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
            // Attach userId to the socket
            socket.userId = decoded.userId;
            next();
        }
        catch (err) {
            return next(new Error('Authentication error: Invalid token'));
        }
    });
    io.on('connection', (socket) => {
        const userId = socket.userId;
        console.log(`WebSocket client connected: User ${userId} [Socket ID: ${socket.id}]`);
        // Join a unique room for this user
        socket.join(`user_${userId}`);
        socket.on('disconnect', () => {
            console.log(`WebSocket client disconnected: User ${userId} [Socket ID: ${socket.id}]`);
        });
    });
}
/**
 * Emit an event specifically to one user's room.
 * @param userId The ID of the user
 * @param event The event name (e.g., 'new-insight', 'action-complete')
 * @param data The payload
 */
function emitToUser(userId, event, data) {
    if (io) {
        io.to(`user_${userId}`).emit(event, data);
    }
    else {
        console.warn(`Attempted to emit '${event}' but WebSocket server is not initialized.`);
    }
}
/**
 * Emit an event globally to all connected clients.
 */
function broadcast(event, data) {
    if (io) {
        io.emit(event, data);
    }
}
//# sourceMappingURL=websocketService.js.map