# Plan — Export variance endpoint typo (BW-002)

> Issue [#141](https://github.com/bcgov/bcparks-ar-admin-agentic-b/issues/141). Checkpoint 2.

## Summary

One-character fix: change `'expor-variance'` to `'export-variance'` in `ExportService.checkForReports()` variance branch. Add unit test asserting correct endpoint key.

## Tasks

1. Fix typo on line 28 of `export.service.ts`.
2. Add spec test spying on ApiService.get for variance dataType.

## Risk

Minimal — aligns with other export-variance calls in the same file.
