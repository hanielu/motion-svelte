import { isFunction } from "./is.js";
export function extract(value, defaultValue) {
    if (isFunction(value)) {
        const getter = value;
        const gotten = getter();
        if (gotten === undefined)
            return defaultValue;
        return gotten;
    }
    if (value === undefined)
        return defaultValue;
    return value;
}
