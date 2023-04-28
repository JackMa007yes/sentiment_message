import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WrapResponseInterceptor } from './common/interceptors/wrap-response.interceptor';
import { DocumentBuilder } from '@nestjs/swagger';
import { SwaggerModule } from '@nestjs/swagger/dist';
import { AuthIoAdapter } from './room/adapters/auth.adapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  // app.useGlobalInterceptors(new WrapResponseInterceptor());
  app.useWebSocketAdapter(new AuthIoAdapter(app));
  app.setGlobalPrefix('api');

  // OpenAPI
  const options = new DocumentBuilder()
    .setTitle('sentiment_message')
    .setDescription('a chat app with sentiment analysis')
    .setVersion('0.1')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
