export declare const RefSymbol: unique symbol;
export type Ref<T = any, S = T> = {
    [RefSymbol]: true;
    get value(): T;
    set value(_: S);
};
export declare function ref<T>(value: T): Ref<T>;
export declare function isRef<T>(r: Ref<T> | unknown): r is Ref<T>;
//# sourceMappingURL=ref.svelte.d.ts.map