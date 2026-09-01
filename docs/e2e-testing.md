# E2E testing — A&R Admin SPA

## Current coverage (TEST-003)

| Test | Framework | Status |
| --- | --- | --- |
| App shell smoke (`e2e/smoke/app-shell.spec.ts`) | Playwright | Implemented |
| Auth boundary / Keycloak OIDC | Playwright | **Planned** |
| Role-based route denial | Playwright | **Planned** |

Run locally:

```bash
yarn e2e
```

Playwright starts `ng serve` automatically via `playwright.config.ts`.

## Planned security integration tests (follow-up)

These require Keycloak test realm fixtures or request interception — not in scope for the initial scaffold:

1. **Unauthenticated guarded routes** — visiting `/lock-records`, `/manage-subareas`, or `/export-reports` without a session redirects to login or `/unauthorized`.
2. **Non-admin role denial** — authenticated user without `sysadmin` cannot reach admin-only routes.
3. **Query-string guard bypass regression** — admin routes with query parameters remain protected (AUTHZ-001).

## CI note

E2E is not yet wired into GitHub Actions PR checks. Add a workflow step after Playwright browsers are cached in the runner image.
