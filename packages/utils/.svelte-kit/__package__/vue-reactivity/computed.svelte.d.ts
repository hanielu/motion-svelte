import { type Ref } from './ref.svelte';
declare const WritableComputedSymbol: unique symbol;
export type ComputedGetter<T> = (oldValue?: T) => T;
export type ComputedSetter<T> = (newValue: T) => void;
export interface WritableComputedOptions<T, S = T> {
    get: ComputedGetter<T>;
    set: ComputedSetter<S>;
}
export type ComputedRef<T> = Ref<T> & {
    readonly value: T;
};
export type WritableComputedRef<T> = ComputedRef<T> & {
    [WritableComputedSymbol]: true;
};
export declare function computed<T>(getter: ComputedGetter<T>): ComputedRef<T>;
export declare function computed<T, S = T>(options: WritableComputedOptions<T, S>): WritableComputedRef<T>;
export {};
//# sourceMappingURL=computed.svelte.d.ts.map