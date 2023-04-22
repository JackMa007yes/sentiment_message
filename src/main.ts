import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WrapResponseInterceptor } from './common/interceptors/wrap-response.interceptor';
import { DocumentBuilder } from '@nestjs/swagger';
import { SwaggerModule } from '@nestjs/swagger/dist';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true, // 这两个选项过滤掉与dto不匹配的多余参数
      transform: true, // 将参数转换为dto定义的类的实例（body中传输的仅interface匹配），以及参数的类型转换（如将param中的string转换为number等），有一定性能损耗
      transformOptions: {
        enableImplicitConversion: true, // 在全局层面启用隐式类型转换
      },
    }),
  );
  // app.useGlobalInterceptors(new WrapResponseInterceptor());
  app.setGlobalPrefix('api');

  // OpenAPI
  const options = new DocumentBuilder()
    .setTitle('sentiment_message')
    .setDescription('a IM app with sentiment analysis')
    .setVersion('0.1')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
