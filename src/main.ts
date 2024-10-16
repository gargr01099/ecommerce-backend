import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({whitelist:true}));
  app.enableVersioning({
    type: VersioningType.URI,
  });
  app.setGlobalPrefix('api/');
  app.enableCors();
  await app.listen(3001);
}
bootstrap();
