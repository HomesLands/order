import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule } from '@nestjs/swagger';
import swaggerConfig from './config/swagger.config';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get('PORT');
  const version = configService.get('VERSION');

  app.setGlobalPrefix(`api/${version}`);
  app.enableCors();

  const documentFactory = () => SwaggerModule.createDocument(app, swaggerConfig());
  SwaggerModule.setup('api/api-docs', app, documentFactory);

  logger.log(`Server running on port ${port}`);
  await app.listen(port);
}
bootstrap();
