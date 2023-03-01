const { setWorldConstructor, World } = require("@cucumber/cucumber");

class TheWorld extends World {
  /**
   * Constructor of TheWorld
   */
  constructor(options) {
    super(options);
    this.currPage = null;
    this.prevPage = null;
  }

  /**
   * @type {Page}
   * @description Set the current page object
   */
  set page(value) {
    this.prevPage = this.currPage;
    this.currPage = value;
  }

  /**
   * @type {Page}
   * @description Get the current page object
   */
  get page() {
    return this.currPage;
  }

  /**
   * Switch to the expected page context if it is not.
   *
   * @param {object} pageClass The expected page class for the current context.
   */
  context(pageClass) {
    if (!(this.page instanceof pageClass)) {
      this.page = new pageClass();
    }
  }
}

setWorldConstructor(TheWorld);
