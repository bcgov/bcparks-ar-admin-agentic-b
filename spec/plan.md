# Plan — Hide manage-subareas header nav (AUTHZ-003)

> Issue [#123](https://github.com/bcgov/bcparks-ar-admin-agentic-b/issues/123). Checkpoint 2.

## Summary

Add `manage-subareas` branch to `HeaderComponent` route filter using `keycloakService.isAllowed('manage-subareas')`, matching export-reports and lock-records. Unit tests for admin vs non-admin route lists.
