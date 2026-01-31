import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseModule, User, UserSchema } from '@app/common';
import { AddressModule } from '@app/address';
import { ShipmentModule } from '@app/shipment';
import { IntegrationController } from './integration.controller';
import { IntegrationService } from './integration.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    AddressModule,
    ShipmentModule,
  ],
  controllers: [IntegrationController],
  providers: [IntegrationService],
})
export class IntegrationModule { }
