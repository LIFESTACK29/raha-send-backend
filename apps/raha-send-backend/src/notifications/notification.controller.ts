import { Controller, Post, Body, UseGuards, Req, HttpStatus, HttpCode, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { NotificationService } from './notification.service';
import { TestNotificationDto, NotificationType } from './dto/test-notification.dto';
import { JwtGuard } from '../auth/guards/jwt.guard';

@ApiTags('Notifications')
@Controller('notifications')
@UseGuards(JwtGuard)
@ApiBearerAuth()
export class NotificationController {
    private readonly logger = new Logger(NotificationController.name);

    constructor(private readonly notificationService: NotificationService) { }

    @Post('test')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Send a test notification',
        description: 'Sends a test notification to the authenticated user via Socket.IO (if online) or Push Notification (if offline).',
    })
    @ApiResponse({
        status: 200,
        description: 'Notification sent successfully',
        schema: {
            example: {
                success: true,
                message: 'Test notification sent successfully',
                sentTo: 'userId',
                notification: {
                    title: 'Test',
                    message: 'Message',
                    type: 'info'
                }
            }
        }
    })
    async sendTestNotification(@Req() req, @Body() dto: TestNotificationDto) {
        const userId = req.user.id || req.user.sub;
        this.logger.log(`Received test notification request for user ${userId}`);

        const notificationPayload = {
            title: dto.title,
            body: dto.message,
            type: dto.type || NotificationType.INFO,
            data: { isTest: true }
        };

        try {
            await this.notificationService.notifyUser(userId, notificationPayload);

            return {
                success: true,
                message: 'Test notification sent successfully',
                sentTo: userId,
                notification: notificationPayload
            };
        } catch (error) {
            this.logger.error(`Failed to send test notification: ${error.message}`, error.stack);
            throw error;
        }
    }
}
