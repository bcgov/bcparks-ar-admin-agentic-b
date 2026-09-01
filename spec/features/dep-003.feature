Feature: DEP-003 acceptance
  # Finding: RA DEP-003 · Issue: #159

  @R-36.1
  Scenario: moment is removed from dependencies
    Given the DEP-003 requirement
    When the fix is applied
    Then the criterion is satisfied
