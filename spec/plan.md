# Plan — isAdmin centralized role constant (AUTHZ-004)

> Issue [#128](https://github.com/bcgov/bcparks-ar-admin-agentic-b/issues/128). Checkpoint 2.

## Summary

Replace the hardcoded `'sysadmin'` string in `KeycloakService.isAdmin()` with `Constants.ApplicationRoles.ADMIN`. Add or extend unit tests to assert admin detection uses the constant.

## Tasks

1. Update `isAdmin()` to call `roles.includes(Constants.ApplicationRoles.ADMIN)`.
2. Extend `keycloak.service.spec.ts` with a test that spies on the constant or verifies non-literal usage.
3. No change to `Constants.ApplicationRoles.ADMIN` value.

## Risk

Low — behaviour unchanged when constant value is `'sysadmin'`.
