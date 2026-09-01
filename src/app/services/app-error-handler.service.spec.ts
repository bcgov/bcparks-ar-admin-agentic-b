import { TestBed } from '@angular/core/testing';
import { AppErrorHandler } from './app-error-handler.service';
import { LoggerService } from './logger.service';

describe('AppErrorHandler (LOG-008)', () => {
  it('logs unhandled errors via LoggerService', () => {
    const logger = jasmine.createSpyObj('LoggerService', ['error']);
    TestBed.configureTestingModule({
      providers: [AppErrorHandler, { provide: LoggerService, useValue: logger }],
    });
    const handler = TestBed.inject(AppErrorHandler);
    handler.handleError(new Error('boom'));
    expect(logger.error).toHaveBeenCalled();
  });
});
