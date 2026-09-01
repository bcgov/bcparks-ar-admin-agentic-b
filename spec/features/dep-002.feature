Feature: DEP-002 acceptance
  # Finding: RA DEP-002 · Issue: #155

  @R-35.1
  Scenario: jquery is not in package.json or angular.json scripts
    Given the DEP-002 requirement
    When the fix is applied
    Then the criterion is satisfied
