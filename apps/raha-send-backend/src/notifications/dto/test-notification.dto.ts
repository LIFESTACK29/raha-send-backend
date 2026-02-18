import { IsString, IsEnum, IsOptional, Length, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum NotificationType {
    RIDE = 'ride',
    PAYMENT = 'payment',
    ALERT = 'alert',
    INFO = 'info',
}

export class TestNotificationDto {
    @ApiProperty({
        description: 'The title of the notification',
        minLength: 3,
        maxLength: 100,
        example: 'Test Notification',
    })
    @IsString()
    @Length(3, 100)
    @IsNotEmpty()
    title: string;

    @ApiProperty({
        description: 'The body message of the notification',
        minLength: 5,
        maxLength: 500,
        example: 'This is a test notification message.',
    })
    @IsString()
    @Length(5, 500)
    @IsNotEmpty()
    message: string;

    @ApiProperty({
        description: 'The type of notification',
        enum: NotificationType,
        default: NotificationType.INFO,
        required: false,
    })
    @IsOptional()
    @IsEnum(NotificationType)
    type?: NotificationType = NotificationType.INFO;
}
