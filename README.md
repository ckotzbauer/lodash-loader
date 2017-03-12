# Lodash Loader

[![Build Status](https://travis-ci.org/code-chris/lodash-loader.svg?branch=master)](https://travis-ci.org/code-chris/lodash-loader)
[![NPM](https://img.shields.io/npm/v/lodash-loader.svg)](https://www.npmjs.com/package/lodash-loader)
[![Greenkeeper badge](https://badges.greenkeeper.io/code-chris/lodash-loader.svg)](https://greenkeeper.io/)


This Webpack loader cherry-picks Lodash functions and require them explicitly to reduce the webpack bundle size.


## Installation

```
npm install lodash-loader
```


## Usage

### JavaScript source files

Add this to your webpack.config.js to apply the logic to your `.js` files.

```js
var createLodashAliases = require('lodash-loader').createLodashAliases;

module.exports = {
  ...
  module: {
    rules: [
	    { test: /\.js$/, loader: "babel-loader!lodash-loader" }
	  ]
  },
  resolve: {
    alias: createLodashAliases()
  }
  ...
};
```

### TypeScript source files

Add this to your webpack.config.js to apply the logic to your `.ts` files.

```js
var createLodashAliases = require('lodash-loader').createLodashAliases;

module.exports = {
  ...
  module: {
    rules: [
	    { test: /\.ts$/, loader: "ts-loader!lodash-loader" }
	  ]
  },
  resolve: {
    alias: createLodashAliases()
  }
  ...
};
```

*Note:* This loader has to run before babel-loader or ts-loader.

## Important notes

This loader changes your code to explicitly reference single lodash functions instead of import the whole lodash library.

Example:
```js
import * as _ from "lodash";

export class Main {

    public myMethod() {
        _.each([], (e) => {
            console.log(e);
        });

        _.isArray({});

        _.filter([], { name: "joe" });
    }
}
```

This is modified to:
```js
import * as _each from "lodash/each";
import * as _isArray from "lodash/isArray";
import * as _filter from "lodash/filter";

export class Main {

    public myMethod() {
        _each([], (e) => {
            console.log(e);
        });

        _isArray({});

        _filter([], { name: "joe" });
    }
}
```

This works only if you import the lodash library in your code. Do NOT use lodash from browsers `window` variable. The import
has to be a valid ES2015 or TypeScript-Import:
```js
import _ from "lodash";
import * as _ from "lodash";
```

Function chaining is NOT supported at the moment. The same applies to `lodash/fp` functions.


## Comparison

This are analysis of a webpack build from a medium-sized web-project. There were 11 different functions in use.

| Analyse                                                                                                        | Library                            |
| -------------------------------------------------------------------------------------------------------------- | ---------------------------------- |
| ![underscore](https://github.com/code-chris/lodash-loader/blob/master/docs/img/underscore.jpg)                 | Underscore 1.8.3 (51,7k)           |
| ![lodash-unoptimized](https://github.com/code-chris/lodash-loader/blob/master/docs/img/lodash-unoptimized.jpg) | Lodash 4.17.4 (full) (526,9k)      |
| ![lodash-optimized](https://github.com/code-chris/lodash-loader/blob/master/docs/img/lodash-optimized.jpg)     | Lodash 4.17.4 (optimized) (140,8k) |


[License](https://github.com/code-chris/lodash-loader/blob/master/LICENSE)
------
