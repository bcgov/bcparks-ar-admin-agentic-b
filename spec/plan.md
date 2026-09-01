# Plan — Admin-only route enforcement (AUTHZ-002)

> Architecture and delivery approach for issue [#58](https://github.com/bcgov/bcparks-ar-admin-agentic-b/issues/58) / RA AUTHZ-002.  
> Checkpoint 1 (spec) is merged. This document is **checkpoint 2**.

## Summary

Extend `KeycloakService.isAllowed()` `adminOnlyRoutes` to include `export-reports` and `review-data` alongside existing `lock-records` and `manage-subareas`. Non-admin users will receive `false` from `isAllowed()` for all four routes; sysadmin users continue to pass via `isAdmin()`. Add unit tests in `keycloak.service.spec.ts` proving `isAllowed()` behaviour and extend `auth.guard.spec.ts` with @R-14.1 traceability for path-only denial (no query string).

## Architecture

```text
KeycloakService.isAllowed(service)
  adminOnlyRoutes = ['lock-records', 'manage-subareas', 'export-reports', 'review-data']
  if service not in adminOnlyRoutes → return true
  else → return isAdmin()

AuthGuard.canActivate()
  existing path checks for export-reports / review-data become live
  (guard logic unchanged; isAllowed() now enforces admin-only)
```

## Key decisions

| Decision | Choice | Rationale |
| --- | --- | --- |
| Fix location | `adminOnlyRoutes` in `isAllowed()` | Matches backlog expected section; minimal one-line array change |
| AuthGuard changes | None required | Guard blocks already exist; they were dead because `isAllowed()` always returned true |
| Test focus | `keycloak.service.spec.ts` + `auth.guard.spec.ts` | Service tests prove root cause fix; guard tests prove end-to-end redirect |
| Criterion ID | @R-14.1 on non-admin export-reports denial | Primary traceability tag per pipeline convention |

## Security & privacy

- Classification: Internal staff UI
- PIA: No new data collection
- Secrets: None
- Residual risk: Client-side route guards remain advisory; API authorization is authoritative

## Test approach

- `keycloak.service.spec.ts`:
  - Non-admin token: `isAllowed('export-reports')` and `isAllowed('review-data')` return false
  - Sysadmin token: both return true
  - Non-admin routes (e.g. enter-data) still return true
- `auth.guard.spec.ts`:
  - Add provenance header comment `criterion: @R-14.1`
  - Add path-only tests for `/export-reports` and `/review-data` without query strings (complement AUTHZ-001 query-string cases)
- CI: `yarn lint` + `yarn test-ci` on implementation PR
- Update `docs/pr-evidence.md` on implementation PR

## Rollout

- Ship with next admin UI deploy
- No data migration
- Optional human smoke: confirm non-admin IDIR user cannot reach export/review routes on lower env

## Approval (checkpoint 2) — **human required**

| Role | Name | Date |
| --- | --- | --- |
| Architect / tech lead | | |
| Security (if required) | | |

> Do not add `ready-for-agent` to #58 until this table is filled and this plan PR is merged.
