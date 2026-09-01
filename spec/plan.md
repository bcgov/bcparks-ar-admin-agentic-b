# Plan — VULN-001 Historical pill XSS

## Approach

1. Change `getHighlightedMatch()` to return plain text segments (no HTML wrappers).
2. Replace `[innerHtml]` with `{{ }}` text interpolation in template; keep `custom-highlight` class on middle span.
3. Update unit tests for plain-text segments and malicious input case (@R-24.2).

## Out of scope

- Server-side validation of sub-area names

## Risk

Low — visual highlight unchanged; safer binding model.
