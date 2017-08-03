import * as _ from "lodash";
import _filter from 'lodash/filter';

export class Main {

    public doIt() {
        _.each([], (e) => {
            console.log(e);
        });

        _.isArray({});

        _filter([], { name: "joe" });
    }
}