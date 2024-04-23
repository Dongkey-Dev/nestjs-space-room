import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  Injectable,
} from '@nestjs/common';

@Catch()
@Injectable()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    if (exception.stack) console.error(exception.stack);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    try {
      const status = exception.getStatus();
      const message = exception.getResponse();

      console.error('GlobalExceptionFilter', status, message);
      response.status(status).json(message);
    } catch (e) {
      console.error(e);
      response.status(500).json({ message: 'Internal Server Error' });
    }
  }
}
