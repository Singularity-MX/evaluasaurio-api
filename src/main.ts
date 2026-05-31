import {
  ValidationPipe,
} from '@nestjs/common';

import {
  NestFactory,
} from '@nestjs/core';

import {
  SwaggerModule,
  DocumentBuilder,
} from '@nestjs/swagger';

import { AppModule } from './app.module';

async function bootstrap() {

  const app =
    await NestFactory.create(
      AppModule,
    );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  const config =
    new DocumentBuilder()
      .setTitle(
        'Evaluasaurio API',
      )
      .setDescription(
        'Documentación API Evaluasaurio',
      )
      .setVersion(
        '1.0.0',
      )
      .addBearerAuth()
      .build();

  const document =
    SwaggerModule.createDocument(
      app,
      config,
    );

  SwaggerModule.setup(
    'docs',
    app,
    document,
  );

app.enableCors({
  origin: [
    'http://localhost:5173',
  ],
  credentials: true,
});

  await app.listen(
    process.env.PORT
      ? Number(process.env.PORT)
      : 3000,
  );

  console.log(
    `🚀 API ejecutándose en: ${await app.getUrl()}`,
  );

  console.log(
    `📚 Swagger disponible en: ${await app.getUrl()}/docs`,
  );
}

bootstrap();