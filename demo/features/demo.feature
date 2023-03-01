Feature: Platform-UI Automation Demo

  @id-1
  Scenario: Go to the home page
    Given I go to "/"
     Then I resize the browser window to 1920x1080
     Then I wait for 5 seconds
     Then I should see the address bar contains "adobe.com"

  @id-2
  Scenario: Do Google search
    Given I go to "https://www.google.com"
     Then I enter "pizza" into the element "//input[@name='q']"
     Then I should see the address bar contains "https://www.google.com/search"
     Then I should see "pizza" in the page content