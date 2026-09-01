# Logging architecture — A&R Admin SPA

## Current behaviour (LOG-007)

The Angular admin application uses `LoggerService` (`src/app/services/logger.service.ts`) as the sole application logging mechanism.

| Aspect | Status |
| --- | --- |
| Output sink | Browser `console.log` / `console.warn` only |
| Format | Structured JSON (see LOG-006) |
| Persistence | **None** — logs disappear when the tab closes |
| Server-side shipping | **Not implemented** |
| SIEM / RUM integration | **Not implemented** (no CloudWatch RUM, Application Insights, etc.) |

Security-relevant events (auth failures, authorization denials) are logged to the browser console when the configured `logLevel` permits. Operators with DevTools open can inspect them; there is no central audit trail from the frontend alone.

## Known limitation

This is a static SPA deployed to CloudFront/S3. Without a backend log-ingest endpoint or a browser RUM SDK, **all application logging is browser-console only**. Forensic investigation depends on users reporting issues while DevTools is open, or on backend API logs (outside this UI codebase).

## Forward path (not implemented)

A future slice may add optional client-side log shipping when a runtime flag is set:

```javascript
// env.js.template (future)
window.__env.LOG_SHIPPING_ENDPOINT = ''; // empty = disabled (default)
```

When non-empty, `LoggerService` could POST batched security events (`securityEvent: true`) to that endpoint. This slice **does not** implement shipping, batching, or a backend receiver — it documents the hook only.

## Related findings

- LOG-006 — structured JSON log format
- LOG-002 / LOG-003 — security event content
- LOG-008 — global ErrorHandler (separate backlog item)
