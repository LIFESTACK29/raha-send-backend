import { Injectable, Logger, OnModuleInit, Inject } from '@nestjs/common';
import { Connection } from 'mongoose';
import { getConnectionToken } from '@nestjs/mongoose';

@Injectable()
export class DatabaseService implements OnModuleInit {
  private readonly logger = new Logger('DatabaseService');

  constructor(@Inject(getConnectionToken()) private connection: Connection) {}

  onModuleInit() {
    if (this.connection.readyState === 1) {
      this.logger.log('✅ MongoDB already connected!');
    }

    this.connection.on('connected', () => {
      this.logger.log('✅ MongoDB connected successfully!');
    });

    this.connection.on('disconnected', () => {
      this.logger.warn('⚠️ MongoDB disconnected');
    });

    this.connection.on('error', (err) => {
      this.logger.error('❌ MongoDB connection error:', err);
    });
  }
}
