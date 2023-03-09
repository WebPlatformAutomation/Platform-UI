# Platform-UI

Test Automation Framework with special supports for Franklin websites.

[See the demo project](https://github.com/WebPlatformAutomation/www)

## Install
```
npm install platform-ui-automation --save-dev
```

## Create Test Scenarios

* Create an E2E test directory. e.g. test\ or test\mywebsite\
* Create cucumber script files in the subdirectory features\
* The supporting JavaScript functions can be in any subdirectories.
* Create a file name profiles.yml in the E2E test directory. For example,
```
prod: 
  baseUrl: https://www.webplatform4.com

stage:
  baseUrl: https://www.stage.webplatform4.com
```

## Run

If the E2E test directory is named `test`
```
npx run test
```

Use `-p` to run tests in a different environment profile. e.g.

```
npx run test -p stage
```

Playwright is used as the automation framework so the supported browsers are the same. Use `-b` to specify the browser.

## Use with Franklin Website

The branch name can be resolved automatically and use in `profiles.yml`  
```
dev: 
  baseUrl: http://localhost:3000

preview: 
  baseUrl: https://${branch}--www--webplatformautomation.hlx.page

live: 
  baseUrl: https://${branch}--www--webplatformautomation.hlx.live

prod: 
  baseUrl: https://www.webplatform4.com
```

## Common Steps

| Step Definition Regex|
|-- |
| ^I go to this page$ |
| ^I go to "([^\"]*)" |
| ^I wait for (\d+) seconds$ |
| ^I resize the browser window to (\d+)x(\d+)$ |
| ^I (input\|enter) "([^\"]*)" into the element "([^\"]*)"$ |
| ^I (should\|wait to) see "([^\"]*)" in the address bar$ |
| ^I (should\|wait to) see the address bar contains "([^\"]*)"$ |
| ^I (should\|wait to) see "([^\"]*)" in the page content$ |

## Use Test Scripts in Content

If the page under test is `example` and the test script is in `example-test`.

```
npx run test -g example
``` 

## Command Line Options

| Option | Alias | Description |
| -- | -- | -- |
| --profile  | -p | Environment profile |
| --tags     | -t | Scenario tags for selection of tests |
| --browser  | -b | Browser choice from Playwright's supported browsers | 
| --headless | -h | Use the headless mode |
| --pages    | -g | Get test scenarios from the page's test page. To test multiple pages, use a comma to separate values. |
| --features | -f | Get test scenarios from the features's test page. To test multiple features, use a comma to separate values. |

## Step Definition Library

Installed NPM modules with the name starting with "platform-ui-lib-" will be loaded as a step definition library. For example, you can build an NPM package with the name "platform-ui-lib-mywebsite" and it has the step definitioins in the `lib` folder. The path will be added to Cucumber's require paths. See [this demo project](https://github.com/WebPlatformAutomation/Platform-UI-SauceDemo)

## Page Object Support

See the sample page objects in [this demo project](https://github.com/WebPlatformAutomation/Platform-UI-SauceDemo)