import {
  AfterAll,
  Before,
  BeforeAll,
  AfterStep,
  setDefaultTimeout
} from '@cucumber/cucumber';
import { ConsoleReporter } from '@serenity-js/console-reporter';
import { ArtifactArchiver, configure, Duration } from '@serenity-js/core';
import { SerenityBDDReporter } from '@serenity-js/serenity-bdd';
import {
  Photographer,
  TakePhotosOfInteractions,
  TakePhotosOfFailures
} from '@serenity-js/web';
import * as playwright from 'playwright';

import { Actors } from './Actors.js';

const timeouts = {
  cucumber: { step: Duration.ofSeconds(300) },
  playwright: {
    defaultNavigationTimeout: Duration.ofSeconds(10),
    defaultTimeout: Duration.ofSeconds(10)
  },
  serenity: { cueTimeout: Duration.ofSeconds(10) }
};

let browser = null;

// Configure Cucumber
setDefaultTimeout(timeouts.cucumber.step.inMilliseconds());

BeforeAll(async () => {
  let browserType = global.config.profile.browser;
  let headless = global.config.profile.headless;
  let baseURL = global.config.profile.baseUrl;
  let photoTakingStrategy = global.config.profile.screenshotInteractions
    ? TakePhotosOfInteractions
    : TakePhotosOfFailures;

  let channel = '';
  if (/^(chrome|msedge)/.test(browserType)) {
    channel = browserType;
    browserType = 'chromium';
  }
  browser = await playwright[browserType].launch({
    headless,
    channel
  });

  let browserOptions = global.config.browserOptions?.[browserType] || {};

  // Chromium browser identifies itself "HeadlessChrome" in headless mode
  // Some websites don't like HeadlessChrome
  if (global.config.profile.noHeadlessUserAgent && browserType === 'chromium') {
    const context = await browser.browserType().launch();
    const page = await context.newPage();
    const userAgent = await page.evaluate(() => {
      return navigator.userAgent;
    });
    context.close();
    browserOptions.userAgent = userAgent.replace(/Headless/i, '');
    console.log(`Default UserAgent: ${userAgent}`);
    console.log(`Custom UserAgent: ${browserOptions.userAgent}`);
  }

  // Configure Serenity/JS
  configure({
    actors: new Actors(browser, {
      ...browserOptions,
      baseURL,
      defaultNavigationTimeout:
        timeouts.playwright.defaultNavigationTimeout.inMilliseconds(),
      defaultTimeout: timeouts.playwright.defaultTimeout.inMilliseconds()
    }),

    // Configure Serenity/JS reporting services
    crew: [
      ArtifactArchiver.storingArtifactsAt('./target/site/serenity'),
      new SerenityBDDReporter(),
      ConsoleReporter.forDarkTerminals(),
      Photographer.whoWill(photoTakingStrategy)
    ],

    cueTimeout: timeouts.serenity.cueTimeout
  });
});

AfterAll(async () => {
  if (browser) {
    await browser.close();
  }
});

Before(async function (options) {
  if (global.features) {
    let testPage = global.features[options.gherkinDocument.uri];
    this.parameters.pageUrl = testPage.url;
  }
});

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

AfterStep(async function (options) {
  if (global.config.profile.stepPause) {
    await sleep(global.config.profile.stepPause*1000);
  }
});
