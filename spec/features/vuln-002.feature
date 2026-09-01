Feature: VULN-002 acceptance
  # Finding: RA VULN-002 · Issue: #190

  @R-44.1
  Scenario: ApiService encodes query values
    Given the VULN-002 requirement
    When the fix is applied
    Then the criterion is satisfied
