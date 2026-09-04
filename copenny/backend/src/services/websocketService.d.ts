import { Server as HttpServer } from 'http';
export declare function initializeWebSocket(server: HttpServer): void;
/**
 * Emit an event specifically to one user's room.
 * @param userId The ID of the user
 * @param event The event name (e.g., 'new-insight', 'action-complete')
 * @param data The payload
 */
export declare function emitToUser(userId: number, event: string, data: any): void;
/**
 * Emit an event globally to all connected clients.
 */
export declare function broadcast(event: string, data: any): void;
//# sourceMappingURL=websocketService.d.ts.map