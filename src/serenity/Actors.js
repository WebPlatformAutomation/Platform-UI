import { Cast } from '@serenity-js/core';
import { BrowseTheWebWithPlaywright } from '@serenity-js/playwright';

export class Actors extends Cast {
  constructor(browser, options) {
    super(browser, options);
    this.browser = browser;
    this.options = options;
  }

  prepare(actor) {
    return actor.whoCan(
      BrowseTheWebWithPlaywright.using(this.browser, this.options)
    );
  }
}
