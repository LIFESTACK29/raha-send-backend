import { NestFactory } from '@nestjs/core';
import { IntegrationModule } from './integration.module';

import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(IntegrationModule);

  app.enableCors({
    origin: true,
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Raha Send Integration API')
    .setDescription('API Documentation for Integrators')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(process.env.INTEGRATION_PORT ?? 5001);
}
bootstrap();
