Feature: LOG-008 acceptance
  # Finding: RA LOG-008 · Issue: #163

  @R-37.1
  Scenario: AppErrorHandler is registered in AppModule
    Given the LOG-008 requirement
    When the fix is applied
    Then the criterion is satisfied
