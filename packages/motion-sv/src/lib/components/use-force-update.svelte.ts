import type { FnGetter } from "#lib/types/common.js";

export function useForceUpdate(): [() => void, FnGetter<number>] {
	let key = $state(0);
	function forceUpdate() {
		key++;
	}

	return [forceUpdate, () => key];
}
