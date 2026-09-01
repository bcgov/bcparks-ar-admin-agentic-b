# Plan — User-initiated logout (AUTH-003)

> Architecture and delivery approach for issue [#56](https://github.com/bcgov/bcparks-ar-admin-agentic-b/issues/56) / RA AUTH-003.  
> Checkpoint 1 (spec) is merged. This document is **checkpoint 2**.

## Summary

Add `KeycloakService.logout()` that calls `keycloakAuth.logout({ redirectUri })` for real Keycloak sessions, redirecting to the application root (or current origin without path). For **local mock auth**, clear `sessionStorage` mock-auth keys, reset the mock adapter's `authenticated` state and token, and navigate to `/`. Expose a logout control in `HeaderComponent` when the user is authenticated. Prove both paths via unit tests without a live IdP.

## Architecture

```text
HeaderComponent
  logout() → KeycloakService.logout()

KeycloakService.logout()
  ├─ if localMockAuth → clear sessionStorage + reset mock adapter + redirect /
  └─ else → keycloakAuth.logout({ redirectUri: origin + '/' })
```

## Key decisions

| Decision | Choice | Rationale |
| --- | --- | --- |
| Real logout API | `keycloakAuth.logout({ redirectUri })` | Standard keycloak-js end-session flow |
| Redirect target | App root (`/` on current origin) | Matches login redirect pattern; avoids `/login` loop |
| UI placement | Header welcome area (desktop + mobile menu) | Only header exists today; no separate account menu |
| Mock logout | Clear `LOCAL_MOCK_AUTH_KEY`, `LAST_IDP_AUTHENTICATED`, reset adapter | Consistent with mock init in `initLocalMockAuth()` |
| Verification | `keycloak.service.spec.ts` + `header.component.spec.ts` | Spy mock Keycloak `logout`; assert mock session cleared |

## Security & privacy

- Classification: Internal staff UI
- PIA: No new data collection
- Secrets: None
- Residual risk: Client logout ends browser session via Keycloak; API tokens may remain valid until expiry (server-side revocation out of scope)

## Test approach

- Cover `features/auth-003-logout.feature` scenarios:
  - Real path: mock `keycloakAuth.logout`; call `logout()`; expect called with `redirectUri`
  - Mock path: init local mock auth; call `logout()`; expect session storage cleared and `isAuthenticated()` false
- Header: authenticated user sees logout control; click invokes `KeycloakService.logout()`
- CI: `yarn lint` + `yarn test-ci` on implementation PR
- Update `docs/pr-evidence.md` on implementation PR

## Rollout

- Ship with next admin UI deploy
- Confirm Keycloak client post-logout redirect URIs include app root on lower env
- No data migration

## Approval (checkpoint 2) — **human required**

| Role | Name | Date |
| --- | --- | --- |
| Architect / tech lead | | |
| Security (if required) | | |

> Do not add `ready-for-agent` to #56 until this table is filled and this plan PR is merged.
