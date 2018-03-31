/**
 * Module dependencies.
 */

import * as _isArray from "lodash/isArray";
import * as _get from "lodash/get";
import each from 'lodash/each';
import filter from 'lodash/filter';

/**
 * Export Main class.
 */

export class Main {

  public doIt() {
    each([], (e) => {
      console.log(e);
    });

    _isArray({});

    filter([], { name: "joe" });

    _get({}, 'test');
  }
}
