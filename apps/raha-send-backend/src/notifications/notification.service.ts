import { Injectable, Logger } from '@nestjs/common';
import { NotificationGateway } from './notification.gateway';
import { PushNotificationService } from './push-notification.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Rider, IRider } from '@app/common'; // Assuming Rider is in @app/common

export interface NotificationPayload {
    title: string;
    body: string;
    type: 'ride' | 'payment' | 'alert' | 'info';
    data?: any;
}

@Injectable()
export class NotificationService {
    private readonly logger = new Logger(NotificationService.name);

    constructor(
        private readonly notificationGateway: NotificationGateway,
        private readonly pushNotificationService: PushNotificationService,
        @InjectModel(Rider.name) private riderModel: Model<IRider>,
    ) {
        console.log('NotificationService initialized');
    }

    async notifyUser(userId: string, notification: NotificationPayload) {
        const fullNotification = {
            id: crypto.randomUUID(),
            ...notification,
            createdAt: new Date().toISOString(),
        };

        const isOnline = this.notificationGateway.isUserOnline(userId);

        if (isOnline) {
            this.logger.log(`Sending in-app notification to user ${userId}`);
            this.notificationGateway.sendToUser(userId, fullNotification);
        } else {
            this.logger.log(`User ${userId} is offline, sending push notification`);
            const user = await this.riderModel.findById(userId).select('pushToken');

            if (user?.pushToken) {
                await this.pushNotificationService.sendToUser(user.pushToken, fullNotification);
            } else {
                this.logger.warn(`No push token found for user ${userId}`);
            }
        }
    }

    async notifyMultiple(userIds: string[], notification: NotificationPayload) {
        const fullNotification = {
            id: crypto.randomUUID(),
            ...notification,
            createdAt: new Date().toISOString(),
        };

        const onlineUserIds: string[] = [];
        const offlineUserIds: string[] = [];

        // Split users
        userIds.forEach(id => {
            if (this.notificationGateway.isUserOnline(id)) {
                onlineUserIds.push(id);
            } else {
                offlineUserIds.push(id);
            }
        });

        // Send to online users via Socket
        onlineUserIds.forEach(id => {
            this.notificationGateway.sendToUser(id, fullNotification);
        });

        // Send to offline users via Push
        if (offlineUserIds.length > 0) {
            const users = await this.riderModel.find({
                _id: { $in: offlineUserIds },
                pushToken: { $exists: true, $ne: null }
            }).select('pushToken');

            const pushTokens = users.map(u => u.pushToken).filter((t): t is string => !!t);
            if (pushTokens.length > 0) {
                await this.pushNotificationService.sendToMultiple(pushTokens, fullNotification);
            }
        }
    }
}
