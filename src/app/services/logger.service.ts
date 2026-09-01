import { Injectable } from '@angular/core';
import { ConfigService } from 'src/app/services/config.service';

export enum LogLevel {
  All = 0,
  Debug = 1,
  Info = 2,
  Warn = 3,
  Error = 4,
  Fatal = 5,
  Off = 6
}

interface StructuredLogOptions {
  securityEvent?: boolean;
  context?: Record<string, unknown> | null;
}

@Injectable({
  providedIn: 'root',
})
export class LoggerService {
  level: LogLevel = LogLevel.Warn;
  private logLevelUnsetWarned = false;

  // For future enhancement, constructor could be updated to take a config struct
  // and move providedIn to a forRoot call.
  constructor(private configService: ConfigService) {
    this.getEffectiveLogLevel();
  }

  debug(msg: any) {
    this.log(msg, LogLevel.Debug);
  }

  info(msg: any) {
    this.log(msg, LogLevel.Info);
  }

  warn(msg: any, context?: Record<string, unknown>) {
    this.log(msg, LogLevel.Warn, { securityEvent: true, context: context ?? null });
  }

  error(msg: any, context?: Record<string, unknown>) {
    this.log(msg, LogLevel.Error, { securityEvent: true, context: context ?? null });
  }

  fatal(msg: any) {
    this.log(msg, LogLevel.Fatal, { securityEvent: true });
  }

  log(msg: any, level: LogLevel = LogLevel.Debug, options?: StructuredLogOptions) {
    if (this.shouldLog(level)) {
      console.log(this.formatStructuredEntry(msg, level, options));
    }
  }

  private formatStructuredEntry(
    msg: any,
    level: LogLevel,
    options?: StructuredLogOptions
  ): string {
    const entry = {
      level: LogLevel[level],
      timestamp: new Date().toISOString(),
      message: typeof msg === 'string' ? msg : String(msg),
      userId: null as string | null,
      sessionId: null as string | null,
      correlationId: null as string | null,
      context: options?.context ?? null,
      securityEvent: options?.securityEvent ?? false,
    };

    return JSON.stringify(entry);
  }

  private shouldLog(level: LogLevel): boolean {
    const configLevel = this.getEffectiveLogLevel();
    if ((level >= configLevel && level !== LogLevel.Off) || configLevel === LogLevel.All) {
      return true;
    }

    return false;
  }

  private getEffectiveLogLevel(): LogLevel {
    const configLevel = this.configService.logLevel;
    if (configLevel === undefined || configLevel === null) {
      this.warnIfLogLevelUnset();
      return LogLevel.Warn;
    }
    return configLevel;
  }

  private warnIfLogLevelUnset(): void {
    if (this.logLevelUnsetWarned) {
      return;
    }
    this.logLevelUnsetWarned = true;
    console.warn(
      'LoggerService: window.__env.logLevel is not configured; defaulting to Warn. ' +
        'Set logLevel explicitly in env.js for debug logging.'
    );
  }
}
