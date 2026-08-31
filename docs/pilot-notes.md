# Agentic SDLC pilot notes (bcparks-ar-admin-agentic-b)

Tier **2 v3** enrolment fork for pipeline testing.

## Backlog

Rapid-assessment ticket inventory (reset, all `pending`):

- [`bcparks-ar-admin-rapid-assessment-tickets.md`](bcparks-ar-admin-rapid-assessment-tickets.md)
- [`bcparks-ar-admin-rapid-assessment-tickets.csv`](bcparks-ar-admin-rapid-assessment-tickets.csv)

Pick one row with **File?** = `yes` and **GitHub** = `pending`, file the issue, then run checkpoints 1 → 2 → `ready-for-agent` → 3.

## Suggested first story (same as original pilot)

**AUTHZ-001** — AuthGuard bypass via query params on admin routes. Good first slice: small auth fix, unit-testable without Keycloak/API.

Alternatives that stay local/CI-friendly:

- **LOG-001** — remove config dump to console
- **TEST-001** — TokenInterceptor test coverage

## Pipeline checklist

1. File GitHub issue from ticket body in the backlog doc
2. **Checkpoint 1** — spec + Gherkin PR (`docs(spec)`)
3. **Checkpoint 2** — plan + tasks PR (`docs(plan)`)
4. Label issue `ready-for-agent` (or implement locally)
5. Implementation PR → checkpoint gate + spec review
6. **Checkpoint 3** — human merge

## Proven on enrol (2026-08-31)

- Tier 1 + Tier 2 v3 preflight green on push
- Constitution + CODEOWNERS from pilot (`@kmandryk` for governance paths)
