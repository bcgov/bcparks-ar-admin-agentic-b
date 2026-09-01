import { HttpClient, HttpHandler } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ConfigService } from './config.service';
import {
  LoggerService,
  LogLevel,
  LOGGING_FORWARD_PATH_CONFIG_KEY,
  LOGGING_OUTPUT_SINK,
  LOGGING_SERVER_PERSISTENCE,
} from './logger.service';

describe('LoggerService', () => {
  let loggerService: LoggerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ ConfigService, HttpClient, HttpHandler ]
    });
    spyOn(console, 'log');
  });

  it('should be created and log at configured levels', () => {
    (window as any).__env = { logLevel: LogLevel.All };
    loggerService = TestBed.inject(LoggerService);
    expect(loggerService).toBeTruthy();
    loggerService.debug('Some Debug Message');
    loggerService.info('Some Info Message');
    loggerService.warn('Some Warn Message');
    loggerService.fatal('Some Fatal Message');
    expect(console.log).toHaveBeenCalledTimes(4);
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
      expect(console.log).toHaveBeenCalled();
    });

    it('should not emit debug when logLevel is unset (defaults to Warn)', () => {
      (window as any).__env = {};
      spyOn(console, 'warn');
      loggerService = TestBed.inject(LoggerService);
      (console.log as jasmine.Spy).calls.reset();

      loggerService.debug('debug detail');
      expect(console.log).not.toHaveBeenCalled();
    });
  });

  // LOG-006: structured JSON log format (@R-19.1, @R-19.2)
  describe('structured JSON log format (LOG-006)', () => {
    beforeEach(() => {
      (window as any).__env = { logLevel: LogLevel.All };
      loggerService = TestBed.inject(LoggerService);
      (console.log as jasmine.Spy).calls.reset();
    });

    it('should emit JSON with required fields for info logs', () => {
      loggerService.info('hello world');

      const output = (console.log as jasmine.Spy).calls.mostRecent().args[0];
      const parsed = JSON.parse(output);

      expect(parsed.level).toBe('Info');
      expect(parsed.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T/);
      expect(parsed.message).toBe('hello world');
      expect(parsed.userId).toBeNull();
      expect(parsed.sessionId).toBeNull();
      expect(parsed.correlationId).toBeNull();
      expect(parsed.securityEvent).toBe(false);
    });

    it('should set securityEvent on warn and error logs', () => {
      loggerService.warn('auth denied');
      const warnOutput = JSON.parse((console.log as jasmine.Spy).calls.argsFor(0)[0]);
      expect(warnOutput.securityEvent).toBe(true);

      loggerService.error('token failure');
      const errorOutput = JSON.parse((console.log as jasmine.Spy).calls.argsFor(1)[0]);
      expect(errorOutput.securityEvent).toBe(true);
    });
  });

  // criterion: @R-20.1 @R-20.2 — LOG-007 browser-console logging limitation
  describe('logging architecture (LOG-007)', () => {
    it('documents console-only output with no server persistence', () => {
      expect(LOGGING_OUTPUT_SINK).toBe('browser-console');
      expect(LOGGING_SERVER_PERSISTENCE).toBe(false);
    });

    it('documents forward path config key without implementing shipping', () => {
      expect(LOGGING_FORWARD_PATH_CONFIG_KEY).toBe('LOG_SHIPPING_ENDPOINT');
    });
  });
});
