# Spec — BC Parks Attendance & Revenue (Admin)

> Technology-free. Describe *what* and *why*, not frameworks or cloud products.
> Living document: one **active** slice for checkpoint 1; completed slices summarised below.

---

## Active slice — AUTH-002 (verified token claims)

**Issue:** [#50](https://github.com/bcgov/bcparks-ar-admin-agentic-b/issues/50)  
**Finding:** RA AUTH-002  
**Feature:** `features/auth-002-token-claims.feature`

### Problem

Staff sign in through Keycloak (or local mock auth for development). The app checks whether someone is logged in using the Keycloak library's verified session state, but role, authorization, welcome message, and identity-provider decisions read JWT payload fields through a custom Base64 decode that performs no signature verification. That split creates a maintenance hazard: library session state and decoded claims can diverge.

### Outcome

For real Keycloak sessions, role and IDP helpers read claims from the library-maintained `tokenParsed` object on the verified session. Local mock auth (`?localMockAuth=1`) continues to decode the fake JWT via `JwtUtil.decodeToken`. Automated tests prove the real-auth path uses `tokenParsed` and does not call `JwtUtil.decodeToken`.

### Users & personas

| Persona | Goal |
| --- | --- |
| Park Operator / BC Parks staff | Role-gated routes and welcome text reflect their verified session |
| Security reviewer | Confirm client-side role/IDP logic aligns with Keycloak session claims |
| Local developer | Keep `?localMockAuth=1` working without Keycloak |

### Scope

#### In scope (#50)

- Add `KeycloakService.getTokenClaims()` returning `tokenParsed` for real sessions and `JwtUtil.decodeToken` for mock auth
- Replace direct `JwtUtil.decodeToken` in `isAuthorized()`, `isAdmin()`, `getWelcomeMessage()`, and `getIdpFromToken()`
- Unit tests proving real-auth path uses `tokenParsed`, not `JwtUtil.decodeToken`
- Mock-auth path still uses decode on the fake token

#### Out of scope

- Server-side authorization (API remains authoritative)
- Logout flow (AUTH-003), token refresh UX (AUTH-004)
- Replacing or removing `JwtUtil` entirely (still needed for mock auth)
- PKCE or init changes (AUTH-001)

### Journeys

1. Real session uses verified claims — see `features/auth-002-token-claims.feature`
2. Local mock auth uses decode — same feature

### Non-functional requirements

- Accessibility: no UI change expected
- Privacy: no new personal data collection
- Testability: verifiable in CI without live IdP

### Open questions (for checkpoint 1 reviewers)

- [ ] Confirm `tokenParsed` is populated for all supported IdPs (IDIR, BCeID, BCSC) after login — expected from keycloak-js; flag if any mapper gap appears in lower-env smoke.

### Traceability

| Requirement | Feature scenario | Criterion |
| --- | --- | --- |
| Real auth uses tokenParsed | Real Keycloak session uses tokenParsed… | @R-12.1 |
| Mock auth uses decode | Local mock auth uses JwtUtil decode… | (supporting) |

---

## Completed slices

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
