Feature: User-initiated logout
  As a BC Parks staff member using a shared workstation
  I want to end my session proactively
  So that the next user cannot access the application under my identity

  # Finding: RA AUTH-003 · Issue: #56
  # Checkpoint 1 — acceptance owned by human sign-off in spec/spec.md
  # Verification: unit/service tests (no live Keycloak required in CI)

  @R-13.1
  Scenario: Authenticated user can log out via Keycloak adapter
    Given local mock auth is not active
    And Keycloak is enabled for the application
    And the user is authenticated
    When the user chooses to log out
    Then KeycloakService calls keycloakAuth.logout with a redirect URI
    And the session is terminated

  Scenario: Local mock auth logout clears the fake session
    Given local mock auth is active
    And the user is authenticated via mock auth
    When the user chooses to log out
    Then session storage for mock auth is cleared
    And the user is no longer authenticated
