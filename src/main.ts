import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const docsPath = 'docs';

  // Enable CORS
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization',
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  // Serve Swagger UI static files (needed in production)
  app.useStaticAssets(join(__dirname, '..', 'node_modules', 'swagger-ui-dist'));

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Student API')
    .setDescription('The student API description')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        in: 'header',
      },
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // Setup Swagger endpoints
  SwaggerModule.setup(docsPath, app, document);
  SwaggerModule.setup('api', app, document); // optional second path

  const port = 3002;
  await app.listen(port);

  Logger.log(
    `🚀 Application is running on: http://localhost:${port}`,
    'NestApplication',
  );
  Logger.log(
    `😎 Swagger UI on: http://localhost:${port}/${docsPath}`,
    'NestApplication',
  );
}
bootstrap();
