# Plan — SECRET-002 non-prod AWS account IDs

## Approach

1. **CI/CD workflows** (`lza-deploy-admin-dev.yaml`, `lza-deploy-admin-test.yaml`): replace hardcoded `DomainCertificateArn` ARNs with `${{ vars.DOMAIN_CERTIFICATE_ARN }}` (same pattern as prod SECRET-001).
2. **template.yaml**: remove `Default:` from `DomainCertificateArn` parameter.
3. **vars.json**: remove `DomainCertificateArn` entry containing legacy account ARN.
4. **setup-lza-admin-dev-environment.sh**: require `AWS_ACCOUNT_ID` env var; derive profile name from it.
5. **post-deploy-lza-dev.sh**: require `AWS_PROFILE_LZA` env var (no embedded account ID).
6. **pre-migration-certificate-setup.sh**: require `LZA_ACCOUNT`, `OLD_ACCOUNT`, `LZA_PROFILE` via env vars.
7. Add static workflow/spec verification tests if feasible (grep-based spec or simple node check).

## Out of scope

- Rotating or provisioning GitHub environment vars (operator task)
- SECRET-004 ApiGatewayId defaults (separate finding)

## Risk

Medium — deploy workflows will fail until `vars.DOMAIN_CERTIFICATE_ARN` is set per environment (same pause note as SECRET-001).
