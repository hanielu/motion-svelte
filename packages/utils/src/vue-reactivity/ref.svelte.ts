import { isObject } from '../is';

export const RefSymbol = Symbol('ref');

export type Ref<T = any, S = T> = {
	[RefSymbol]: true;
	get value(): T;
	set value(_: S);
};

export function ref<T>(value: T): Ref<T> {
	let _state = $state(value);

	return {
		[RefSymbol]: true,
		get value() {
			return _state;
		},
		set value(v: T) {
			_state = v;
		},
	};
}

export function isRef<T>(r: Ref<T> | unknown): r is Ref<T>;
export function isRef(r: unknown): r is Ref {
	return isObject(r) && RefSymbol in r;
}
