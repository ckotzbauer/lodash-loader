# Lodash Loader

[![Greenkeeper badge](https://badges.greenkeeper.io/code-chris/lodash-loader.svg)](https://greenkeeper.io/)

[![Build Status](https://travis-ci.org/code-chris/lodash-loader.svg?branch=master)](https://travis-ci.org/code-chris/lodash-loader)
[![NPM](https://img.shields.io/npm/v/lodash-loader.svg)](https://www.npmjs.com/package/lodash-loader)


This Webpack loader cherry-picks Lodash functions and require them explicitly to reduce the webpack bundle size.


## Installation

```
npm install lodash-loader
```


## Usage

Add this to your webpack.config.js to apply the logic to your .ts files for example.

### Webpack 1

```js
var createLodashAliases = require('lodash-loader').createLodashAliases;

module.exports = {
  ...
  module: {
    loaders: [
	    { test: /\.ts$/, loader: "ts-loader!lodash-loader" }
	  ]
  },
  resolve: {
    alias: createLodashAliases()
  }
  ...
};
```

### Webpack 2

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


## Requirements

Currently this loader only supports ES2015- and TypeScript-Imports. In each file with a Lodash-Reference you have to import it similar to this
```js
import _ from "lodash";
```
or this:
```js
import * as _ from "lodash";
```

You should not use Lodash without an import and reference the `_` from browsers `window` variable.


[License](https://github.com/code-chris/lodash-loader/blob/master/LICENSE)
------