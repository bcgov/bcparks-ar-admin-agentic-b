# Plan — Remove unused chart.js (DEP-001)

> Issue [#146](https://github.com/bcgov/bcparks-ar-admin-agentic-b/issues/146). Checkpoint 2.

## Summary

Remove `chart.js` from `package.json` dependencies and run `yarn install` to refresh `yarn.lock`. No source imports exist; no code changes beyond dependency manifest.

## Tasks

1. Delete `"chart.js": "^4.3.0"` from package.json dependencies.
2. Run `yarn install` to update yarn.lock.
3. Verify no remaining direct chart.js reference in package.json.

## Risk

None — confirmed zero imports in src/.
