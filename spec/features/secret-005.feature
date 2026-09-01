Feature: SECRET-005 acceptance
  # Finding: RA SECRET-005 · Issue: #173

  @R-40.1
  Scenario: src/env.js is gitignored
    Given the SECRET-005 requirement
    When the fix is applied
    Then the criterion is satisfied
