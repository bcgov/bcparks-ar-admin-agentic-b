# Tasks — Production certificate environment input (SECRET-001)

Derive from `spec/spec.md` + `features/secret-001-prod-certificate-arn.feature`. Issue: [#46](https://github.com/bcgov/bcparks-ar-admin-agentic-b/issues/46).

## Milestone 1 — Workflow change (after checkpoint 2 approval)

- [ ] **TASK-001** — In `.github/workflows/lza-deploy-admin-prod.yaml` SAM `--parameter-overrides`, set `DomainCertificateArn=${{ vars.DOMAIN_CERTIFICATE_ARN }}`. Do not change `environment: lza-prod`. Do not touch dev/test workflows.
- [ ] **TASK-002** — Update `docs/pr-evidence.md` with static proof that the override uses `vars.DOMAIN_CERTIFICATE_ARN` and is not a literal `arn:aws:acm:` value. **Do not reprint the previous ARN.**
- [ ] **TASK-003** — Open **draft** PR linking #46 (`Fixes #46`). Do **not** self-merge. Leave draft.

## After checkpoint 2 merge (human)

- [ ] Label #46 `ready-for-agent` so Copilot can open the draft
- [ ] **PAUSE before checkpoint 3 merge** until a human creates GitHub Environment `lza-prod` and sets `DOMAIN_CERTIFICATE_ARN`.

## Completed (prior slices)

- [x] AUTHZ-001 (#1), LOG-001 (#6), LOG-003 (#10), TEST-001 (#12), LOG-002 (#15), CRYPTO-001 (#23), CONFIG-003 (#29), CONFIG-004 (#33), CONFIG-002 (#37), AUTH-001 (#41)

## Next (not this slice)

- [ ] AUTHZ-002 dead guard conditions
