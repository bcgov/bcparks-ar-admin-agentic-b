Feature: SECRET-004 acceptance
  # Finding: RA SECRET-004 · Issue: #169

  @R-39.1
  Scenario: template.yaml has no ApiGatewayId default
    Given the SECRET-004 requirement
    When the fix is applied
    Then the criterion is satisfied
