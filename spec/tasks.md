# Tasks — Verified token claims (AUTH-002)

Derive from `spec/spec.md` + `features/auth-002-token-claims.feature`. Issue: [#50](https://github.com/bcgov/bcparks-ar-admin-agentic-b/issues/50).

## Milestone 1 — Verified token claims (after checkpoint 2 approval)

- [ ] **TASK-001** — Add `KeycloakService.getTokenClaims()` returning `tokenParsed` for real sessions and `JwtUtil.decodeToken(getToken())` for local mock auth
- [ ] **TASK-002** — Refactor `isAuthorized()`, `isAdmin()`, `getWelcomeMessage()`, and `getIdpFromToken()` to use `getTokenClaims()` instead of direct `JwtUtil.decodeToken` — covers @R-12.1
- [ ] **TASK-003** — Add/extend unit tests: real-auth path uses `tokenParsed` and does not call `JwtUtil.decodeToken`; mock-auth path still decodes mock token — covers both feature scenarios
- [ ] **TASK-004** — Run `yarn lint` and `yarn test-ci`; update `docs/pr-evidence.md` on the implementation PR
- [ ] **TASK-005** — Open implementation PR linking #50; merge after checkpoint 3 review

## After checkpoint 2 merge (human)

- [ ] Add label `ready-for-agent` to #50 **or** implement locally from this task list
- [ ] Approve waiting Actions on the implementation PR; review; merge (checkpoint 3)

## Completed (prior slices)

- [x] AUTHZ-001 (#1), LOG-001 (#6), LOG-003 (#10), TEST-001 (#12), LOG-002 (#15), CRYPTO-001 (#23), CONFIG-003 (#29), CONFIG-004 (#33), CONFIG-002 (#37), AUTH-001 (#41), SECRET-001 (#46)

## Backlog (not this slice)

- [ ] AUTH-003 — Logout
- [ ] AUTH-004 — Token refresh failure UX
- [ ] AUTHZ-002 — Dead guard conditions for export-reports
