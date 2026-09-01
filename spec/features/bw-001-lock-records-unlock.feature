Feature: Lock Records supports unlock workflow
  As a BC Parks sysadmin
  I want to unlock a previously locked fiscal year from the Lock Records screen
  So that corrections can be made without backend-only intervention

  # Finding: RA BW-001 · Issue: #136

  @R-32.1
  Scenario: Lock action passes lock=true to the fiscal year lock service
    Given a fiscal year is selected
    When the admin chooses to lock records
    Then lockUnlockFiscalYear is called with lock true

  @R-32.2
  Scenario: Unlock action passes lock=false to the fiscal year lock service
    Given a fiscal year is selected
    When the admin chooses to unlock records
    Then lockUnlockFiscalYear is called with lock false
