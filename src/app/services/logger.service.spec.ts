import { HttpClient, HttpHandler } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ConfigService } from './config.service';
import { LoggerService, LogLevel } from './logger.service';

describe('LoggerService', () => {
  let loggerService: LoggerService;
  let configService: ConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ ConfigService, HttpClient, HttpHandler ]
    });
    configService = TestBed.inject(ConfigService);
    spyOn(LoggerService.prototype, 'log').and.callThrough();
  });

  it('should be created and log at configured levels', () => {
    (window as any).__env = { logLevel: LogLevel.All };
    loggerService = TestBed.inject(LoggerService);
    expect(loggerService).toBeTruthy();
    loggerService.debug('Some Debug Message');
    expect(LoggerService.prototype.log).toHaveBeenCalledTimes(1);

    loggerService.info('Some Info Message');
    expect(LoggerService.prototype.log).toHaveBeenCalledTimes(2);

    loggerService.warn('Some Warn Message');
    expect(LoggerService.prototype.log).toHaveBeenCalledTimes(3);

    loggerService.fatal('Some Fatal Message');
    expect(LoggerService.prototype.log).toHaveBeenCalledTimes(4);
  });

  // LOG-004: safe default when logLevel missing (@R-17.1, @R-17.2)
  describe('missing logLevel configuration (LOG-004)', () => {
    it('should default to Warn and emit warnings when logLevel is unset', () => {
      (window as any).__env = {};
      spyOn(console, 'warn');
      loggerService = TestBed.inject(LoggerService);

      expect(loggerService.level).toBe(LogLevel.Warn);
      expect(console.warn).toHaveBeenCalledWith(
        jasmine.stringMatching(/logLevel is not configured/)
      );

      loggerService.warn('security warning');
      expect(LoggerService.prototype.log).toHaveBeenCalled();
    });

    it('should not emit debug when logLevel is unset (defaults to Warn)', () => {
      (window as any).__env = {};
      spyOn(console, 'warn');
      loggerService = TestBed.inject(LoggerService);
      (LoggerService.prototype.log as jasmine.Spy).calls.reset();

      loggerService.debug('debug detail');
      expect(LoggerService.prototype.log).not.toHaveBeenCalled();
    });
  });
});
