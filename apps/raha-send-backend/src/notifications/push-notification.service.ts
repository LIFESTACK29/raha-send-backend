import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class PushNotificationService {
    private readonly logger = new Logger(PushNotificationService.name);
    private readonly expoApiUrl = 'https://exp.host/--/api/v2/push/send';

    constructor() {
        console.log('PushNotificationService initialized');
    }

    async sendToUser(pushToken: string, notification: any) {
        if (!this.isValidExpoPushToken(pushToken)) {
            this.logger.warn(`Invalid Expo push token: ${pushToken}`);
            return;
        }

        const message = {
            to: pushToken,
            sound: 'default',
            title: notification.title,
            body: notification.body,
            data: { type: notification.type, ...notification.data },
            priority: 'high',
            channelId: notification.type === 'ride' ? 'rides' : 'default',
        };

        try {
            await axios.post(this.expoApiUrl, message);
            this.logger.log(`Push notification sent to ${pushToken}`);
        } catch (error) {
            this.logger.error('Error sending push notification', error.response?.data || error.message);
        }
    }

    async sendToMultiple(pushTokens: string[], notification: any) {
        const validTokens = pushTokens.filter(token => this.isValidExpoPushToken(token));

        if (validTokens.length === 0) return;

        const messages = validTokens.map(token => ({
            to: token,
            sound: 'default',
            title: notification.title,
            body: notification.body,
            data: { type: notification.type, ...notification.data },
            priority: 'high',
            channelId: notification.type === 'ride' ? 'rides' : 'default',
        }));

        // Chunk messages (Expo limit is 100)
        const chunks = this.chunkArray(messages, 100);

        for (const chunk of chunks) {
            try {
                await axios.post(this.expoApiUrl, chunk);
                this.logger.log(`Batch push notification sent to ${chunk.length} devices`);
            } catch (error) {
                this.logger.error('Error sending batch push notification', error.response?.data || error.message);
            }
        }
    }

    private isValidExpoPushToken(token: string) {
        return typeof token === 'string' && token.startsWith('ExponentPushToken[');
    }

    private chunkArray<T>(array: T[], size: number): T[][] {
        const chunks: T[][] = [];
        for (let i = 0; i < array.length; i += size) {
            chunks.push(array.slice(i, i + size));
        }
        return chunks;
    }
}
