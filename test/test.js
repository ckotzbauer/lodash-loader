var fs = require("fs");
var should = require("should/as-function");
var loader = require("../");

function simpleTest(name, ext) {
    ext = ext || 'js';
    var src = fs.readFileSync("test/fixtures/"+name+".src."+ext, "utf8");
    var dest = fs.readFileSync("test/fixtures/"+name+".dest."+ext, "utf8");

    src = src.replace("\n\r", "\n");
    dest = dest.replace("\n\r", "\n");

    var callback = function (err, result) {
        should(result).be.eql(dest);
    };

    loader.call({ resourcePath: name+'.'+ext, callback: callback }, src);
}

describe("Correct cherry-picking of lodash functions", function () {
    var regex = /^([a-zA-Z0-9_\-]+)\.src\.(js|ts)$/
    fs.readdirSync('test/fixtures').forEach(file => {
        var match = file.match(regex);
        if (match) {
            var name = match[1];
            var ext = match[2];
            it(name, function() {
                simpleTest(name, ext)
            });
        }
    });
});
