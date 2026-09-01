Feature: VULN-003 acceptance
  # Finding: RA VULN-003 · Issue: #210

  @R-48.1
  Scenario: downloadReport validates URL before window.open
    Given the VULN-003 requirement
    When the fix is applied
    Then the criterion is satisfied
