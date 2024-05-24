import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const docsPath = `docs`;

  app.enableCors({
    origin: 'http://localhost:3002', // Replace with your Nuxt.js server URL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Student API')
    .setDescription('The student API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(docsPath, app, document);
  SwaggerModule.setup('api', app, document);

  await app.listen(3002);

  Logger.log(
    `🚀 Application is running on: http://localhost:${3002}`,
    'NestApplication',
  );
  Logger.log(
    `😎 Swagger UI on: http://localhost:${3002}/${docsPath}`,
    'NestApplication',
  );
}
bootstrap();
