# Plan — LOG-004 LoggerService safe default log level

> Checkpoint 2 for issue [#73](https://github.com/bcgov/bcparks-ar-admin-agentic-b/issues/73).

## Approach

1. Change `LoggerService.level` default from `LogLevel.Off` to `LogLevel.Warn`.
2. Add `getEffectiveLogLevel()` — when `ConfigService.logLevel` is undefined, return `LogLevel.Warn` and emit one-time `console.warn`.
3. Update `shouldLog()` to use effective level.
4. Unit tests in `logger.service.spec.ts` for @R-17.1 and @R-17.2.

## Out of scope

- Changing deploy pipeline logLevel values (CONFIG-006)
- Server-side log shipping

## Verification

- `yarn test-ci --include src/app/services/logger.service.spec.ts`
