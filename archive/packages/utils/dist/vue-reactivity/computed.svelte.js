import { RefSymbol } from "./ref.svelte";
const WritableComputedSymbol = Symbol("is-writable-computed");
export function computed(arg) {
    let prev;
    const get = typeof arg === "function" ? arg : arg.get;
    const set = typeof arg === "function" ? undefined : arg.set;
    const derived = $derived.by(() => {
        const next = get(prev);
        prev = next;
        return next;
    });
    if (set) {
        return {
            [RefSymbol]: true,
            [WritableComputedSymbol]: true,
            get value() {
                return derived;
            },
            set value(newValue) {
                set(newValue);
                prev = newValue;
            },
        };
    }
    return {
        [RefSymbol]: true,
        get value() {
            return derived;
        },
        // TBD If this is something desirable
        // get value() {
        // 	const next = get(prev);
        // 	prev = next;
        // 	return next;
        // },
    };
}
