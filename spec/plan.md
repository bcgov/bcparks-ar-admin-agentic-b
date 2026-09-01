# Plan — Token refresh failure redirects to login (AUTH-004)

> Architecture and delivery approach for issue [#107](https://github.com/bcgov/bcparks-ar-admin-agentic-b/issues/107) / RA AUTH-004.  
> Checkpoint 1 (spec) is merged. This document is **checkpoint 2**.

## Summary

When Keycloak's `onTokenExpired` callback fires and `updateToken()` rejects (session revoked, refresh token expired), redirect the browser to `/login` instead of only logging. Use `window.location.assign('/login')` to avoid injecting `Router` into `KeycloakService`. Add a unit test that invokes the registered `onTokenExpired` handler with a failing `updateToken` mock and asserts navigation.

## Architecture

```text
Keycloak onTokenExpired
  → updateToken()
      ├─ success → log refreshed state (unchanged)
      └─ failure → log error + window.location.assign('/login')
```

## Key decisions

| Decision | Choice | Rationale |
| --- | --- | --- |
| Navigation | `window.location.assign('/login')` | Matches auth guard redirect target; no Router circular dependency |
| Scope | `onTokenExpired` catch only | Ticket evidence points at lines 74–83; interceptor refresh is AUTH-006 |
| Verification | `keycloak.service.spec.ts` | Spy `window.location.assign`; trigger handler after init |

## Test approach

- Cover `@R-25.1` in `keycloak.service.spec.ts`: init registers `onTokenExpired`; mock `updateToken` rejection; assert `/login` navigation.

## Tasks

See `spec/tasks.md`.
