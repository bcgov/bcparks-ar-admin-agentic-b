Feature: TEST-005 acceptance
  # Finding: RA TEST-005 · Issue: #181

  @R-42.1
  Scenario: deploy workflows run npm test
    Given the TEST-005 requirement
    When the fix is applied
    Then the criterion is satisfied
