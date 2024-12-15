import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const docsPath = `docs`;

  app.enableCors({
    origin: '*', // Replace with your Nuxt.js server URL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization',
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  // const config = new DocumentBuilder()
  //   .setTitle('Student API')
  //   .setDescription('The student API description')
  //   .setVersion('1.0')
  //   .addBearerAuth(
  //     {
  //       type: 'http',
  //       scheme: 'bearer',
  //       bearerFormat: 'JWT',
  //       in: 'header',
  //     },
  //     'access-token', // The name of the Bearer token in Swagger UI
  //   )
  //   .build();
  // const document = SwaggerModule.createDocument(app, config);
  // SwaggerModule.setup(docsPath, app, document);
  // SwaggerModule.setup('api', app, document);

  await app.listen(3002);

  Logger.log(
    `🚀 Application is running on:  http://localhost:${3002}`,
    'NestApplication',
  );
  Logger.log(
    `😎 Swagger UI on: http://localhost:${3002}/${docsPath}`,
    'NestApplication',
  );
}
bootstrap();
