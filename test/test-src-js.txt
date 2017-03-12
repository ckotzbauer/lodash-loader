import * as _ from "lodash";

export class Main {

    public doIt() {
        _.each([], (e) => {
            console.log(e);
        });

        _.isArray({});

        _.filter([], { name: "joe" });
    }
}
