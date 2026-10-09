@api
Feature: JSONPlaceholder POST /posts boundary and invalid data handling

  Scenario: Excessively long title does not cause a server failure
    When I POST a post with a title of 100000 characters
    Then the response is not a 5xx server error

  Scenario: Unsupported special characters do not cause a server failure
    When I POST a post with special characters in the title
    Then the response is not a 5xx server error

  Scenario: Missing required userId does not cause a server failure
    When I POST a post without a userId
    Then the response is not a 5xx server error
    And I record whether the API validated the input
