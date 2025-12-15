import type { FnGetter } from "@/types/common.js";

export function useForceUpdate(): [() => void, FnGetter<number>] {
	let key = $state(0);
	function forceUpdate() {
		key++;
	}

	return [forceUpdate, () => key];
}
