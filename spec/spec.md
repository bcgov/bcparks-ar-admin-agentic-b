# Spec — BC Parks Attendance & Revenue (Admin)

> Technology-free. Describe *what* and *why*, not frameworks or cloud products.
> Living document: one **active** slice for checkpoint 1; completed slices summarised below.

---

## Active slice — AUTH-003 (user-initiated logout)

**Issue:** [#56](https://github.com/bcgov/bcparks-ar-admin-agentic-b/issues/56)  
**Finding:** RA AUTH-003  
**Feature:** `features/auth-003-logout.feature`

### Problem

Staff sign in through Keycloak (or local mock auth for development). The application exposes login but no logout: sessions end only when tokens expire. Users on shared government workstations cannot proactively end their session, leaving authenticated access available to the next person at the terminal.

### Outcome

Authenticated users can log out from the application header. `KeycloakService.logout()` delegates to `keycloakAuth.logout()` with a redirect URI for real Keycloak sessions. Local mock auth clears its session storage and resets authenticated state. Automated tests prove both paths without a live IdP.

### Users & personas

| Persona | Goal |
| --- | --- |
| Park Operator / BC Parks staff | End session before leaving a shared workstation |
| Security reviewer | Confirm proactive session termination is available |
| Local developer | Log out from mock auth without Keycloak |

### Scope

#### In scope (#56)

- Add `KeycloakService.logout()` calling `keycloakAuth.logout({ redirectUri })` for real sessions
- Local mock auth path clears session storage and resets mock authenticated state
- Wire logout control in application header (visible when authenticated)
- Unit tests with mock Keycloak adapter; mock-auth logout clears session

#### Out of scope

- Server-side session revocation beyond Keycloak adapter behaviour
- IdP selection changes in AuthGuard (may revisit after logout exists)
- Token refresh failure UX (AUTH-004)

### Journeys

1. Real session logout via Keycloak adapter — see `features/auth-003-logout.feature`
2. Local mock auth logout clears fake session — same feature

### Non-functional requirements

- Accessibility: logout control must be keyboard reachable with visible label
- Privacy: no new personal data collection
- Testability: verifiable in CI without live IdP

### Open questions (for checkpoint 1 reviewers)

- [ ] Confirm post-logout redirect URI (app root vs login page) matches Keycloak client allow-list on lower env.

### Traceability

| Requirement | Feature scenario | Criterion |
| --- | --- | --- |
| Real Keycloak logout | Authenticated user can log out via Keycloak adapter | @R-13.1 |
| Mock auth logout | Local mock auth logout clears the fake session | (supporting) |

---

## Completed slices

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
