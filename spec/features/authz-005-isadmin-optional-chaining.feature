Feature: isAdmin handles missing roles safely
  As a BC Parks admin application
  I want isAdmin() to return false when JWT roles are absent
  So that atypically-structured tokens do not crash route guards

  # Finding: RA AUTHZ-005 · Issue: #132

  @R-31.1
  Scenario: isAdmin returns false when resource_access entry has no roles property
    Given the user token has attendance-and-revenue resource_access without roles
    When isAdmin is evaluated
    Then the result is false
    And no TypeError is thrown

  @R-31.2
  Scenario: isAdmin returns false when roles array is empty
    Given the user token has an empty roles array for attendance-and-revenue
    When isAdmin is evaluated
    Then the result is false
