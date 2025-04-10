import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // https://docs.nestjs.com/openapi/introduction#bootstrap
  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Movie booker')
    .setDescription('API to book movies')
    .setVersion('1.0')
    .addTag('movie')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);
  // https://docs.nestjs.com/techniques/validation#using-the-built-in-validationpipe
  app.useGlobalPipes(new ValidationPipe());
  // https://docs.nestjs.com/security/cors#getting-started
  app.enableCors({
    origin: '*',
    methods: 'GET,PUT,POST,PATCH,DELETE,HEAD',
    credentials: true,
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
