import { Module, Logger } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from '@app/common';
import { JwtGuard } from './auth/guards/jwt.guard';
import { RolesGuard } from './auth/guards/roles.guard';
import { AdminModule } from './auth/admin/admin.module';
import { RiderModule } from './auth/rider/rider.module';
import { getJwtConfig } from './config/jwt.config';
import { StorageModule } from './storage/storage.module';
import { UserModule } from './auth/user/user.module';
import { WalletModule } from './wallet/wallet.module';
import { AddressModule } from './address/address.module';
import { ShipmentModule } from './shipment/shipment.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getJwtConfig,
    }),
    DatabaseModule,
    AdminModule,
    RiderModule,
    StorageModule,
    UserModule,
    WalletModule,
    AddressModule,
    ShipmentModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule { }
