import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AdminService } from './auth/admin/admin.service';

async function seed() {
  const app = await NestFactory.create(AppModule);
  const adminService = app.get(AdminService);

  try {
    const admin = await adminService.register({
      email: 'admin@raha.com',
      password: 'Admin@123',
      name: 'Super Admin',
    });

    console.log('✅ Admin created successfully:', admin);
  } catch (error) {
    console.log('⚠️ Admin creation failed:', error.message);
  } finally {
    await app.close();
  }
}

seed();
