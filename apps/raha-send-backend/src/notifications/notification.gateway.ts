import {
    WebSocketGateway,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    SubscribeMessage,
    MessageBody,
    ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@WebSocketGateway({
    namespace: 'notifications',
    cors: {
        origin: '*',
    },
})
export class NotificationGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
    @WebSocketServer()
    server: Server;

    private readonly logger = new Logger(NotificationGateway.name);
    private onlineUsers = new Map<string, string>(); // userId -> socketId

    constructor(
        private jwtService: JwtService,
        private configService: ConfigService,
    ) {
        console.log('NotificationGateway constructor called');
        this.logger.log('NotificationGateway constructor called');
    }

    afterInit(server: Server) {
        console.log('NotificationGateway afterInit called');
        this.logger.log('WebSocket Gateway initialized');
    }

    async handleConnection(client: Socket) {
        try {
            const token = this.extractToken(client);
            if (!token) {
                this.logger.warn(`Client ${client.id} disconnected: No token provided`);
                client.disconnect();
                return;
            }

            const payload = await this.jwtService.verifyAsync(token, {
                secret: this.configService.get('JWT_SECRET'),
            });

            const userId = payload.sub || payload.id;
            this.onlineUsers.set(userId, client.id);

            // Join user to their own room
            client.join(`user:${userId}`);

            // Store userId on socket data for disconnect handling
            client.data.userId = userId;

            this.logger.log(`User connected: ${userId} (Socket: ${client.id})`);
        } catch (error) {
            this.logger.error(`Client ${client.id} connection error: ${error.message}`);
            client.disconnect();
        }
    }

    handleDisconnect(client: Socket) {
        const userId = client.data.userId;
        if (userId) {
            this.onlineUsers.delete(userId);
            this.logger.log(`User disconnected: ${userId}`);
        }
    }

    isUserOnline(userId: string): boolean {
        return this.onlineUsers.has(userId);
    }

    sendToUser(userId: string, data: any) {
        this.server.to(`user:${userId}`).emit('notification', data);
    }

    private extractToken(client: Socket): string | undefined {
        const auth = client.handshake.auth?.token || client.handshake.headers?.authorization;
        if (!auth) return undefined;

        // Handle "Bearer <token>" format if present
        const [type, token] = auth.split(' ');
        return type === 'Bearer' ? token : auth;
    }
}
