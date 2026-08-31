# Spec — BC Parks Attendance & Revenue (Admin)

> Technology-free. Describe *what* and *why*, not frameworks or cloud products.
> Living document: one **active** slice for checkpoint 1; completed slices summarised below.

---

## Active slice — AUTH-001 (PKCE on login)

**Issue:** [#41](https://github.com/bcgov/bcgov/bcparks-ar-admin-agentic-b/issues/41)  
**Finding:** RA AUTH-001  
**Feature:** `features/auth-001-pkce.feature`

### Problem

Staff sign in through the government’s identity broker in the browser. The app starts that login flow without the modern proof-of-possession step (PKCE) that public browser apps are expected to use. Without it, a stolen one-time login code from the redirect could be turned into a session by someone else.

### Outcome

Real browser login uses PKCE (S256). Local mock auth used for stand-up without IdP roles is unchanged. Automated tests prove the real-auth path configures PKCE without needing a live identity provider in CI.

### Users & personas

| Persona | Goal |
| --- | --- |
| Park Operator / BC Parks staff | Sign in safely via IDIR / BCeID as today |
| Security reviewer | Confirm public OIDC client follows PKCE expectation |
| Local developer | Keep `?localMockAuth=1` working without Keycloak |

### Scope

#### In scope (issue #41)

- Enable PKCE S256 on real Keycloak initialisation
- Automated proof (unit/service test) that init options include PKCE S256 for the real-auth path
- Confirm local mock auth still bypasses Keycloak init

#### Out of scope

- Changing Keycloak realm/client settings in `loginproxy.gov.bc.ca` (except documenting if IdP must allow PKCE — expected for modern clients)
- Logout flow (AUTH-003), token refresh UX (AUTH-004), host allowlist on bearer injection (AUTH-007)
- AUTHZ / CloudFront / logging findings

### Journeys

1. Real auth init configures PKCE — see `features/auth-001-pkce.feature`
2. Local mock auth does not require Keycloak PKCE init — same feature

### Non-functional requirements

- Accessibility: no UI change expected
- Privacy: no new personal data collection
- Testability: verifiable in CI without live IdP

### Open questions (for checkpoint 1 reviewers)

- [ ] Does the existing Keycloak client `attendance-and-revenue` already allow/require PKCE, or is any IdP-side change needed? (Likely none for keycloak-js S256; confirm with platform if login fails after the code change.)

### Traceability

| Finding | Issue | Feature |
| --- | --- | --- |
| RA AUTH-001 | #41 | `features/auth-001-pkce.feature` |

### Sign-off (checkpoint 1) — **human required**

| Role | Name | Date |
| --- | --- | --- |
| Product / PM | | |
| Tech lead | | |
| QA (acceptance ownership) | | |

> Do not add `ready-for-agent` to #41 until this table is filled and this spec PR is merged.

---

## Completed slices
### CONFIG-002 — Content-Security-Policy

- **Issue:** [#37](https://github.com/bcgov/bcgov/bcparks-ar-admin-agentic-b/issues/37) (shipped)
- **Feature:** `features/config-002-cloudfront-csp.feature`

### CONFIG-004 — Browser security headers

- **Issue:** [#33](https://github.com/bcgov/bcgov/bcparks-ar-admin-agentic-b/issues/33) (shipped)
- **Feature:** `features/config-004-cloudfront-security-headers.feature`

### CONFIG-003 — CloudFront HSTS

- **Issue:** [#29](https://github.com/bcgov/bcgov/bcparks-ar-admin-agentic-b/issues/29) (shipped)
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
