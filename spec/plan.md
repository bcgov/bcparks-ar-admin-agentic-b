# Plan — LOG-007 browser-console logging limitation

## Approach

1. Add `docs/logging-architecture.md` documenting:
   - LoggerService emits structured JSON to `console.log` only
   - Logs are ephemeral (browser tab lifetime)
   - No SIEM, CloudWatch RUM, or backend persistence today
2. Document forward path: optional `window.__env.LOG_SHIPPING_ENDPOINT` (future) — not implemented
3. Add inline JSDoc on `LoggerService.log()` referencing the doc
4. Unit test: verify doc file exists and mentions console-only + forward path keyword

## Out of scope

- HTTP log shipping, batching, ApiService integration
- CloudWatch RUM / Application Insights SDK
- Backend audit endpoint

## Risk

Low — documentation-only slice with no runtime behaviour change.
