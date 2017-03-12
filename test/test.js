var fs = require("fs");
var should = require("should/as-function");
var loader = require("../");

describe("Correct cherry-picking of lodash functions", function () {
    it("TypeScript files", function () {
        var src = fs.readFileSync("test/test-src-ts.txt", "utf8");
        var dest = fs.readFileSync("test/test-dest-ts.txt", "utf8");

        src = src.replace("\r", "\n");
        dest = dest.replace("\r", "\n");

        should(loader.call({ resourcePath: "test.ts" }, src)).be.eql(dest);
    });

    it("JavaScript files", function () {
        var src = fs.readFileSync("test/test-src-js.txt", "utf8");
        var dest = fs.readFileSync("test/test-dest-js.txt", "utf8");

        src = src.replace("\r", "\n");
        dest = dest.replace("\r", "\n");

        should(loader.call({ resourcePath: "test.js" }, src)).be.eql(dest);
    });
});
