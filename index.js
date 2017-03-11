var path = require("path");
var fs = require("fs");
var _ = require("lodash");

module.exports = function (source) {
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

    var replaced = source;
    var imports = "";
    output.forEach(function (expr) {
        var name = expr.substr(2);
        imports += "import _" + name + " from \"lodash/" + name + "\";\n";
        replaced = replaced.replace("_." + name, "_" + name);
    });

    return replaced.replace(importReg, imports.substr(0, imports.length - 1));
};

module.exports.createLodashAliases = function () {
  var aliases = {};

  var lodashDir = path.dirname(require.resolve("lodash"));

  var files = _.filter(fs.readdirSync(lodashDir), function (p) { p.endsWith(".js") });
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
