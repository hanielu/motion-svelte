import type { Ref } from 'runed';
import { ref } from 'runed';

export function useForceUpdate(): [() => void, Ref<number>] {
	const key = ref(0);
	function forceUpdate() {
		key.value++;
	}

	return [forceUpdate, key];
}
