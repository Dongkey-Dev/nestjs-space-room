import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggerMiddleware } from './util/middle/logger.provider';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = await app.resolve(LoggerMiddleware);
  app.useLogger(logger);
  await app.listen(3000);
}
bootstrap();
