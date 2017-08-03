import * as _each from "lodash/each";
import * as _isArray from "lodash/isArray";
import * as _filter from "lodash/filter";

export class Main {

    public doIt() {
        _each([], (e) => {
            console.log(e);
        });

        _isArray({});

        _filter([], { name: "joe" });
    }
}
