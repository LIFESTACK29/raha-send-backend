import {
  CallHandler,
  ExecutionContext,
  HttpException,
  NestInterceptor,
} from '@nestjs/common';
import { catchError, map, Observable } from 'rxjs';

export class CustomResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const statusCode = response.statusCode;

    return next.handle().pipe(
      map((data) => ({
        statusCode,
        success: true,
        message: data.message,
        data: data.data,
      })),
      catchError((err) => {
        console.log(err?.response?.data ?? err);
        const statusCode = err instanceof HttpException ? err.getStatus() : 500;
        const errorResponse = {
          success: false,
          statusCode,
          message: err.message || 'Internal server error',
        };
        throw new HttpException(errorResponse, statusCode);
      }),
    );
  }
}
