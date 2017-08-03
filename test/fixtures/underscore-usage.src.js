import * as _ from "lodash";

export class Main {

    public doIt() {
        _.each([], (e) => {
            console.log(e);
        });

        _.isArray({});

        var a_ = {
            filter: () => null,
            filter2: () => null
        };
        a_.filter();
        a_.filter2();

        _.filter([], { name: "joe" });
    }
}
