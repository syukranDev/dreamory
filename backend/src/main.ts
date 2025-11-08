import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  app.enableCors({
    origin: [
      'http://localhost:5173',
      'http://127.0.0.1:5173',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  });

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: false,
  }));

  app.setGlobalPrefix('api/v1', {
    exclude: ['/']
  });
  
  const port =parseInt(process.env.PORT ?? '3000', 10);

  await app.listen(port, '0.0.0.0');

  console.log(` Server running --------- http://0.0.0.0:${port}`);
  console.log(` Server running --------- http://0.0.0.0:${port}`);
  console.log(` Server running --------- http://0.0.0.0:${port}`);
}
bootstrap();
