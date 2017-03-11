var fs = require("fs");
var should = require("should/as-function");
var loader = require("../");

describe("It should work!", function () {
    it("success", function () {
        var src = fs.readFileSync("test/test-src.txt", "utf8");
        var dest = fs.readFileSync("test/test-dest.txt", "utf8");

        src = src.replace("\r", "\n");
        dest = dest.replace("\r", "\n");

        should(loader.call({}, src)).be.eql(dest);
    });
});
