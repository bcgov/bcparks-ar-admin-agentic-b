# Plan — TokenInterceptor 401 refresh (AUTH-006)

> Issue [#115](https://github.com/bcgov/bcparks-ar-admin-agentic-b/issues/115). Checkpoint 2.

## Summary

Change `TokenInterceptor` to refresh on HTTP **401** instead of **403**. Update `token-interceptor.spec.ts` so 401 triggers refresh/retry and 403 passes through. Update interceptor JSDoc comment.

## Test approach

- Rewrite TEST-001 interceptor tests for new status semantics
- Add explicit @R-27.1 / @R-27.2 coverage in spec
