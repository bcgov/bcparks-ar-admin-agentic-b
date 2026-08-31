# Spec — BC Parks Attendance & Revenue (Admin)

> Technology-free. Describe *what* and *why*, not frameworks or cloud products.
> Living document: one **active** slice for checkpoint 1; completed slices summarised below.

---

## Active slice — CONFIG-004 (browser security headers)

**Issue:** [#33](https://github.com/bcgov/bcgov/bcparks-ar-admin-agentic-b/issues/33)  
**Finding:** RA CONFIG-004  
**Feature:** `features/config-004-cloudfront-security-headers.feature`

### Problem

CloudFront responses do not prevent framing or MIME sniffing, do not constrain referrer detail, and do not disable unused browser capabilities. This weakens browser-side protection for the authenticated admin UI.

### Outcome

The shared CloudFront response policy adds frame denial, nosniff, strict-origin-when-cross-origin referrer handling, and a restrictive permissions policy. HSTS and CORS from CONFIG-003 remain. CSP is a separate later slice.

### Users & personas

| Persona | Goal |
| --- | --- |
| BC Parks staff | App and API continue working normally |
| Security reviewer | Confirm the four protections are emitted by the shared policy |
| Platform operator | Extend the existing policy; keep three behavior attachments |

### Scope

#### In scope (#33)

- Frame protection, nosniff, Referrer-Policy, Permissions-Policy
- Preserve HSTS/CORS and all three attachments
- Static template proof

#### Out of scope

- CSP (CONFIG-002)
- App UI/API changes
- Live deploy/header probe in CI

### Journeys

1. Shared policy contains browser protections — see `features/config-004-cloudfront-security-headers.feature`

### Non-functional requirements

- No UI change; AWS hosting remains
- Static proof in evidence; post-deploy smoke residual

### Traceability

| Finding | Issue | Feature |
| --- | --- | --- |
| RA CONFIG-004 | #33 | `features/config-004-cloudfront-security-headers.feature` |

### Sign-off (checkpoint 1) — **human required**

| Role | Name | Date |
| --- | --- | --- |
| Product / PM | | |
| Tech lead | | |
| QA | | |

> Do not add `ready-for-agent` to #33 until this spec PR is merged.

---

## Completed slices
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
