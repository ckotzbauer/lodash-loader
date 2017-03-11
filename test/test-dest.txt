import _each = require('lodash/each');
import _isArray = require('lodash/isArray');
import _filter = require('lodash/filter');

export class Main {

    public doIt(): void {
        _each([], (e: any): void => {
            console.log(e);
        });

        _isArray({});

        _filter([], { name: "joe" });
    }
}
