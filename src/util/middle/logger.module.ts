import { Module } from '@nestjs/common';
import { LoggerMiddleware } from './logger.provider';

@Module({
  providers: [LoggerMiddleware],
  exports: [LoggerMiddleware],
})
export class LoggerMiddlewareModule {}
