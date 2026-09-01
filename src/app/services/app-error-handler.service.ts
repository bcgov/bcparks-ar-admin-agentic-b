import { ErrorHandler, Injectable } from '@angular/core';
import { LoggerService } from './logger.service';

@Injectable()
export class AppErrorHandler implements ErrorHandler {
  constructor(private loggerService: LoggerService) {}

  handleError(error: unknown): void {
    const message = error instanceof Error ? error.message : String(error);
    this.loggerService.error(`Unhandled application error: ${message}`, {
      securityEvent: true,
    });
  }
}
