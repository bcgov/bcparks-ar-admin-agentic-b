# Plan — TEST-003 E2E scaffold

## Approach

1. Add `@playwright/test` dev dependency and `playwright.config.ts`.
2. Add `e2e/smoke/app-shell.spec.ts` smoke test (title + app-root visible).
3. Add `docs/e2e-testing.md` documenting planned auth-boundary tests (Keycloak deferred).
4. Add `yarn e2e` script; config starts `ng serve` via webServer.
5. Pin Playwright version in package.json (avoid yarn install in impl if we can add manually to package.json).

## Out of scope

- Full Keycloak OIDC automation
- CI gate on e2e (follow-up)

## Risk

Low — smoke test depends on local/dev env.js; use existing src/env.js for serve.
