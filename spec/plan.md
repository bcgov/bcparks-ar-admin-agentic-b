# Plan — SECRET-003 Route53 zone ID

## Approach

1. Remove hardcoded `ROUTE53_ZONE_ID` from `pre-migration-certificate-setup.sh`.
2. Resolve zone ID in order:
   - `ROUTE53_ZONE_ID` env var if set
   - Else dynamic lookup: `aws route53 list-hosted-zones-by-name --dns-name bcparks.ca` with profile `PARKSWEB_PROFILE`
3. Add `resolve_route53_zone_id()` helper function in script.
4. Document required env vars in script header.

## Out of scope

- Changing post-deploy-lza-dev.sh (already uses dynamic lookup)

## Risk

Low — operators need AWS CLI access for lookup when env var unset.
