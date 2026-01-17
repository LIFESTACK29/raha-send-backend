import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CustomResponseInterceptor } from './interceptors/custom-response.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.setGlobalPrefix('/api/v1');
  app.useGlobalInterceptors(new CustomResponseInterceptor());

  const config = new DocumentBuilder()
    .setTitle('Raha Send Documentation')
    .setDescription('API Documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  app.use('/docs', apiReference({ content: documentFactory() }));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
