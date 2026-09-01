# Spec — BC Parks Attendance & Revenue (Admin)

> Technology-free. Describe *what* and *why*, not frameworks or cloud products.
> Living document: one **active** slice for checkpoint 1; completed slices summarised below.

---

## Active slice

### AUTHZ-003 — Hide manage-subareas nav for non-admin users

- **Issue:** [#123](https://github.com/bcgov/bcparks-ar-admin-agentic-b/issues/123)
- **Feature:** `features/authz-003-header-manage-subareas.feature`

---

## Completed slices

### AUTH-007 — Bearer token host allowlist in interceptor

- **Issue:** [#119](https://github.com/bcgov/bcparks-ar-admin-agentic-b/issues/119) (shipped)
- **Feature:** `features/auth-007-interceptor-allowlist.feature`

### AUTH-006 — TokenInterceptor refresh on 401 not 403

- **Issue:** [#115](https://github.com/bcgov/bcparks-ar-admin-agentic-b/issues/115) (shipped)
- **Feature:** `features/auth-006-interceptor-401.feature`

### AUTH-005 — Require KEYCLOAK_CLIENT_ID (no nrpti-admin fallback)

- **Issue:** [#111](https://github.com/bcgov/bcparks-ar-admin-agentic-b/issues/111) (shipped)
- **Feature:** `features/auth-005-keycloak-client-id.feature`

### AUTH-004 — Token refresh failure redirects to login

- **Issue:** [#107](https://github.com/bcgov/bcparks-ar-admin-agentic-b/issues/107) (shipped)
- **Feature:** `features/auth-004-token-refresh-redirect.feature`

### VULN-001 — Historical pill XSS via innerHtml

- **Issue:** [#102](https://github.com/bcgov/bcparks-ar-admin-agentic-b/issues/102) (shipped)
- **Feature:** `features/vuln-001-historical-pill-xss.feature`

### TEST-003 — E2E scaffold and smoke test

- **Issue:** [#98](https://github.com/bcgov/bcparks-ar-admin-agentic-b/issues/98) (shipped)
- **Feature:** `features/test-003-e2e-scaffold.feature`

### SECRET-003 — Route53 zone ID via env/lookup

- **Issue:** [#94](https://github.com/bcgov/bcparks-ar-admin-agentic-b/issues/94) (shipped)
- **Feature:** `features/secret-003-route53-zone-id.feature`

### SECRET-002 — Non-prod AWS account IDs via vars/env

- **Issue:** [#90](https://github.com/bcgov/bcparks-ar-admin-agentic-b/issues/90) (shipped)
- **Feature:** `features/secret-002-nonprod-account-ids.feature`
- **Note:** Requires `vars.DOMAIN_CERTIFICATE_ARN` per GitHub environment (lza-dev, lza-test).

### LOG-007 — Browser-console logging limitation

- **Issue:** [#86](https://github.com/bcgov/bcparks-ar-admin-agentic-b/issues/86) (shipped)
- **Feature:** `features/log-007-browser-console-logging.feature`

### LOG-006 — Structured JSON log format

- **Issue:** [#81](https://github.com/bcgov/bcparks-ar-admin-agentic-b/issues/81) (shipped)
- **Feature:** `features/log-006-structured-log-format.feature`

### LOG-005 — Sanitized error logging

- **Issue:** [#77](https://github.com/bcgov/bcparks-ar-admin-agentic-b/issues/77) (shipped)
- **Feature:** `features/log-005-sanitize-error-logging.feature`

### LOG-004 — LoggerService safe default log level

- **Issue:** [#73](https://github.com/bcgov/bcparks-ar-admin-agentic-b/issues/73) (shipped)
- **Feature:** `features/log-004-logger-default-level.feature`

### CONFIG-006 — Deployment pipeline log levels

- **Issue:** [#69](https://github.com/bcgov/bcparks-ar-admin-agentic-b/issues/69) (shipped)
- **Feature:** `features/config-006-deploy-log-level.feature`

### CONFIG-005 — Trivy scan automatic triggers

- **Issue:** [#65](https://github.com/bcgov/bcparks-ar-admin-agentic-b/issues/65) (shipped)
- **Feature:** `features/config-005-trivy-triggers.feature`

### AUTHZ-002 — Admin-only route enforcement

- **Issue:** [#58](https://github.com/bcgov/bcparks-ar-admin-agentic-b/issues/58) (shipped — [PR #64](https://github.com/bcgov/bcparks-ar-admin-agentic-b/pull/64))
- **Feature:** `features/authz-002-admin-only-routes.feature`

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
