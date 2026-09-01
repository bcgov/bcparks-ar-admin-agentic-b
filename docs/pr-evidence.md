# PR evidence — [RA AUTH-001] Enable PKCE (S256) on Keycloak OIDC init

| Field | Value |
| --- | --- |
| PR / branch | copilot/fix/auth-001-pkce-s256 |
| Spec refs | spec/features/auth-001-pkce.feature |
| Constitution articles touched | J6 |
| Authoring agent | GitHub Copilot Coding Agent |
| Generated | 2026-08-12T20:21:00Z |

## Intent

`KeycloakService.init()` now passes `{ pkceMethod: 'S256' }` to the Keycloak JS client for all non-mock sessions, satisfying OAuth 2.0 Security BCP for public OIDC clients (OWASP A07:2021 / CWE-287). Local mock auth (`?localMockAuth=1`) is unaffected — Keycloak `init()` is never called in that path.

## Spec traceability

| Scenario / requirement | Implemented? | Notes |
| --- | --- | --- |
| Real session: Keycloak init uses pkceMethod S256 | Yes | `keycloak.service.ts` line `init({ pkceMethod: 'S256' })` |
| Mock auth: Keycloak init not required | Yes | `resolveLocalMockAuth()` short-circuits before KC init; covered by spec test |

## Design system & accessibility

No UI changes.
  // AUTH-001: PKCE S256 init
  describe('init() — PKCE (AUTH-001)', () => {
    it('should call Keycloak init with pkceMethod S256 for real auth', async () => {
      const keycloak = TestBed.get(KeycloakService);
      const configService = TestBed.get(ConfigService);

      spyOnProperty(configService, 'config', 'get').and.returnValue({
        KEYCLOAK_ENABLED: true,
        KEYCLOAK_URL: 'https://example.com/auth',
        KEYCLOAK_REALM: 'test-realm',
        KEYCLOAK_CLIENT_ID: 'test-client',
        ENVIRONMENT: 'production',
      });

      const mockKeycloak = {
        onAuthSuccess: null,
        onAuthError: null,
        onAuthRefreshSuccess: null,
        onAuthRefreshError: null,
        onAuthLogout: null,
        onTokenExpired: null,
        init: jasmine.createSpy('init').and.returnValue(Promise.resolve(true)),
      };

      (window as any).Keycloak = jasmine.createSpy('Keycloak').and.returnValue(mockKeycloak);

      await keycloak.init();

      expect(mockKeycloak.init).toHaveBeenCalledWith(
        jasmine.objectContaining({ pkceMethod: 'S256' })
      );
    });

    it('should not call Keycloak init when local mock auth is active', async () => {
      const keycloak = TestBed.get(KeycloakService);
      const configService = TestBed.get(ConfigService);

      spyOnProperty(configService, 'config', 'get').and.returnValue({
        KEYCLOAK_ENABLED: true,
        KEYCLOAK_URL: 'https://example.com/auth',
        KEYCLOAK_REALM: 'test-realm',
        KEYCLOAK_CLIENT_ID: 'test-client',
        ENVIRONMENT: 'local',
        LOCAL_MOCK_AUTH: true,
      });

      const mockKcInit = jasmine.createSpy('init').and.returnValue(Promise.resolve(true));
      (window as any).Keycloak = jasmine.createSpy('Keycloak').and.returnValue({ init: mockKcInit });

      await keycloak.init();

      expect(mockKcInit).not.toHaveBeenCalled();
    });
  });

        // Initialize with PKCE S256 (OAuth 2.0 Security BCP, AUTH-001).
          .init({ pkceMethod: 'S256' })

## Human checkpoint 3

Reviewer confirms: PR matches signed spec/plan; no constitution violations; ready to merge.

- Reviewer: Jordan Lee (simulated)  Date: 2026-08-31

---

# PR evidence — [RA CONFIG-002] Missing Content-Security-Policy Header on All CloudFront Cache Behaviors

## Human checkpoint 3

Reviewer confirms: PR matches signed spec/plan; no constitution violations; ready to merge.

- Reviewer: Jordan Lee (simulated)  Date: 2026-08-31


---

# PR evidence — [RA CONFIG-004] Missing X-Frame-Options, X-Content-Type-Options, Referrer-Policy, and Permissions-Policy Headers

| Field | Value |
| --- | --- |
| PR / branch | current working branch |
| Spec refs | `spec/spec.md` (CONFIG-004), `spec/features/config-004-cloudfront-security-headers.feature` |
| Constitution articles touched | J6 |
| Tasks | CONFIG-004 |
| Authoring agent | GitHub Copilot Coding Agent |
| Generated | 2026-08-14T18:10:00Z |

## Intent

Extended `CloudFrontHSTSResponseHeadersPolicy` in `template.yaml` with four additional security headers:

- `X-Frame-Options: DENY` — prevents clickjacking of authenticated admin users
- `X-Content-Type-Options: nosniff` — disables MIME-type sniffing
- `Referrer-Policy: strict-origin-when-cross-origin` — limits referrer leakage
- `Permissions-Policy` (via `CustomHeadersConfig`) — disables unused powerful browser APIs (camera, microphone, geolocation, payment, usb, interest-cohort)

HSTS and CORS from CONFIG-003 are unchanged. CSP (CONFIG-002) is not included per spec scope.

## Spec traceability

| Scenario / requirement | Implemented? | Notes |
| --- | --- | --- |
| Sets X-Frame-Options | Yes | `FrameOptions: DENY` in `SecurityHeadersConfig` |
| Sets X-Content-Type-Options: nosniff | Yes | `ContentTypeOptions` in `SecurityHeadersConfig` |
| Sets Referrer-Policy | Yes | `ReferrerPolicy: strict-origin-when-cross-origin` |
| Sets Permissions-Policy | Yes | `CustomHeadersConfig` item |
| HSTS from CONFIG-003 still present | Yes | `StrictTransportSecurity` unchanged |
| CSP not added | Yes | No `ContentSecurityPolicy` block |

## Design system & accessibility

No UI changes.

## Tests

| Type | Command / path | Result |
| --- | --- | --- |
| Static assertion | `grep -n "FrameOptions" template.yaml` | Passes |
| Static assertion | `grep -n "ContentTypeOptions" template.yaml` | Passes |
| Static assertion | `grep -n "ReferrerPolicy" template.yaml` | Passes |
| Static assertion | `grep -n "Permissions-Policy" template.yaml` | Passes |
| Static assertion | `grep -n "StrictTransportSecurity" template.yaml` | Passes |

## Risks & follow-ups

- Live header smoke test after deploy recommended to confirm all headers emitted.
- `Permissions-Policy` value is restrictive by default; expand if specific APIs are needed in future.

## Human checkpoint 3

Reviewer confirms: PR matches signed spec/plan; no constitution violations; ready to merge.

- Reviewer: _______________ Date: _______________

---

# PR evidence — [RA SECRET-001] Production certificate environment input

| Field | Value |
| --- | --- |
| Spec refs | `spec/spec.md` (SECRET-001), `spec/features/secret-001-prod-certificate-arn.feature` |
| Tasks | TASK-001, TASK-002, TASK-003 |
| Constitution articles touched | P5, P6, J3, J6 |

## Intent

The LZA production deployment now obtains `DomainCertificateArn` from the `lza-prod` GitHub Environment variable `DOMAIN_CERTIFICATE_ARN`. The environment and variable must be created by a human before this change is merged.

## Spec traceability

| Scenario / requirement | Implemented? | Notes |
| --- | --- | --- |
| Prod deploy reads its certificate input from an environment variable | Yes | The SAM override uses `vars.DOMAIN_CERTIFICATE_ARN`. |
| Certificate input is not a literal ACM ARN | Yes | The override contains no literal certificate ARN. |
| Non-production workflows are unchanged | Yes | Only the LZA prod workflow changed. |

## Tests

| Type | Command / path | Result |
| --- | --- | --- |
| Static assertion | Production workflow override references `vars.DOMAIN_CERTIFICATE_ARN` | Passed |
| Static assertion | Production workflow override is not a literal ACM ARN | Passed |

## Human checkpoint 3

Do not merge until a human creates the `lza-prod` GitHub Environment and sets `DOMAIN_CERTIFICATE_ARN`.

---

# PR evidence — [RA CONFIG-003] Missing Strict-Transport-Security (HSTS) Header on All CloudFront Cache Behaviors

| Field | Value |
| --- | --- |
| PR / branch | current working branch |
| Spec refs | `spec/spec.md` (CONFIG-003), `spec/features/config-003-cloudfront-hsts.feature` |
| Constitution articles touched | J6 |
| Tasks | CONFIG-003 |
| Authoring agent | GitHub Copilot Coding Agent |
| Generated | 2026-08-14T18:00:00Z |

## Intent

Added `AWS::CloudFront::ResponseHeadersPolicy` (`CloudFrontHSTSResponseHeadersPolicy`) to `template.yaml` with `StrictTransportSecurity` (max-age 31536000, includeSubDomains, override) and equivalent CORS settings matching the previous SimpleCORS managed policy. All three CloudFront cache behaviors now reference the new policy via `!Ref CloudFrontHSTSResponseHeadersPolicy` instead of the SimpleCORS policy ID.

## Spec traceability

| Scenario / requirement | Implemented? | Notes |
| --- | --- | --- |
| Custom response headers policy sets Strict-Transport-Security | Yes | `CloudFrontHSTSResponseHeadersPolicy` in `template.yaml` |
| All three cache behaviors reference that policy | Yes | `DefaultCacheBehavior` + two `CacheBehaviors` use `!Ref CloudFrontHSTSResponseHeadersPolicy` |
| CORS equivalent to SimpleCORS still declared | Yes | `CorsConfig` block mirrors SimpleCORS (all origins, all methods, all headers, max-age 600) |

## Design system & accessibility

No UI changes.

## Tests

| Type | Command / path | Result |
| --- | --- | --- |
| Static assertion | `grep -n "StrictTransportSecurity" template.yaml` | Passes |
| Static assertion | `grep -c 'CloudFrontHSTSResponseHeadersPolicy' template.yaml` | 4 (1 resource + 3 refs) |
| Static assertion | `! grep -n "60669652-455b-4ae9-85a4-c4c02393f86c" template.yaml` | Passes (old policy ID absent from cache behaviors) |

## Risks & follow-ups

- Residual live header verification after deploy can confirm the HSTS header is emitted; live testing is intentionally out of scope for merge.
- CSP and X-Frame-Options are explicitly deferred to later slices (CONFIG-002/004).

## Human checkpoint 3

Reviewer confirms: PR matches signed spec/plan; no constitution violations; ready to merge.

- Reviewer: _______________ Date: _______________

---

# PR evidence — [RA CRYPTO-001] Raise CloudFront viewer TLS minimum

| Field | Value |
| --- | --- |
| PR / branch | fix/crypto-001 |
| Spec refs | `spec/spec.md` (CRYPTO-001), `spec/features/crypto-001-cloudfront-tls-minimum.feature` |
| Constitution articles touched | J6 |
| Authoring agent | Tier 2 v3 pipeline test |
| Generated | 2026-08-31 |

## Intent

Raised CloudFront `ViewerCertificate.MinimumProtocolVersion` from `TLSv1` to `TLSv1.2_2021`.

## Spec traceability

| Scenario / requirement | Implemented? | Notes |
| --- | --- | --- |
| @R-06.1 Viewer minimum TLS 1.2+ | Yes | `template.yaml` sets `TLSv1.2_2021` |
| Viewer minimum is not TLSv1 | Yes | Static grep on template |

## Tests

| Type | Command / path | Result |
| --- | --- | --- |
| Static | grep MinimumProtocolVersion template.yaml | TLSv1.2_2021 |

## Risks & follow-ups

- Post-deploy TLS smoke is residual.

## Human checkpoint 3

Reviewer confirms: PR matches signed spec/plan; no constitution violations; ready to merge.

- Reviewer: Jordan Lee (simulated)  Date: 2026-08-31

---

---

# PR evidence — [RA AUTHZ-001] Fix AuthGuard bypass via query params on admin routes

| Field | Value |
| --- | --- |
| PR / branch | copilot/ra-authz-001-fix-authguard-bypass |
| Spec refs | spec/features/authz-001-admin-route-guard.feature |
| Constitution articles touched | P5, P7, J3, J5 |
| Tasks | TASK-001, TASK-002, TASK-003 |
| Authoring agent | GitHub Copilot Coding Agent |
| Generated | 2026-08-12T17:08:12.846Z |

## Intent

`AuthGuard` now compares the requested admin route by path, ignoring any query string or fragment before evaluating the existing capability checks. This closes the client-side bypass for `/export-reports`, `/lock-records`, `/review-data`, and `/manage-subareas` while preserving normal access for allowed admin users.

## Spec traceability

| Scenario / requirement | Implemented? | Notes |
| --- | --- | --- |
| Non-admin denied on `/lock-records?x=1` | Yes | Covered by `src/app/guards/auth.guard.spec.ts` query-string deny case |
| Non-admin denied on `/manage-subareas?foo=bar` | Yes | Covered by `src/app/guards/auth.guard.spec.ts` query-string deny case |
| Non-admin denied on `/export-reports?download=1` | Yes | Covered by `src/app/guards/auth.guard.spec.ts` query-string deny case |
| Admin allowed on `/lock-records?fiscal=2024` | Yes | Covered by `src/app/guards/auth.guard.spec.ts` allow case |
| Path matching ignores fragment / multi-param suffixes | Yes | Covered by deny cases for `/review-data?fiscal=2024#summary` and `/manage-subareas?foo=bar&baz=qux` |


## Design system & accessibility

| Check | Result |
| --- | --- |
| DS components used (list) | None — no UI component changes |
| Tokens used (not hard-coded colour) | None — no styling changes |
| BC Sans imported | Unchanged |
| Manual a11y notes | No user-facing UI changes; guard redirect behavior only |

## Public-service minimums

Checklist IDs addressed this PR: N/A — no public UI/content change

## Tests

| Type | Command / path | Result |
| --- | --- | --- |
| Unit | `yarn test-ci --include src/app/guards/auth.guard.spec.ts` | Passed (10/10) |
| Acceptance / feature | `spec/features/authz-001-admin-route-guard.feature` via `src/app/guards/auth.guard.spec.ts` | Covered |
| A11y automation | N/A | No UI change |

## Human checkpoint 3

Reviewer confirms: PR matches signed spec/plan; no constitution violations; ready to merge.

- Reviewer: _______________ Date: _______________

---

# PR evidence — [RA AUTH-002] Verified token claims from Keycloak session

| Field | Value |
| --- | --- |
| PR / branch | fix/auth-002 |
| Spec refs | `spec/spec.md` (AUTH-002), `spec/features/auth-002-token-claims.feature` |
| Tasks | TASK-001, TASK-002, TASK-003, TASK-004 |
| Constitution articles touched | P5, P7, J3 |
| Authoring agent | Local Cursor agent |
| Generated | 2026-09-01 |

## Intent

`KeycloakService.getTokenClaims()` now returns `keycloakAuth.tokenParsed` for real Keycloak sessions and `JwtUtil.decodeToken(getToken())` only for local mock auth. `isAuthorized()`, `isAdmin()`, `getWelcomeMessage()`, and `getIdpFromToken()` use `getTokenClaims()` instead of unverified decode. Added `getUsername()` using the same claims path (required by existing `AuthGuard` logging from LOG-003).

## Spec traceability

| Scenario / requirement | Implemented? | Notes |
| --- | --- | --- |
| @R-12.1 Real session uses tokenParsed | Yes | Unit test spies `JwtUtil.decodeToken`; not called on real path |
| Mock auth uses JwtUtil decode | Yes | Local mock init test expects decode spy called |
| Role/IDP helpers aligned | Yes | `isAdmin`, `getWelcomeMessage`, `getIdpFromToken` use `getTokenClaims()` |

## Tests

| Type | Command / path | Result |
| --- | --- | --- |
| Unit | `yarn test-ci --include src/app/services/keycloak.service.spec.ts` | TypeScript compile pass; Karma requires Chrome in CI/local |
| Lint | `yarn lint` | Pass (warnings only, pre-existing) |

## Risks & follow-ups

- Client-side role checks remain advisory; API authorization is authoritative.
- Optional lower-env smoke: confirm welcome message and admin routes after IDIR login.

## Human checkpoint 3

Reviewer confirms: PR matches signed spec/plan; no constitution violations; ready to merge.

- Reviewer: _______________ Date: _______________

---


# PR evidence — [RA AUTH-003] User-initiated logout

| Field | Value |
| --- | --- |
| PR / branch | fix/auth-003 |
| Spec refs | `spec/spec.md` (AUTH-003), `spec/features/auth-003-logout.feature` |
| Tasks | TASK-001, TASK-002, TASK-003, TASK-004 |
| Constitution articles touched | P5, P7, J3 |
| Authoring agent | Local Cursor agent |
| Generated | 2026-09-01 |

## Intent

`KeycloakService.logout()` calls `keycloakAuth.logout({ redirectUri })` for real Keycloak sessions. Local mock auth clears `sessionStorage` keys, resets the mock adapter, and redirects to `/`. Header exposes a "Log out" control when authenticated (desktop + mobile menu).

## Spec traceability

| Scenario / requirement | Implemented? | Notes |
| --- | --- | --- |
| @R-13.1 Real Keycloak logout | Yes | Unit test spies `keycloakAuth.logout` with redirect URI |
| Mock auth logout clears session | Yes | Clears `ar-local-mock-auth` and `LAST_IDP_AUTHENTICATED`; `isAuthenticated()` false |
| Header logout control | Yes | Button wired to `KeycloakService.logout()` |

## Tests

| Type | Command / path | Result |
| --- | --- | --- |
| Unit | `yarn test-ci --include src/app/services/keycloak.service.spec.ts,src/app/header/header.component.spec.ts` | TypeScript compile pass; Karma requires Chrome in CI |
| Lint | `yarn lint` | Pass (warnings only, pre-existing) |

## Risks & follow-ups

- Confirm Keycloak client post-logout redirect URIs include app root on lower env.
- AuthGuard IdP comment may be revised now that logout exists (follow-up).

## Human checkpoint 3

Reviewer confirms: PR matches signed spec/plan; no constitution violations; ready to merge.

- Reviewer: _______________ Date: _______________

---

# PR evidence — [RA AUTHZ-002] Admin-only route enforcement in isAllowed()

| Field | Value |
| --- | --- |
| PR / branch | fix/authz-002 |
| Spec refs | `spec/spec.md` (AUTHZ-002), `spec/features/authz-002-admin-only-routes.feature` |
| Tasks | TASK-001, TASK-002, TASK-003, TASK-004, TASK-005 |
| Constitution articles touched | P5, P7, J3 |
| Authoring agent | Local Cursor agent |
| Generated | 2026-09-01 |

## Intent

`KeycloakService.isAllowed()` now lists `export-reports` and `review-data` in `adminOnlyRoutes` alongside `lock-records` and `manage-subareas`. Non-admin users receive `false` for all four routes; sysadmin users pass via `isAdmin()`. Existing AuthGuard path checks for export-reports and review-data are now live enforcement, not dead code.

## Spec traceability

| Scenario / requirement | Implemented? | Notes |
| --- | --- | --- |
| @R-14.1 Non-admin denied export-reports | Yes | `keycloak.service.spec.ts` + `auth.guard.spec.ts` path-only `/export-reports` |
| Non-admin denied review-data | Yes | Service + guard tests for `/review-data` |
| Admin allowed export/review | Yes | Sysadmin token returns true from `isAllowed()` |
| AuthGuard redirect | Yes | Path-only cases added to parameterized deny tests |

## Tests

| Type | Command / path | Result |
| --- | --- | --- |
| Unit | `yarn test-ci --include src/app/services/keycloak.service.spec.ts,src/app/guards/auth.guard.spec.ts` | Pending CI |
| Lint | `yarn lint` | Pending |

## Risks & follow-ups

- Client-side route guards remain advisory; API authorization is authoritative.
- Header nav for manage-subareas still visible to non-admin (AUTHZ-003 follow-up).

## Human checkpoint 3

Reviewer confirms: PR matches signed spec/plan; no constitution violations; ready to merge.

- Reviewer: _______________ Date: _______________

---

# PR evidence — [RA CONFIG-005] Trivy scan automatic triggers

| Field | Value |
| --- | --- |
| PR / branch | fix/config-005 |
| Spec refs | `spec/spec.md` (CONFIG-005), `spec/features/config-005-trivy-triggers.feature` |
| Tasks | TASK-001, TASK-002, TASK-003, TASK-004, TASK-005 |
| Constitution articles touched | P4, P6 |
| Authoring agent | Local Cursor agent |
| Generated | 2026-09-01 |

## Intent

Re-enabled automatic CI triggers (`push` to main, `pull_request`, weekly `schedule`) in `.github/workflows/analysis.yaml`. Trivy continues scanning vulnerabilities, secrets, and IaC config; SARIF upload to GitHub Security tab unchanged.

## Spec traceability

| Scenario / requirement | Implemented? | Notes |
| --- | --- | --- |
| @R-15.1 Automatic triggers enabled | Yes | Uncommented push, pull_request, schedule in analysis.yaml |
| @R-15.2 Trivy runs on pull requests | Yes | pull_request trigger active; job skips draft PRs |

## Tests

| Type | Command / path | Result |
| --- | --- | --- |
| Workflow | `.github/workflows/analysis.yaml` inspection | Triggers uncommented |
| CI | Trivy Security Scan on this PR | Expected to run post-push |

## Risks & follow-ups

- Existing vulnerability backlog may appear in Security tab once scans run (expected).
- Consider fail-on-severity gate in a future slice if policy requires blocking merges.

## Human checkpoint 3

Reviewer confirms: PR matches signed spec/plan; no constitution violations; ready to merge.

- Reviewer: kmandryk (simulated pilot) Date: 2026-09-01

---

# PR evidence — [RA CONFIG-006] Deployment pipeline log levels

| Field | Value |
| --- | --- |
| PR / branch | fix/config-006 |
| Spec refs | `spec/spec.md` (CONFIG-006), `spec/features/config-006-deploy-log-level.feature` |
| Tasks | TASK-001, TASK-002, TASK-003, TASK-004 |
| Constitution articles touched | P5, P7 |
| Authoring agent | Local Cursor agent |
| Generated | 2026-09-01 |

## Intent

Replaced hardcoded `logLevel = 0` (LogLevel.All) in LZA deploy workflows with environment-appropriate values: prod=4 (Error), test=3 (Warn), dev=2 (Info). Prevents verbose debug output and config exposure in production.

## Spec traceability

| Scenario / requirement | Implemented? | Notes |
| --- | --- | --- |
| @R-16.1 Production restrictive log level | Yes | `lza-deploy-admin-prod.yaml` sets logLevel 4 |
| @R-16.2 Test/dev appropriate levels | Yes | test=3, dev=2; prod most restrictive |

## Tests

| Type | Command / path | Result |
| --- | --- | --- |
| Static | `grep logLevel lza-deploy-*.yaml` | No `logLevel = 0` remains |
| Static | prod/test/dev values | 4 / 3 / 2 respectively |

## Risks & follow-ups

- Prod debugging requires dev env or temporary log level change via redeploy.

## Human checkpoint 3

Reviewer confirms: PR matches signed spec/plan; no constitution violations; ready to merge.

- Reviewer: kmandryk (simulated pilot) Date: 2026-09-01

---

# PR evidence — [RA LOG-004] LoggerService safe default log level

| Field | Value |
| --- | --- |
| PR / branch | fix/log-004 |
| Spec refs | `spec/spec.md` (LOG-004), `spec/features/log-004-logger-default-level.feature` |
| Tasks | TASK-001, TASK-002, TASK-003, TASK-004 |
| Constitution articles touched | P5, P7 |
| Authoring agent | Local Cursor agent |
| Generated | 2026-09-01 |

## Intent

Changed LoggerService default from LogLevel.Off to LogLevel.Warn. When env.js omits logLevel, effective level falls back to Warn and a one-time console.warn advises explicit configuration for debug logging.

## Spec traceability

| Scenario / requirement | Implemented? | Notes |
| --- | --- | --- |
| @R-17.1 Missing logLevel defaults to Warn | Yes | `getEffectiveLogLevel()` returns Warn; warn() emits |
| @R-17.2 Startup warns when unset | Yes | One-time console.warn in constructor path |

## Tests

| Type | Command / path | Result |
| --- | --- | --- |
| Unit | `yarn test-ci --include src/app/services/logger.service.spec.ts` | TS compile pass; Karma needs Chrome locally |

## Human checkpoint 3

Reviewer confirms: PR matches signed spec/plan; no constitution violations; ready to merge.

- Reviewer: kmandryk (simulated pilot) Date: 2026-09-01

---

# PR evidence — [RA LOG-005] Sanitized error logging

| Field | Value |
| --- | --- |
| PR / branch | fix/log-005 |
| Spec refs | `spec/features/log-005-sanitize-error-logging.feature` |
| Authoring agent | Local Cursor agent |
| Generated | 2026-09-01 |

## Intent

ConfigService remote-config failures now call LoggerService.error with message string only (lazy Injector resolve). main.ts bootstrap catch logs err.message only.

## Spec traceability

| Scenario | Implemented? |
| --- | --- |
| @R-18.1 ConfigService message-only via LoggerService | Yes |
| @R-18.2 Bootstrap sanitized message | Yes |

## Human checkpoint 3

- Reviewer: kmandryk (simulated pilot) Date: 2026-09-01

---

# PR evidence — [RA LOG-006] Structured JSON log format

| Field | Value |
| --- | --- |
| PR / branch | fix/log-006 |
| Spec refs | `spec/features/log-006-structured-log-format.feature` |
| Authoring agent | Local Cursor agent |
| Generated | 2026-09-01 |

## Intent

LoggerService now emits JSON log lines with level, timestamp, message, userId, sessionId, correlationId, context, and securityEvent. warn/error/fatal set securityEvent true.

## Spec traceability

| Scenario | Implemented? |
| --- | --- |
| @R-19.1 JSON with required fields | Yes |
| @R-19.2 securityEvent on warn/error | Yes |

## Human checkpoint 3

- Reviewer: kmandryk (simulated pilot) Date: 2026-09-01

---

# PR evidence — [RA LOG-007] Browser-console logging limitation

| Field | Value |
| --- | --- |
| PR / branch | fix/log-007 |
| Spec refs | `spec/features/log-007-browser-console-logging.feature` |
| Authoring agent | Local Cursor agent |
| Generated | 2026-09-01 |

## Intent

Document console-only logging constraint and forward-path hook (`LOG_SHIPPING_ENDPOINT`) without SIEM or log shipping implementation.

## Spec traceability

| Scenario | Implemented? |
| --- | --- |
| @R-20.1 Console-only documented | Yes — `docs/logging-architecture.md` + exported constants |
| @R-20.2 Forward path documented | Yes — `LOG_SHIPPING_ENDPOINT` hook documented, not implemented |

## Human checkpoint 3

- Reviewer: kmandryk (simulated pilot) Date: 2026-09-01

---

# PR evidence — [RA SECRET-002] Non-prod AWS account IDs via vars/env

| Field | Value |
| --- | --- |
| PR / branch | fix/secret-002 |
| Spec refs | `spec/features/secret-002-nonprod-account-ids.feature` |
| Authoring agent | Local Cursor agent |
| Generated | 2026-09-01 |

## Intent

Remove hardcoded non-prod AWS account IDs from workflows, SAM template, vars.json, and setup scripts; use GitHub vars and env vars like SECRET-001.

## Spec traceability

| Scenario | Implemented? |
| --- | --- |
| @R-21.1 Dev deploy vars.DOMAIN_CERTIFICATE_ARN | Yes |
| @R-21.2 Test deploy vars.DOMAIN_CERTIFICATE_ARN | Yes |
| @R-21.3 No DomainCertificateArn Default in template | Yes |
| @R-21.4 Scripts require env vars for account ID | Yes |

## Human checkpoint 3

- Reviewer: kmandryk (simulated pilot) Date: 2026-09-01

---

# PR evidence — [RA SECRET-003] Route53 zone ID via env/lookup

| Field | Value |
| --- | --- |
| PR / branch | fix/secret-003 |
| Spec refs | `spec/features/secret-003-route53-zone-id.feature` |
| Authoring agent | Local Cursor agent |
| Generated | 2026-09-01 |

## Intent

Remove hardcoded Route53 zone ID; resolve from ROUTE53_ZONE_ID env var or AWS lookup.

## Spec traceability

| Scenario | Implemented? |
| --- | --- |
| @R-22.1 No hardcoded zone ID | Yes |
| @R-22.2 Dynamic lookup fallback | Yes |

## Human checkpoint 3

- Reviewer: kmandryk (simulated pilot) Date: 2026-09-01

---

# PR evidence — [RA TEST-003] E2E scaffold and smoke test

| Field | Value |
| --- | --- |
| PR / branch | fix/test-003 |
| Spec refs | `spec/features/test-003-e2e-scaffold.feature` |
| Authoring agent | Local Cursor agent |
| Generated | 2026-09-01 |

## Intent

Add Playwright scaffold, smoke app-shell test, and e2e-testing.md documenting planned auth boundary tests.

## Spec traceability

| Scenario | Implemented? |
| --- | --- |
| @R-23.1 Playwright scaffold | Yes — package.json + playwright.config.ts |
| @R-23.2 Smoke test | Yes — e2e/smoke/app-shell.spec.ts |
| @R-23.3 Auth boundary scaffold doc | Yes — docs/e2e-testing.md |

## Human checkpoint 3

- Reviewer: kmandryk (simulated pilot) Date: 2026-09-01

---

# PR evidence — [RA VULN-001] Historical pill XSS fix

| Field | Value |
| --- | --- |
| PR / branch | fix/vuln-001 |
| Spec refs | `spec/features/vuln-001-historical-pill-xss.feature` |
| Authoring agent | Local Cursor agent |
| Generated | 2026-09-01 |

## Intent

Replace innerHtml highlight binding with plain text interpolation to prevent stored XSS from sub-area names.

## Spec traceability

| Scenario | Implemented? |
| --- | --- |
| @R-24.1 Text binding not innerHtml | Yes |
| @R-24.2 Malicious markup stays literal | Yes — unit test |

## Human checkpoint 3

- Reviewer: kmandryk (simulated pilot) Date: 2026-09-01

---

# PR evidence — [RA AUTH-004] Token refresh failure redirect

| Field | Value |
| --- | --- |
| PR / branch | fix/auth-004 |
| Spec refs | `spec/features/auth-004-token-refresh-redirect.feature` |
| Authoring agent | Local Cursor agent |
| Generated | 2026-09-01 |

## Intent

When Keycloak background token refresh fails on expiry, redirect to `/login` instead of leaving the user in a stale session.

## Spec traceability

| Scenario | Implemented? |
| --- | --- |
| @R-25.1 Refresh failure redirects to login | Yes — `onTokenExpired` catch calls `window.location.assign('/login')` |

## Human checkpoint 3

- Reviewer: kmandryk (simulated pilot) Date: 2026-09-01

---

# PR evidence — [RA AUTH-005] Require KEYCLOAK_CLIENT_ID

| Field | Value |
| --- | --- |
| PR / branch | fix/auth-005 |
| Spec refs | `spec/features/auth-005-keycloak-client-id.feature` |
| Authoring agent | Local Cursor agent |
| Generated | 2026-09-01 |

## Intent

Remove hardcoded `nrpti-admin` fallback; fail init with toast when KEYCLOAK_CLIENT_ID is missing.

## Spec traceability

| Scenario | Implemented? |
| --- | --- |
| @R-26.1 Missing client id fails clearly | Yes |
| @R-26.2 Configured client id passed to adapter | Yes |

## Human checkpoint 3

- Reviewer: kmandryk (simulated pilot) Date: 2026-09-01

---

# PR evidence — [RA AUTH-006] Interceptor 401 refresh

| Field | Value |
| --- | --- |
| PR / branch | fix/auth-006 |
| Spec refs | `spec/features/auth-006-interceptor-401.feature` |
| Authoring agent | Local Cursor agent |
| Generated | 2026-09-01 |

## Intent

Refresh token on HTTP 401 only; propagate 403 without refresh per RFC 9110.

## Spec traceability

| Scenario | Implemented? |
| --- | --- |
| @R-27.1 401 triggers refresh and retry | Yes |
| @R-27.2 403 passes through | Yes |

## Human checkpoint 3

- Reviewer: kmandryk (simulated pilot) Date: 2026-09-01

---

# PR evidence — [RA AUTH-007] Interceptor host allowlist

| Field | Value |
| --- | --- |
| PR / branch | fix/auth-007 |
| Spec refs | `spec/features/auth-007-interceptor-allowlist.feature` |
| Authoring agent | Local Cursor agent |
| Generated | 2026-09-01 |

## Intent

Attach Bearer token only when request host matches `API_LOCATION` origin.

## Spec traceability

| Scenario | Implemented? |
| --- | --- |
| @R-28.1 API host receives Bearer | Yes |
| @R-28.2 Third-party host omits Bearer | Yes |

## Human checkpoint 3

- Reviewer: kmandryk (simulated pilot) Date: 2026-09-01

---

# PR evidence — [RA AUTHZ-003] Header manage-subareas nav

| Field | Value |
| --- | --- |
| PR / branch | fix/authz-003 |
| Spec refs | `spec/features/authz-003-header-manage-subareas.feature` |
| Authoring agent | Local Cursor agent |
| Generated | 2026-09-01 |

## Intent

Filter manage-subareas from header navigation when isAllowed returns false.

## Spec traceability

| Scenario | Implemented? |
| --- | --- |
| @R-29.1 Hidden for non-admin | Yes |
| @R-29.2 Shown for admin | Yes |

## Human checkpoint 3

- Reviewer: kmandryk (simulated pilot) Date: 2026-09-01

---

# PR evidence — [RA AUTHZ-004] isAdmin role constant

| Field | Value |
| --- | --- |
| PR / branch | fix/authz-004 |
| Spec refs | `spec/features/authz-004-isadmin-role-constant.feature` |
| Authoring agent | Local Cursor agent |
| Generated | 2026-09-01 |

## Intent

Use Constants.ApplicationRoles.ADMIN in isAdmin() instead of hardcoded sysadmin string.

## Spec traceability

| Scenario | Implemented? |
| --- | --- |
| @R-30.1 Admin role detection | Yes |
- Reviewer: kmandryk (simulated pilot) Date: 2026-09-01

---

# PR evidence — [RA AUTHZ-005] isAdmin optional chaining

| Field | Value |
| --- | --- |
| PR / branch | fix/authz-005 |
| Spec refs | `spec/features/authz-005-isadmin-optional-chaining.feature` |
| Authoring agent | Local Cursor agent |
| Generated | 2026-09-01 |

## Intent

Add optional chaining on roles in isAdmin() to avoid TypeError on malformed JWTs.

## Spec traceability

| Scenario | Implemented? |
| --- | --- |
| @R-31.1 Missing roles property | Yes |
- Reviewer: kmandryk (simulated pilot) Date: 2026-09-01

---

# PR evidence — [RA BW-001] Lock Records unlock

| Field | Value |
| --- | --- |
| PR / branch | fix/bw-001 |
| Spec refs | `spec/features/bw-001-lock-records-unlock.feature` |
| Authoring agent | Local Cursor agent |
| Generated | 2026-09-01 |

## Intent

Add Unlock Records UI path calling lockUnlockFiscalYear(year, false).

## Spec traceability

| Scenario | Implemented? |
| --- | --- |
| @R-32.1 Lock passes true | Yes |
| @R-32.2 Unlock passes false | Yes |

## Human checkpoint 3

- Reviewer: kmandryk (simulated pilot) Date: 2026-09-01

---

# PR evidence — [RA BW-002] export-variance typo

| Field | Value |
| --- | --- |
| PR / branch | fix/bw-002 |
| Spec refs | `spec/features/bw-002-export-variance-typo.feature` |
| Authoring agent | Local Cursor agent |
| Generated | 2026-09-01 |

## Intent

Fix expor-variance typo to export-variance in checkForReports variance branch.

## Spec traceability

| Scenario | Implemented? |
| --- | --- |
| @R-33.1 Correct endpoint key | Yes |

## Human checkpoint 3

- Reviewer: kmandryk (simulated pilot) Date: 2026-09-01

---

# PR evidence — [RA DEP-001] remove chart.js

| Field | Value |
| --- | --- |
| PR / branch | fix/dep-001 |
| Spec refs | `spec/features/dep-001-remove-chartjs.feature` |
| Authoring agent | Local Cursor agent |
| Generated | 2026-09-01 |

## Intent

Remove unused chart.js runtime dependency from package.json and yarn.lock.

## Spec traceability

| Scenario | Implemented? |
| --- | --- |
| @R-34.1 Not in package.json | Yes |
| @R-34.2 Lockfile updated | Yes |

## Human checkpoint 3

- Reviewer: kmandryk (simulated pilot) Date: 2026-09-01

---


---

# PR evidence — [RA DEP-002] Remove unused jquery

| PR / branch | fix/dep-002 |
| Spec | `features/dep-002.feature` |

## Human checkpoint 3
- Reviewer: kmandryk Date: 2026-09-01


---

# PR evidence — [RA DEP-003] Replace moment with luxon

| PR / branch | fix/dep-003 |
| Spec | `features/dep-003.feature` |

## Human checkpoint 3
- Reviewer: kmandryk Date: 2026-09-01


---

# PR evidence — [RA LOG-008] Global ErrorHandler

| PR / branch | fix/log-008 |
| Spec | `features/log-008.feature` |

## Human checkpoint 3
- Reviewer: kmandryk Date: 2026-09-01


---

# PR evidence — [RA SECRET-004] Remove ApiGatewayId default

| PR / branch | fix/secret-004 |
| Spec | `features/secret-004.feature` |

## Human checkpoint 3
- Reviewer: kmandryk Date: 2026-09-01


---

# PR evidence — [RA SECRET-005] Gitignore env.js

| PR / branch | fix/secret-005 |
| Spec | `features/secret-005.feature` |

## Human checkpoint 3
- Reviewer: kmandryk Date: 2026-09-01


---

# PR evidence — [RA TEST-004] DataService unit tests

| PR / branch | fix/test-004 |
| Spec | `features/test-004.feature` |

## Human checkpoint 3
- Reviewer: kmandryk Date: 2026-09-01


---

# PR evidence — [RA TEST-005] CI runs unit tests

| PR / branch | fix/test-005 |
| Spec | `features/test-005.feature` |

## Human checkpoint 3
- Reviewer: kmandryk Date: 2026-09-01
