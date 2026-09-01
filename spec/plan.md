# Plan — Verified token claims (AUTH-002)

> Architecture and delivery approach for issue [#50](https://github.com/bcgov/bcparks-ar-admin-agentic-b/issues/50) / RA AUTH-002.  
> Checkpoint 1 (spec) is merged. This document is **checkpoint 2**.

## Summary

Introduce `KeycloakService.getTokenClaims()` as the single entry point for JWT claim reads. For **real** Keycloak sessions, return `keycloakAuth.tokenParsed` (library-maintained claims from the verified session). For **local mock auth**, return `JwtUtil.decodeToken(token)` on the fake JWT. Refactor `isAuthorized()`, `isAdmin()`, `getWelcomeMessage()`, and `getIdpFromToken()` to use `getTokenClaims()` instead of calling `JwtUtil.decodeToken` directly. Prove via unit tests that the real-auth path reads `tokenParsed` and never invokes `JwtUtil.decodeToken`.

## Architecture

```text
KeycloakService
  getTokenClaims()
    ├─ if localMockAuth → JwtUtil.decodeToken(getToken())
    └─ else → keycloakAuth.tokenParsed (may be null/undefined if no session)

  isAuthorized / isAdmin / getWelcomeMessage / getIdpFromToken
    → getTokenClaims()  (no direct JwtUtil.decodeToken)
```

## Key decisions

| Decision | Choice | Rationale |
| --- | --- | --- |
| Claim source (real auth) | `keycloakAuth.tokenParsed` | keycloak-js maintains parsed claims from verified OIDC session |
| Claim source (mock auth) | `JwtUtil.decodeToken` | Mock adapter has no `tokenParsed`; fake JWT is locally generated |
| Scope of refactor | Four methods on `KeycloakService` | Matches finding; minimal blast radius |
| `isAuthenticated()` | Unchanged | Already uses `keycloakAuth.authenticated` |
| Verification | Extend `keycloak.service.spec.ts` | Spy `JwtUtil.decodeToken`; assert not called on real path; assert `tokenParsed` used |

## Security & privacy

- Classification: Internal staff UI
- PIA: No new data collection
- Secrets: None
- Residual risk: Client-side role checks remain advisory; API authorization is authoritative. Aligning with `tokenParsed` reduces divergence from library session state.

## Test approach

- Cover `features/auth-002-token-claims.feature` scenarios:
  - Real path: set `keycloakAuth.tokenParsed` on service; spy `JwtUtil.decodeToken`; call `isAdmin()` / `getIdpFromToken()` / etc.; expect decode spy not called; expect results from `tokenParsed`
  - Mock path: activate local mock auth; expect `JwtUtil.decodeToken` used (or equivalent mock-token claims returned)
- CI: `yarn lint` + `yarn test-ci` on implementation PR
- Update `docs/pr-evidence.md` on implementation PR

## Rollout

- Ship with next admin UI deploy
- No data migration
- Optional human smoke: confirm welcome message and admin routes after IDIR login on lower env

## Approval (checkpoint 2) — **human required**

| Role | Name | Date |
| --- | --- | --- |
| Architect / tech lead | | |
| Security (if required) | | |

> Do not add `ready-for-agent` to #50 until this table is filled and this plan PR is merged.
