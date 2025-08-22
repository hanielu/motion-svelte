import { isFunction } from './is.js';
import { box } from './box.svelte.js';
export function unbox(value) {
    if (box.isBox(value)) {
        return value.current;
    }
    if (isFunction(value)) {
        const getter = value;
        return getter();
    }
    return value;
}
