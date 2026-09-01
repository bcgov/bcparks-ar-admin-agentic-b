Feature: Export variance job status uses correct API endpoint
  As a BC Parks admin exporting variance reports
  I want the variance job status check to call the correct API endpoint
  So that existing export jobs are detected before starting duplicates

  # Finding: RA BW-002 · Issue: #141

  @R-33.1
  Scenario: Variance job status check calls export-variance endpoint
    Given a variance export job status check is requested
    When checkForReports runs for dataType variance
    Then ApiService.get is called with endpoint export-variance
