import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";

async function bootstrap() {
  // =====================================
  // BIGINT SERIALIZER
  // =====================================
  (BigInt.prototype as any).toJSON = function () {
    return this.toString();
  };

  const app = await NestFactory.create(AppModule);

  const prefix = "api/v2";

  // =========================
  // GLOBAL PREFIX
  // =========================
  app.setGlobalPrefix(prefix);

  // =========================
  // VALIDATION PIPE GLOBAL
  // =========================
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // =========================
  // CORS CONFIG
  // =========================
  app.enableCors({
    origin: ["*"],
    credentials: true,
  });

  // =========================
  // SWAGGER CONFIG
  // =========================
  const config = new DocumentBuilder()
    .setTitle("Evaluasaurio API")
    .setDescription("Documentación API Evaluasaurio")
    .setVersion("2.0.0")
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(
    app,
    config,
  );

  SwaggerModule.setup(
    `${prefix}/docs`,
    app,
    document,
    {
      swaggerOptions: {
        persistAuthorization: true,
      },
    },
  );

  // =========================
  // START SERVER
  // =========================
  const port = process.env.PORT
    ? Number(process.env.PORT)
    : 3000;

  await app.listen(port);

  console.log(
    `🚀 API ejecutándose en: ${await app.getUrl()}/${prefix}`,
  );

  console.log(
    `📚 Swagger disponible en: ${await app.getUrl()}/${prefix}/docs`,
  );
}

bootstrap();