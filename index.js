var path = require("path");
var fs = require("fs");
var _ = require("lodash");
var utils = require('loader-utils');

function getSpecificImport(resourcePath, lodashModule, importMode) {
    var es2015Import = "import * as _" + lodashModule + " from \"lodash/" + lodashModule + "\";\n";
    var es2015DefaultImport = "import _" + lodashModule + " from \"lodash/" + lodashModule + "\";\n";
    var commonJsImport = "import _" + lodashModule + " = require('lodash/" + lodashModule + "');\n";

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

    var replaced = source;

    if (imports.length && source.match(importReg)) {
        replaced = replaced
            .replace(importReg, imports.substr(0, imports.length - 1))
            .replace(usageReg, "$1_$2");
    }

    this.callback(null, replaced, map);
};

module.exports.createLodashAliases = function () {
    var aliases = {};

    var lodashDir = path.dirname(require.resolve("lodash"));

    var files = _.filter(fs.readdirSync(lodashDir), function (p) { return p.endsWith(".js") });
    _.each(files, function (file) {
        var n = path.basename(file, path.extname(file));
        if (!file.startsWith("_")) {
            // public file
            aliases["lodash/" + n] = path.resolve(lodashDir + "/" + file);
            aliases["lodash." + n] = path.resolve(lodashDir + "/" + file);
        }
    });

    return aliases;
};
