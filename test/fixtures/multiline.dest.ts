import _map = require("lodash/map");
import _filter = require("lodash/filter");

export class Main {

    public doIt() {
        return _map(_filter([], () => true),
            () => true
        );
    }
}
