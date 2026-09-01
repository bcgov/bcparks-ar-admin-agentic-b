# Plan — LOG-005 sanitized error logging

> Issue [#77](https://github.com/bcgov/bcparks-ar-admin-agentic-b/issues/77).

## Approach

1. `ConfigService`: inject `Injector`; on remote config failure call `LoggerService.error()` with message string only (lazy resolve to avoid circular DI).
2. `main.ts`: replace `console.error(err)` with message-only `console.error(err?.message ?? String(err))` (LoggerService unavailable pre-bootstrap).
3. Update `config.service.spec.ts` to spy LoggerService.error instead of console.error for failure path.

## Verification

- Unit tests in config.service.spec.ts (@R-18.1)
- Static review of main.ts (@R-18.2)
