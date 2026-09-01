# Plan — Require KEYCLOAK_CLIENT_ID (AUTH-005)

> Issue [#111](https://github.com/bcgov/bcparks-ar-admin-agentic-b/issues/111) / RA AUTH-005. Checkpoint 2.

## Summary

Remove the `'nrpti-admin'` fallback when `KEYCLOAK_CLIENT_ID` is absent. Before constructing the Keycloak adapter, validate the config value; if missing/empty, log an error, show a toast, and reject the init promise with a descriptive Error. Unit tests cover both failure and success paths.

## Key decisions

| Decision | Choice |
| --- | --- |
| Validation | Reject empty, null, or undefined `KEYCLOAK_CLIENT_ID` |
| User feedback | Toast + logger error (matches existing init failure pattern) |
| Fallback removal | Delete `'nrpti-admin'` literal entirely |

## Test approach

- `@R-26.1`: init rejects; Keycloak constructor not called
- `@R-26.2`: init succeeds with configured client id passed to adapter
