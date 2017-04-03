var path = require("path");
var fs = require("fs");
var _ = require("lodash");

function getSpecificImport(resourcePath, lodashModule) {
    if (resourcePath.endsWith(".js")) {
        // JavaScript
        return "import * as _" + lodashModule + " from \"lodash/" + lodashModule + "\";\n";
    } else {
        // TypeScript
        return "import _" + lodashModule + " = require('lodash/" + lodashModule + "');\n";
    }
}

module.exports = function (source, map) {
    if (this.cacheable) {
        this.cacheable();
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
        imports += getSpecificImport(resource, name);
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
