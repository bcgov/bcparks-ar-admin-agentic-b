# Tasks — Admin-only route enforcement (AUTHZ-002)

Derive from `spec/spec.md` + `features/authz-002-admin-only-routes.feature`. Issue: [#58](https://github.com/bcgov/bcparks-ar-admin-agentic-b/issues/58).

## Milestone 1 — Admin-only route enforcement (after checkpoint 2 approval)

- [ ] **TASK-001** — Add `export-reports` and `review-data` to `adminOnlyRoutes` in `KeycloakService.isAllowed()` — covers @R-14.1
- [ ] **TASK-002** — Add `keycloak.service.spec.ts` tests: non-admin denied export-reports/review-data; sysadmin allowed; non-admin routes unchanged
- [ ] **TASK-003** — Update `auth.guard.spec.ts`: add `criterion: @R-14.1` provenance header; add path-only denial tests for `/export-reports` and `/review-data`
- [ ] **TASK-004** — Run `yarn lint` and `yarn test-ci`; update `docs/pr-evidence.md` on the implementation PR
- [ ] **TASK-005** — Regenerate `spec/criteria-index.json`; update backlog row for AUTHZ-002 to #58
- [ ] **TASK-006** — Open implementation PR linking #58; merge after checkpoint 3 review

## After checkpoint 2 merge (human)

- [ ] Add label `ready-for-agent` to #58 **or** implement locally from this task list
- [ ] Approve waiting Actions on the implementation PR; review; merge (checkpoint 3)

## Completed (prior slices)

- [x] AUTHZ-001 (#1), LOG-001 (#6), LOG-003 (#10), TEST-001 (#12), LOG-002 (#15), CRYPTO-001 (#23), CONFIG-003 (#29), CONFIG-004 (#33), CONFIG-002 (#37), AUTH-001 (#41), SECRET-001 (#46), AUTH-002 (#50)

## Backlog (not this slice)

- [ ] AUTH-003 — Logout (#56, spec/plan merged; implementation separate)
- [ ] AUTH-004 — Token refresh failure UX
- [ ] CONFIG-005 — Security Scan Gate
