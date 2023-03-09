import { By, PageElement, PageElements } from "@serenity-js/web";

export class Section {

  constructor() {}

  $(selector) {
    let bySelector = selector.startsWith('/')
      ? By.xpath(selector)
      : By.css(selector);
    return PageElement.located(bySelector);
  }

  $$(selector) {
    let bySelector = selector.startsWith('/')
      ? By.xpath(selector)
      : By.css(selector);
    return PageElements.located(bySelector);    
  }

  /**
   * Build element properties for a page object
   * @param {object[]} selector Array of element's get methods to be added to the object
   */
  buildProps(props) {
    for (let prop in props) {
      if (prop === "urlPath") {
        Object.defineProperty(this, prop, {
          get: new Function(`return '${props[prop]}';`),
        });
      } else {
        let func = props[prop];
        if (typeof func === "string") {
          if (func.startsWith("$$")) {
            func = `this.$$('${func.slice(2)}')`;
          } else {
            func = `this.$('${func}')`;
          }
        } else if (func instanceof Array) {
          func = `${func[0]}('${func[1]}')${func[2] || ""}`;
        }
        Object.defineProperty(this, prop, {
          get: new Function(`return ${func};`),
        });
      }
    }
  }
}
