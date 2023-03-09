import { Section } from './section';
import { Navigate } from '@serenity-js/web';

const urljoin = require('url-join');
const querystring = require('querystring');

export class Page extends Section {
  /**
   * Create a page
   * @param {string} urlPath URL path
   * @param {object} options
   * @param {string} options.urlQuery URL query string
   * @param {string} options.urlFrag URL fragment
   * @param {string} options.authorUrlPath URL path on AEM author
   */
  constructor(urlPath, options) {
    super();
    this._urlPath = urlPath || '/';
    options = options || {};
    this._urlQuery = options.urlQuery || {};
    this._urlFrag = options.urlFrag || null;
    this._headers = options.headers;
  }

  get urlPath() {
    return this._urlPath;
  }

  get urlQuery() {
    return this._urlQuery;
  }

  get urlFrag() {
    return this._urlFrag;
  }

  /**
   * Open a page at the path with query string.
   * If `path` starts with "http", it will not prefix `baseUrl` from the current profile
   * @param {string} path URL path
   * @param {string} query URL query string
   * @param {string} frag URL fragment
   * @param {object} headers Request headers
   */
  open(path, query, frag, headers) {
    this._urlPath = path || this.urlPath;
    this._urlQuery = query || this.urlQuery;
    this._urlFrag = frag || this.urlFrag;
    this._headers = headers || this.headers;
    // remove value is 'none'
    let params = Object.keys(this._urlQuery)
      .filter(key => this._urlQuery[key] != 'none')
      .reduce((obj, key) => {
        obj[key] = this._urlQuery[key];
        return obj;
      }, {});
    // if path already has fragment
    if (this._urlPath.includes('#')) {
      let parts = this._urlPath.split('#');
      this._urlPath = parts[0];
      this._urlFrag = parts[1];
    }
    // if path already has query params
    if (this._urlPath.includes('?')) {
      let parts = this._urlPath.split('?');
      this._urlPath = parts[0];
      Object.assign(params, querystring.decode(parts[1]));
    }

    let url = this._urlPath;

    let qstr = querystring.encode(params);

    if (!url.startsWith('http')) {
      url = urljoin(global.config.profile.baseUrl, url);
    }
    url = url + (qstr ? `?${qstr}` : '');
    url = url + (this._urlFrag == null ? '' : `#${this._urlFrag}`);

    return Navigate.to(url);
  }
}
