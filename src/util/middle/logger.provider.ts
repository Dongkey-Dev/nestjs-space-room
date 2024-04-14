import {
  ConsoleLogger,
  Injectable,
  Logger,
  NestMiddleware,
} from '@nestjs/common';
import { Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware extends ConsoleLogger implements NestMiddleware {
  private env = process.env.NODE_ENV || 'development';
  constructor(private logger = new Logger('HTTP')) {
    super();
  }

  async use(request: any, response: Response, next: NextFunction) {
    if (this.env !== 'prod') {
      const { method, originalUrl } = request;

      response.on('finish', async () => {
        const { statusCode } = response;
        const contentLength = response.get('content-length');

        this.logger.log(
          `${method} ${originalUrl} ${statusCode} ${contentLength}`,
        );
      });

      next();
    }
  }
}
