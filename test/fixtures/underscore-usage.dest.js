import * as _each from "lodash/each";
import * as _isArray from "lodash/isArray";
import * as _filter from "lodash/filter";

export class Main {

    public doIt() {
        _each([], (e) => {
            console.log(e);
        });

        _isArray({});

        var a_ = {
            filter: () => null,
            filter2: () => null
        };
        a_.filter();
        a_.filter2();

        _filter([], { name: "joe" });
    }
}
