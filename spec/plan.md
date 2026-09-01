# Plan — isAdmin optional chaining (AUTHZ-005)

> Issue [#132](https://github.com/bcgov/bcparks-ar-admin-agentic-b/issues/132). Checkpoint 2.

## Summary

Change `isAdmin()` to use optional chaining on `roles` before `.includes()`, returning false when roles is undefined. Add unit tests for missing and empty roles.

## Tasks

1. Update return expression to `jwt?.resource_access?.['attendance-and-revenue']?.roles?.includes(...) ?? false` or equivalent.
2. Add spec cases for missing roles property and empty roles array.

## Risk

Low — defensive fix; normal tokens unchanged.
