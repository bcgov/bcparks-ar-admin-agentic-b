Feature: DEP-001 acceptance criteria
  # Finding: RA DEP-001 · Issue: #148

  @R-34.1
  Scenario: chart.js is not listed in runtime dependencies
    Given the DEP-001 fix is required
    When the implementation is verified
    Then the acceptance criterion is satisfied
