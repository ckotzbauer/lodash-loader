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

    var importReg = /import.*from.*lodash.*/g;
    var usageReg = /_\.[a-zA-Z]*/g;

    var matches = [];
    var output = [];
    while (matches = usageReg.exec(source)) {
        if (output.indexOf(matches[0]) === -1) {
            output.push(matches[0]);
        }
    }

    var resource = this.resourcePath;
    var replaced = source;
    var imports = "";
    _.each(output, function (expr) {
        var name = expr.substr(2);
        imports += getSpecificImport(resource, name, query.importMode);
        replaced = replaced.replace(new RegExp("_." + name, "g"), "_" + name);
    });

    this.callback(null, replaced.replace(importReg, imports.substr(0, imports.length - 1)), map);
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
        }

        aliases["./" + n] = path.resolve(lodashDir + "/" + file);
    });

    return aliases;
};
