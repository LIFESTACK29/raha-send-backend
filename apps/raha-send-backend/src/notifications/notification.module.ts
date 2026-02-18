import { Module, Global } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { Rider, RiderSchema } from '@app/common';
import { NotificationGateway } from './notification.gateway';
import { PushNotificationService } from './push-notification.service';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';

@Global()
@Module({
    imports: [
        MongooseModule.forFeature([{ name: Rider.name, schema: RiderSchema }]),
    ],
    controllers: [NotificationController],
    providers: [
        NotificationGateway,
        PushNotificationService,
        NotificationService,
    ],
    exports: [NotificationService],
})
export class NotificationModule {
    constructor() {
        console.log('NotificationModule initialized');
    }
}
