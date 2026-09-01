Feature: Token claims from verified Keycloak session
  As a security-conscious operator of the A&R Admin UI
  I want role and IDP decisions to use library-verified token claims
  So that authorization stays aligned with the authenticated Keycloak session

  # Finding: RA AUTH-002 · Issue: #50
  # Checkpoint 1 — acceptance owned by human sign-off in spec/spec.md
  # Verification: unit/service tests (no live Keycloak required in CI)

  @R-12.1
  Scenario: Real Keycloak session uses tokenParsed for role and IDP claims
    Given local mock auth is not active
    And Keycloak is enabled for the application
    When authorization or IDP helpers need token claims
    Then claims are read from the Keycloak adapter tokenParsed
    And JwtUtil.decodeToken is not used on the real-auth path

  Scenario: Local mock auth uses JwtUtil decode for claims
    Given local mock auth is active
    When authorization or IDP helpers need token claims
    Then claims are read via JwtUtil.decodeToken on the mock token
