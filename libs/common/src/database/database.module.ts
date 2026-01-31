import { Module, Logger } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseService } from './database.service';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const logger = new Logger('MongooseModule');
        const mongoUrl = configService.get<string>('MONGO_DB_URL');

        if (!mongoUrl) {
          throw new Error(
            'MONGO_DB_URL is not defined in environment variables',
          );
        }

        logger.log(
          `🔗 Connecting to MongoDB: ${mongoUrl.split('@')[1] || mongoUrl}`,
        );

        return {
          uri: mongoUrl,
        };
      },
    }),
  ],
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}
