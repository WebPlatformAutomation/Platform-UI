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
  let browserOption = global.config.profile.browser;
  let headless = global.config.profile.headless;
  let baseURL = global.config.profile.baseUrl;
  let photoTakingStrategy = global.config.profile.screenshotInteractions
    ? TakePhotosOfInteractions
    : TakePhotosOfFailures;

  browser = await playwright[browserOption].launch({
    headless
  });

  // Configure Serenity/JS
  configure({
    actors: new Actors(browser, {
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
    await sleep(global.config.profile.stepPause);
  }
});
