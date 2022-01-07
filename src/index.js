const path = require("path");
const fs = require("fs");
const _ = require("lodash");
const utils = require('loader-utils');

const getSpecificImport = (resourcePath, lodashModule, importMode) => {
    const es2015Import = "import * as _" + lodashModule + " from \"lodash/" + lodashModule + "\";\n";
    const es2015DefaultImport = "import _" + lodashModule + " from \"lodash/" + lodashModule + "\";\n";
    const commonJsImport = "import _" + lodashModule + " = require('lodash/" + lodashModule + "');\n";

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

    let query = utils.getOptions(this);
    query = _.extend({
        importMode: "legacy"
    }, query);

    const supportedModes = ["legacy", "es2015", "es2015-default", "commonjs"];

    if (!_.includes(supportedModes, query.importMode)) {
        throw new Error("importMode not supported!");
    }

    const importReg = /^\s*import\s+(\*\s+as\s+)?_\s+from\s+['"]lodash['"].*$/m;
    const usageReg = /([\W])_[\s]*\.[\s]*([a-zA-Z]+)/g;

    let matches;
    const names = [];
    let imports = "";
    while (matches = usageReg.exec(source)) {
        const name = matches[2];
        if (_.includes(names, name)) {
            continue;
        }
        names.push(name);
        imports += getSpecificImport(this.resourcePath, name, query.importMode);
    }

    let replaced = source;

    if (imports.length && source.match(importReg)) {
        replaced = replaced
            .replace(importReg, imports.substr(0, imports.length - 1))
            .replace(usageReg, "$1_$2");
    }

    this.callback(null, replaced, map);
};

module.exports.createLodashAliases = () => {
    const aliases = {};

    const lodashDir = path.dirname(require.resolve("lodash"));

    const files = _.filter(fs.readdirSync(lodashDir), (p) => p.endsWith(".js"));
    _.each(files, (file) => {
        const n = path.basename(file, path.extname(file));
        if (!file.startsWith("_")) {
            // public file
            aliases["lodash/" + n] = path.resolve(lodashDir + "/" + file);
            aliases["lodash." + n] = path.resolve(lodashDir + "/" + file);
        }
    });

    return aliases;
};
