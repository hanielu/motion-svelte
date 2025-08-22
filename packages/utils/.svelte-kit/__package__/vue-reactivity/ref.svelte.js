import { isObject } from '../is';
export const RefSymbol = Symbol('ref');
export function ref(value) {
    let _state = $state(value);
    return {
        [RefSymbol]: true,
        get value() {
            return _state;
        },
        set value(v) {
            _state = v;
        },
    };
}
export function isRef(r) {
    return isObject(r) && RefSymbol in r;
}
