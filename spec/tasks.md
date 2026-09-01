# Tasks — User-initiated logout (AUTH-003)

Derive from `spec/spec.md` + `features/auth-003-logout.feature`. Issue: [#56](https://github.com/bcgov/bcparks-ar-admin-agentic-b/issues/56).

## Milestone 1 — User-initiated logout (after checkpoint 2 approval)

- [ ] **TASK-001** — Add `KeycloakService.logout()` calling `keycloakAuth.logout({ redirectUri })` for real sessions — covers @R-13.1
- [ ] **TASK-002** — Local mock auth logout: clear session storage keys, reset mock adapter authenticated/token state, redirect to `/`
- [ ] **TASK-003** — Wire logout button/link in `HeaderComponent` template (desktop + mobile) visible when authenticated; call `keycloakService.logout()`
- [ ] **TASK-004** — Unit tests: mock Keycloak `logout` spy on real path; mock-auth session cleared on logout path
- [ ] **TASK-005** — Run `yarn lint` and `yarn test-ci`; update `docs/pr-evidence.md` on the implementation PR
- [ ] **TASK-006** — Open implementation PR linking #56; merge after checkpoint 3 review

## After checkpoint 2 merge (human)

- [ ] Add label `ready-for-agent` to #56 **or** implement locally from this task list
- [ ] Approve waiting Actions on the implementation PR; review; merge (checkpoint 3)

## Completed (prior slices)

- [x] AUTHZ-001 (#1), LOG-001 (#6), LOG-003 (#10), TEST-001 (#12), LOG-002 (#15), CRYPTO-001 (#23), CONFIG-003 (#29), CONFIG-004 (#33), CONFIG-002 (#37), AUTH-001 (#41), SECRET-001 (#46), AUTH-002 (#50)

## Backlog (not this slice)

- [ ] AUTH-004 — Token refresh failure UX
- [ ] AUTHZ-002 — Dead guard conditions for export-reports
- [ ] CONFIG-005 — Security Scan Gate
