Feature: Variance export job status uses correct endpoint key
  As a BC Parks admin exporting variance reports
  I want checkForReports to query the correct API endpoint
  So that existing variance job status is detected before starting duplicates

  # Finding: RA BW-002 · Issue: #143

  @R-33.1
  Scenario: checkForReports variance branch calls export-variance endpoint
    Given a variance export job status check is requested
    When checkForReports runs for dataType variance
    Then ApiService.get is called with export-variance not expor-variance
