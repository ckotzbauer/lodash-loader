var path = require("path");
var fs = require("fs");
var _ = require("lodash");
var utils = require('loader-utils');

function getImportMode(options) {

  var query = utils.getOptions(options);
  query = _.extend({
      importMode: "legacy"
  }, query);

  var supportedModes = ["legacy", "es2015", "es2015-default", "commonjs"];

  if (!_.includes(supportedModes, query.importMode)) {
      throw new Error("importMode not supported!");
  }

  return query.importMode;
}

function multipleImports(source, matches, rule, resourcePath, importMode) {

  var variables = [];
  var sentence = matches[1];

  while (match = /(\w+)/m.exec(sentence)) {
    variables.push(match[1]);
    sentence = sentence.replace(/(\w+)/m, '');
  }

  var imports = [];
  variables.map((singleVar, idx) => {
    var result = matches[0].replace(matches[1], singleVar);
    result = result.replace(`'lodash'`, `'lodash/${singleVar}'`);
    imports.push(result);
  });

  var result = _.reduce(imports, (sum, n) => {
    return `${sum ? sum + '\n' : ''}${n}`;
  });

  return source.replace(rule.rule, result);
}

function standardImport(source, matches, rule, resourcePath, importMode) {

  var usageReg = /([\W])_[\s]*\.[\s]*([a-zA-Z]+)/g;

  var slugs = [];
  var sentence = matches[0];

  while (match = /(["'`])/m.exec(sentence)) {
    slugs.push(match[1]);
    sentence = sentence.replace(/(["'`])/m, '');
  }

  var match;
  var names = [];
  var imports = "";
  while (match = usageReg.exec(source)) {

      var name = match[2];
      if (_.includes(names, name)) {
          continue;
      }
      names.push(name);
      imports += retrieveImportStyle(resourcePath, name, importMode, slugs);
  }

  if (imports.length && source.match(rule.rule)) {
      source = source
          .replace(rule.rule, imports.substr(0, imports.length - 1))
          .replace(usageReg, "$1_$2");
  }

  return source;
}

function retrieveImportStyle(resourcePath, lodashModule, importMode, slugs) {
    var es2015Import = `import * as _${lodashModule} from ${slugs[0]}lodash/${lodashModule}${slugs[1]};\n`;
    var es2015DefaultImport = `import _${lodashModule} from ${slugs[0]}lodash/${lodashModule}${slugs[1]};\n`;
    var commonJsImport = `import _${lodashModule} = require(${slugs[0]}lodash/${lodashModule}${slugs[1]});\n`;

    if (importMode === "es2015") {
        return es2015Import;
    } else if (importMode === "es2015-default") {
        return es2015DefaultImport;
    } else if (importMode === "commonjs") {
        return commonJsImport;
    } else {
        // Legacy and fallback
        if (resourcePath.endsWith(".js")) {
            // JavaScript
            return es2015Import;
        } else {
            // TypeScript
            return commonJsImport;
        }
    }
}

module.exports = function (source, map) {
    if (this.cacheable) {
        this.cacheable();
    }

    var importMode = getImportMode(this);

    var rules = [
      {
        rule: /(import\ +\*\ +as\ +|const\ +)(\w+).+[\("'`]lodash[\("'`].*$/m,
        processor: standardImport,
        id: 1
      },
      {
        rule: /import\ +(\{.*?\})(\ from)\ [\("'`]lodash[\("'`].*$/m,
        processor: multipleImports,
        id: 2
      }
    ];

    var tempSource = source;
    var map = [];

    // each maps
    rules.map(rule => {

      while (matches = rule.rule.exec(tempSource)) {
        map.push({
            rule: rule.rule,
            processor: rule.processor,
            data: matches
        });

        tempSource = rule.processor(tempSource, matches, rule, this.resourcePath, importMode);
      }
    });

    this.callback(null, tempSource, map);


/*

    var query = utils.getOptions(this);
    query = _.extend({
        importMode: "legacy"
    }, query);

    var supportedModes = ["legacy", "es2015", "es2015-default", "commonjs"];

    if (!_.includes(supportedModes, query.importMode)) {
        throw new Error("importMode not supported!");
    }

    var importReg = /^\s*import\s+(\*\s+as\s+)?_\s+from\s+['"]lodash['"].*$/m;
    var usageReg = /([\W])_[\s]*\.[\s]*([a-zA-Z]+)/g;

    var matches;
    var names = [];
    var imports = "";
    while (matches = usageReg.exec(source)) {

        var name = matches[2];
        if (_.includes(names, name)) {
            continue;
        }
        names.push(name);
        imports += getSpecificImport(this.resourcePath, name, query.importMode);
    }

    console.log(imports);

    var replaced = source;

    if (imports.length && source.match(importReg)) {
        replaced = replaced
            .replace(importReg, imports.substr(0, imports.length - 1))
            .replace(usageReg, "$1_$2");
    }

    this.callback(null, replaced, map);

    */

};
