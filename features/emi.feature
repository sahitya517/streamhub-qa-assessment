Feature: LoanLens EMI dashboard and reports

  Background:
    Given I open the LoanLens dashboard

  Scenario: Dashboard loads with summarized data
    Then the dashboard shows an EMI, total interest and total payment
    And the pie chart and bar chart are visible

  Scenario Outline: EMI matches independently computed value and pie chart is valid
    When I calculate a loan of <amount> at <rate> percent for <years> years
    Then the displayed EMI matches the independently computed EMI
    And the displayed total interest and total payment match the computed values
    And the pie chart is visible with principal and interest greater than zero
    And the bar chart shows <years> bars with non-zero heights

    Examples:
      | amount  | rate | years |
      | 2500000 | 10   | 10    |
      | 5000000 | 7.5  | 15    |
      | 1000000 | 12   | 5     |

  Scenario: Report filter limits the yearly table and bar tooltip shows values
    When I calculate a loan of 1000000 at 12 percent for 5 years
    And I filter the report to the first 3 years
    Then the yearly table has 3 rows
    When I hover over the first bar
    Then the tooltip shows year, principal and interest values greater than zero

  Scenario: Invalid input is rejected with an error message
    When I calculate a loan of -5 at 10 percent for 10 years
    Then an error message is shown
