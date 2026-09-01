Feature: Unused chart.js dependency removed
  As a maintainer of the BC Parks admin SPA
  I want chart.js removed from runtime dependencies when it is unused
  So that the bundle and supply-chain surface stay minimal

  # Finding: RA DEP-001 · Issue: #146

  @R-34.1
  Scenario: chart.js is not declared in package.json dependencies
    Given the application source has no chart.js imports
    When package.json dependencies are inspected
    Then chart.js is not listed

  @R-34.2
  Scenario: yarn.lock no longer resolves chart.js as a direct dependency
    Given chart.js was removed from package.json
    When the lockfile is regenerated
    Then chart.js is not a direct project dependency
