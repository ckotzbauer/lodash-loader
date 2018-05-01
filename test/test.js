const fs = require("fs");
const should = require("should/as-function");
const loader = require("../");

const simpleTest = (name, ext) => {
    ext = ext || 'js';
    let src = fs.readFileSync("test/fixtures/"+name+".src."+ext, "utf8");
    let dest = fs.readFileSync("test/fixtures/"+name+".dest."+ext, "utf8");

    src = src.replace("\n\r", "\n");
    dest = dest.replace("\n\r", "\n");

    const callback = (err, result) => {
        should(result).be.eql(dest);
    };

    loader.call({ resourcePath: name+'.'+ext, callback: callback }, src);
}

describe("Correct cherry-picking of lodash functions", () => {
    const regex = /^([a-zA-Z0-9_\-]+)\.src\.(js|ts)$/
    fs.readdirSync('test/fixtures').forEach(file => {
        var match = file.match(regex);
        if (match) {
            const name = match[1];
            const ext = match[2];
            it(name, function() {
                simpleTest(name, ext)
            });
        }
    });
});
