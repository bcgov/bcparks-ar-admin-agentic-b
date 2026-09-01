# Spec — BC Parks Attendance & Revenue (Admin)

> Technology-free. Describe *what* and *why*, not frameworks or cloud products.
> Living document: one **active** slice for checkpoint 1; completed slices summarised below.

---

## Active slice — AUTHZ-002 (admin-only route enforcement)

**Issue:** [#58](https://github.com/bcgov/bcparks-ar-admin-agentic-b/issues/58)  
**Finding:** RA AUTHZ-002  
**Feature:** `features/authz-002-admin-only-routes.feature`

### Problem

`KeycloakService.isAllowed()` returns true for any route name not listed in `adminOnlyRoutes`. Only `lock-records` and `manage-subareas` are listed; `export-reports` and `review-data` are missing. AuthGuard checks for those routes are therefore dead code — `isAllowed()` never returns false for them, so non-admin users pass the guard.

### Outcome

Add `export-reports` and `review-data` to the admin-only route list in `isAllowed()`. Non-admin users are denied those capabilities; sysadmin users retain access. Unit tests prove `isAllowed()` and AuthGuard enforce the restriction.

### Users & personas

| Persona | Goal |
| --- | --- |
| Park Operator (non-admin) | Cannot reach export or review-data routes |
| Sysadmin | Retains export and review-data access |
| Security reviewer | Confirm guard checks are live, not dead code |

### Scope

#### In scope (#58)

- Add `export-reports` and `review-data` to `adminOnlyRoutes` in `KeycloakService.isAllowed()`
- Unit tests in `keycloak.service.spec.ts` for `isAllowed()` on all four admin routes
- Update `auth.guard.spec.ts` to cover export-reports and review-data denial paths with @R-14.1 traceability

#### Out of scope

- Server-side authorization (API remains authoritative)
- Header/sidebar nav visibility (AUTHZ-003)
- Query-string bypass (already fixed in AUTHZ-001)

### Journeys

1. Non-admin denied export-reports and review-data — see `features/authz-002-admin-only-routes.feature`
2. Admin allowed — same feature
3. AuthGuard redirect — same feature

### Non-functional requirements

- Accessibility: no UI change expected
- Privacy: no new personal data collection
- Testability: verifiable in CI without live IdP

### Open questions (for checkpoint 1 reviewers)

- [ ] Confirm export-reports and review-data are intended to be sysadmin-only in production (consistent with lock-records and manage-subareas).

### Traceability

| Requirement | Feature scenario | Criterion |
| --- | --- | --- |
| Non-admin denied export-reports | Non-admin denied export-reports capability | @R-14.1 |
| Non-admin denied review-data | Non-admin denied review-data capability | (supporting) |
| Admin allowed | Admin allowed export-reports and review-data… | (supporting) |
| AuthGuard enforcement | AuthGuard redirects non-admin… | (supporting) |

---

## Completed slices

### AUTH-003 — User-initiated logout

- **Issue:** [#56](https://github.com/bcgov/bcparks-ar-admin-agentic-b/issues/56) (shipped — [PR #61](https://github.com/bcgov/bcparks-ar-admin-agentic-b/pull/61))
- **Feature:** `features/auth-003-logout.feature`

### AUTH-002 — Verified token claims

- **Issue:** [#50](https://github.com/bcgov/bcparks-ar-admin-agentic-b/issues/50) (shipped — [PR #53](https://github.com/bcgov/bcparks-ar-admin-agentic-b/pull/53))
- **Feature:** `features/auth-002-token-claims.feature`

### SECRET-001 — Prod certificate environment input

- **Issue:** [#46](https://github.com/bcgov/bcparks-ar-admin-agentic-b/issues/46) (shipped via cloud Copilot — [PR #49](https://github.com/bcgov/bcparks-ar-admin-agentic-b/pull/49))
- **Feature:** `features/secret-001-prod-certificate-arn.feature`
- **Note:** Pipeline test only; `lza-prod` / `DOMAIN_CERTIFICATE_ARN` not required for this pilot.

### AUTH-001 — PKCE on login

- **Issue:** [#41](https://github.com/bcgov/bcparks-ar-admin-agentic-b/issues/41) (shipped)
- **Feature:** `features/auth-001-pkce.feature`

### CONFIG-002 — Content-Security-Policy

- **Issue:** [#37](https://github.com/bcgov/bcparks-ar-admin-agentic-b/issues/37) (shipped)
- **Feature:** `features/config-002-cloudfront-csp.feature`

### CONFIG-004 — Browser security headers

- **Issue:** [#33](https://github.com/bcgov/bcparks-ar-admin-agentic-b/issues/33) (shipped)
- **Feature:** `features/config-004-cloudfront-security-headers.feature`

### CONFIG-003 — CloudFront HSTS

- **Issue:** [#29](https://github.com/bcgov/bcparks-ar-admin-agentic-b/issues/29) (shipped)
- **Feature:** `features/config-003-cloudfront-hsts.feature`


### CRYPTO-001 — CloudFront viewer TLS minimum

- **Issue:** [#23](https://github.com/bcgov/bcparks-ar-admin-agentic-b/issues/23) (shipped)
- **Feature:** `features/crypto-001-cloudfront-tls-minimum.feature`

### TEST-001 — Token interceptor coverage

- **Issue:** [#12](https://github.com/bcgov/bcparks-ar-admin-agentic-b/issues/12) (shipped)
- **Feature:** `features/test-001-token-interceptor.feature`

### LOG-002 — Keycloak lifecycle log levels

- **Issue:** [#15](https://github.com/bcgov/bcparks-ar-admin-agentic-b/issues/15) (shipped)
- **Feature:** `features/log-002-keycloak-lifecycle-log-levels.feature`

### LOG-003 — Auth denial logging

- **Issue:** [#10](https://github.com/bcgov/bcparks-ar-admin-agentic-b/issues/10) (shipped)
- **Feature:** `features/log-003-auth-denial-logging.feature`

### LOG-001 — No config console dump

- **Issue:** [#6](https://github.com/bcgov/bcparks-ar-admin-agentic-b/issues/6) (shipped)
- **Feature:** `features/log-001-no-config-console-dump.feature`

### AUTHZ-001 — Admin route guard

- **Issue:** [#1](https://github.com/bcgov/bcparks-ar-admin-agentic-b/issues/1) (shipped)
- **Feature:** `features/authz-001-admin-route-guard.feature`
