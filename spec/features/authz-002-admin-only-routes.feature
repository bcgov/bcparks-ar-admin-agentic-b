Feature: Admin-only route enforcement in isAllowed()
  As a security-conscious operator of the A&R Admin UI
  I want export-reports and review-data to require admin privileges
  So that AuthGuard route checks are live code, not dead guards

  # Finding: RA AUTHZ-002 · Issue: #58
  # Verification: unit tests in keycloak.service.spec.ts and auth.guard.spec.ts (no live Keycloak required)

  @R-14.1
  Scenario: Non-admin denied export-reports capability
    Given I am authenticated with a non-admin Keycloak session
    When isAllowed is checked for "export-reports"
    Then access is denied

  Scenario: Non-admin denied review-data capability
    Given I am authenticated with a non-admin Keycloak session
    When isAllowed is checked for "review-data"
    Then access is denied

  Scenario: Admin allowed export-reports and review-data capabilities
    Given I am authenticated with a sysadmin Keycloak session
    When isAllowed is checked for "export-reports"
    Then access is granted
    And isAllowed is checked for "review-data"
    And access is granted

  Scenario: AuthGuard redirects non-admin from export-reports path
    Given I am authenticated and authorized for the application
    And I am not allowed the "export-reports" capability
    When I activate the route with url "/export-reports"
    Then the guard redirects me to "/"

  Scenario: AuthGuard redirects non-admin from review-data path
    Given I am authenticated and authorized for the application
    And I am not allowed the "review-data" capability
    When I activate the route with url "/review-data"
    Then the guard redirects me to "/"
