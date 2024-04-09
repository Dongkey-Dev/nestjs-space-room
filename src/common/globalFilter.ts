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
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = exception.getStatus();
    const message = exception.getResponse();
    response.status(status).json(message);
  }
}
