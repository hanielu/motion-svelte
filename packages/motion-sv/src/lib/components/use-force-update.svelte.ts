export function useForceUpdate(): [() => void, () => number] {
	let key = $state(0);
	function forceUpdate() {
		key++;
	}

	return [forceUpdate, () => key];
}
