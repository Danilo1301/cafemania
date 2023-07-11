import { Debug } from "../debug/debug";

export class BaseObject {
    public log(...args) {
        const a: any = [this.constructor.name].concat(args);
        Debug.log.apply(Debug, a);
    }
}