import { Then } from '@cucumber/cucumber';
import { actorCalled, Wait, Duration } from '@serenity-js/core';
import {
  Navigate,
  Enter,
  Press,
  Key,
  Page,
  PageElement,
  Text,
  By
} from '@serenity-js/web';
import { Ensure, equals, includes } from '@serenity-js/assertions';

Then(/^I go to this page$/, async function () {
  await actorCalled('I').attemptsTo(Navigate.to(this.parameters.pageUrl));
});

Then(/^I go to "([^\"]*)"$/, async function (path) {
  path = path.trim();
  await actorCalled('I').attemptsTo(Navigate.to(path));
});

Then(/^I wait for (\d+) seconds$/, async function (seconds) {
  await actorCalled('I').attemptsTo(Wait.for(Duration.ofSeconds(seconds)));
});

Then(
  /^I resize the browser window to (\d+)x(\d+)$/,
  async function (width, height) {
    await actorCalled('I').attemptsTo(
      Page.current().setViewportSize({ width, height })
    );
  }
);

Then(
  /^I (input|enter) "([^\"]*)" into the element "([^\"]*)"$/,
  async function (inputOrEnter, text, selector) {
    let locator = selector.startsWith('//')
      ? By.xpath(selector)
      : By.css(selector);
    await actorCalled('I').attemptsTo(
      Enter.theValue(text).into(PageElement.located(locator))
    );
    if (inputOrEnter === 'enter') {
      await actorCalled('I').attemptsTo(Press.the(Key.Enter));
    }
  }
);

Then(
  /^I (should|wait to) see "([^\"]*)" in the address bar$/,
  async function (should, url) {
    await actorCalled('I').attemptsTo(
      Wait.until(Page.current().url().href, equals(url))
    );
    //if (should === 'should') {
    //  await actorCalled('I').attemptsTo(
    //    Ensure.that(Page.current().url().href, equals(url))
    //  );
    //}
  }
);

Then(
  /^I (should|wait to) see the address bar contains "([^\"]*)"$/,
  async function (should, fragment) {
    await actorCalled('I').attemptsTo(
      Wait.until(Page.current().url().href, includes(fragment))
    );
    //if (should === 'should') {
    //  await actorCalled('I').attemptsTo(
    //    Ensure.that(Page.current().url().href, includes(fragment))
    //  );
    //}
  }
);

Then(
  /^I (should|wait to) see "([^\"]*)" in the page content$/,
  async function (should, fragment) {
    await actorCalled('I').attemptsTo(
      Wait.until(
        Text.of(PageElement.located(By.css('body'))),
        includes(fragment)
      )
    );
    //if (should === 'should') {
    //  await actorCalled('I').attemptsTo(
    //    Ensure.that(Text.of(PageElement.located(By.css('body'))), includes(fragment))
    //  );
    //}
  }
);
