# Spec — BC Parks Attendance & Revenue (Admin)

> Technology-free. Describe *what* and *why*, not frameworks or cloud products.
> Living document: one **active** slice for checkpoint 1; completed slices summarised below.

---

## Active slice — SECRET-001 (prod certificate input)

**Issue:** [#46](https://github.com/bcgov/bcparks-ar-admin-agentic-b/issues/46)  
**Finding:** RA SECRET-001  
**Feature:** `features/secret-001-prod-certificate-arn.feature`

### Problem

The production deploy workflow embeds a full ACM certificate identifier (including the production cloud account) in the repository. Anyone who can read the repo can enumerate that account.

### Outcome

The production deploy step reads the certificate identifier from a production environment input (`DOMAIN_CERTIFICATE_ARN`) instead of a literal in the workflow file. Non-production workflows are unchanged. The value itself is not copied into specs, evidence, or review comments.

**Delivery pause:** do not merge the workflow change until a human has created the `lza-prod` GitHub Environment and set `vars.DOMAIN_CERTIFICATE_ARN`.

### Users & personas

| Persona | Goal |
| --- | --- |
| Platform operator | Prod deploy still receives a valid certificate identifier |
| Security reviewer | Confirm the workflow no longer contains a literal ACM ARN |
| Release manager | Know the environment variable must exist before the change ships |

### Scope

#### In scope (#46)

- Replace the hardcoded `DomainCertificateArn` on the LZA prod deploy workflow with `${{ vars.DOMAIN_CERTIFICATE_ARN }}`
- Static proof that the prod workflow no longer contains a literal `arn:aws:acm:` on that parameter
- Document the `lza-prod` environment prerequisite

#### Out of scope

- Dev/test hardcoded ARNs (SECRET-002)
- Creating the GitHub Environment or writing the variable (human / org admin)
- Rotating the certificate
- Putting the ARN in comments, evidence, or this spec

### Journeys

1. Prod workflow uses environment input — see `features/secret-001-prod-certificate-arn.feature`

### Non-functional requirements

- No application code change
- Evidence must not reprint the ARN

### Traceability

| Finding | Issue | Feature |
| --- | --- | --- |
| RA SECRET-001 | #46 | `features/secret-001-prod-certificate-arn.feature` |

### Sign-off (checkpoint 1) — **human required**

| Role | Name | Date |
| --- | --- | --- |
| Product / PM | kmandryk (simulated CP1) | 2026-08-31 |
| Tech lead | kmandryk (simulated CP1) | 2026-08-31 |
| QA (acceptance ownership) | kmandryk (simulated CP1) | 2026-08-31 |

> Do not add `ready-for-agent` to #46 until this spec PR is merged. Do not merge the implementation PR until `lza-prod` / `DOMAIN_CERTIFICATE_ARN` exists.

---

## Completed slices

### AUTH-001 — PKCE on login

- **Issue:** [#41](https://github.com/bcgov/bcparks-ar-admin-agentic-b/issues/41) (shipped)
- **Feature:** `features/auth-001-pkce.feature`

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
