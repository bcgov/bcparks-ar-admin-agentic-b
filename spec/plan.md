# Plan — Lock Records unlock workflow (BW-001)

> Issue [#136](https://github.com/bcgov/bcparks-ar-admin-agentic-b/issues/136). Checkpoint 2.

## Summary

Add a separate Unlock button alongside Lock Records. Refactor submit into lock()/unlock() methods passing true/false to `FiscalYearLockService.lockUnlockFiscalYear()`.

## Tasks

1. Add `unlock()` method calling `lockUnlockFiscalYear(year, false)`.
2. Rename or keep `submit()` as lock path with `lock=true`.
3. Add Unlock button in template (disabled when no year selected).
4. Unit tests spy on FiscalYearLockService for both paths.

## Risk

Low — service already supports unlock; UI-only gap.
