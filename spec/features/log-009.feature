Feature: LOG-009 acceptance
  # Finding: RA LOG-009 · Issue: #198

  @R-46.1
  Scenario: debug logs omit internal identifiers
    Given the LOG-009 requirement
    When the fix is applied
    Then the criterion is satisfied
