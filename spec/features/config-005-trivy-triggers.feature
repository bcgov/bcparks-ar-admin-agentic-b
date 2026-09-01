Feature: Trivy security scan runs on automatic CI triggers
  As a security-conscious operator of the A&R Admin UI pipeline
  I want the Trivy repository scan to run on push, pull requests, and schedule
  So that vulnerabilities, secrets, and IaC misconfigurations are caught before deploy

  # Finding: RA CONFIG-005 · Issue: #65
  # Checkpoint 1 — acceptance owned by human sign-off in spec/spec.md
  # Verification: workflow YAML inspection; Trivy job runs on PR in CI

  @R-15.1
  Scenario: Analysis workflow has automatic triggers enabled
    Given the repository security scan workflow exists
    When its trigger configuration is inspected
    Then push to main is an active trigger
    And pull_request is an active trigger
    And a weekly scheduled cron trigger is active

  @R-15.2
  Scenario: Trivy scan runs on pull requests
    Given a pull request is opened against main
    When CI workflows execute
    Then the Trivy security scan job runs
    And the scan covers vulnerabilities secrets and config
