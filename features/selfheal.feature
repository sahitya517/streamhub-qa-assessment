@selfheal
Feature: Legacy page with deliberately broken locators (self-healing demo)

  Scenario: Calculate using legacy locators
    Given I open the legacy LoanLens page
    When I use the legacy locators to calculate a loan
    Then the legacy total interest label is visible
