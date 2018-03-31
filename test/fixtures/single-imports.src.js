/**
 * Module dependencies.
 */

import * as _ from "lodash";
import { each, filter } from 'lodash';

/**
 * Export Main class.
 */

export class Main {

  public doIt() {
    each([], (e) => {
      console.log(e);
    });

    _.isArray({});

    filter([], { name: "joe" });

    _.get({}, 'test');
  }
}
