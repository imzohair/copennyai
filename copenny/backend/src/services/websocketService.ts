import { Server, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';
import jwt from 'jsonwebtoken';

let io: Server;

const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_key_change_in_production';

export function initializeWebSocket(server: HttpServer) {
  io = new Server(server, {
    cors: {
      origin: '*', // For dev; adjust in prod
      methods: ['GET', 'POST'],
    },
  });

  // Authentication middleware
  io.use((socket: Socket, next) => {
    // We expect the token to be sent in the query string or auth payload
    const token = socket.handshake.auth.token || socket.handshake.query.token;

    if (!token) {
      return next(new Error('Authentication error: Token missing'));
    }

    try {
      const decoded = jwt.verify(token as string, JWT_SECRET) as { userId: number };
      // Attach userId to the socket
      (socket as any).userId = decoded.userId;
      next();
    } catch (err) {
      return next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', (socket: Socket) => {
    const userId = (socket as any).userId;
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
export function emitToUser(userId: number, event: string, data: any) {
  if (io) {
    io.to(`user_${userId}`).emit(event, data);
  } else {
    console.warn(`Attempted to emit '${event}' but WebSocket server is not initialized.`);
  }
}

/**
 * Emit an event globally to all connected clients.
 */
export function broadcast(event: string, data: any) {
  if (io) {
    io.emit(event, data);
  }
}
