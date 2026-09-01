# Tasks — CONFIG-005 Trivy scan automatic triggers

> Issue [#65](https://github.com/bcgov/bcparks-ar-admin-agentic-b/issues/65) · Feature `config-005-trivy-triggers.feature`

## Completed (shipped on agentic-b)

- [x] AUTHZ-001 (#1), LOG-001 (#6), LOG-003 (#10), TEST-001 (#12), LOG-002 (#15), CRYPTO-001 (#23), CONFIG-003 (#29), CONFIG-004 (#33), CONFIG-002 (#37), AUTH-001 (#41), SECRET-001 (#46), AUTH-002 (#50), AUTH-003 (#56), AUTHZ-002 (#58)

## Active slice — CONFIG-005

- [ ] **TASK-001** — Uncomment `push`, `pull_request`, and `schedule` triggers in `.github/workflows/analysis.yaml` (@R-15.1)
- [ ] **TASK-002** — Confirm Trivy job `if: !draft` still applies for PR events (@R-15.2)
- [ ] **TASK-003** — Append `docs/pr-evidence.md` section with spec traceability and workflow verification notes
- [ ] **TASK-004** — Update backlog row CONFIG-005 → `#65`; move slice to completed in `spec/spec.md`; reset plan/tasks placeholder
- [ ] **TASK-005** — Regenerate `spec/criteria-index.json` (includes @R-15.1, @R-15.2)
