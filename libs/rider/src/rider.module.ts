import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RiderService } from './rider.service';
import { Rider, RiderSchema } from '@app/common';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Rider.name, schema: RiderSchema }]),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET'),
                signOptions: { expiresIn: '1d' },
            }),
            inject: [ConfigService],
        }),
    ],
    providers: [RiderService],
    exports: [RiderService, JwtModule],
})
export class RiderModule { }
