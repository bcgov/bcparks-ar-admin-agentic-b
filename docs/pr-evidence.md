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
