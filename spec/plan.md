# Plan — VULN-002
> Issue [#190](https://github.com/bcgov/bcparks-ar-admin-agentic-b/issues/190). CP2.
## Summary
URL-encode query parameter keys and values in ApiService.generateQueryString().
## Tasks
1. Apply encodeURIComponent to keys and values.
2. Extend api.service.spec.ts for @R-44.1.
## Risk
Low.
