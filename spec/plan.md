# Plan — Bearer token host allowlist (AUTH-007)

> Issue [#119](https://github.com/bcgov/bcparks-ar-admin-agentic-b/issues/119). Checkpoint 2.

## Summary

Inject `ConfigService` into `TokenInterceptor`. In `addAuthHeader`, compare request URL origin to `API_LOCATION` origin; skip Authorization header when hosts differ. Relative URLs resolve against `window.location.origin`.

## Test approach

- Mock ConfigService in spec with `API_LOCATION`
- @R-28.1: matching host gets Bearer
- @R-28.2: external host omits Bearer
