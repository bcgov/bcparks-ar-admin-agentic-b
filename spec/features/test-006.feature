Feature: TEST-006 acceptance
  # Finding: RA TEST-006 · Issue: #185

  @R-43.1
  Scenario: karma coverage thresholds configured
    Given the TEST-006 requirement
    When the fix is applied
    Then the criterion is satisfied
