# Plan — CONFIG-005 Trivy scan automatic triggers

> Checkpoint 2 for issue [#65](https://github.com/bcgov/bcparks-ar-admin-agentic-b/issues/65).

## Approach

Re-enable the commented automatic triggers in `.github/workflows/analysis.yaml`:

| Trigger | Purpose |
| --- | --- |
| `push` → `main` | Scan merged code before deploy pipelines run |
| `pull_request` | Gate PRs with Trivy before merge (satisfies @R-15.2) |
| `schedule` (weekly cron) | Catch newly disclosed CVEs on default branch |

No changes to the Trivy job steps — existing `vuln,secret,config` scanners and SARIF upload remain.

## Out of scope

- Adding Trivy as a separate job in `on-pr.yaml` (analysis.yaml PR trigger covers @R-15.2)
- Blocking merge on CRITICAL/HIGH findings (existing workflow uploads SARIF only)
- Fixing existing vulnerability backlog

## Risks

- First PR with triggers enabled may surface existing findings in Security tab (expected)
- Weekly cron adds minimal Actions minutes

## Verification

- Inspect `analysis.yaml` `on:` block matches @R-15.1
- Open or update a PR and confirm **Trivy Security Scan** job runs
