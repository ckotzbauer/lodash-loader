import * as _ from "lodash";

export class Main {

    public doIt(): void {
        _.each([], (e: any): void => {
            console.log(e);
        });

        _.isArray({});

        _.filter([], { name: "joe" });
    }
}
