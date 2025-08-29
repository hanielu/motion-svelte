<script lang="ts">
	import { useMotionValue, ReorderItem } from "motion-sve";
	import { useRaisedShadow } from "./use-raised-shadow.svelte";

	let { item = "" } = $props();

	const y = useMotionValue(0);
	const boxShadow = useRaisedShadow(y);

	let dep: any = $state.raw(null);

	$effect(() => {
		const unsub1 = y.on("change", (latest) => {
			dep = latest;
		});
		const unsub2 = boxShadow.on("change", (latest) => {
			dep = latest;
		});

		return () => {
			unsub1();
			unsub2();
		};
	});
</script>

<ReorderItem
	id={item}
	value={item}
	style={{ boxShadow, y }}
	layoutDependency={dep}
	class="rounded-lg select-none list-none mb-2 cursor-grab w-full py-4 px-6 bg-purple-500 justify-between flex flex-shrink-0"
>
	<span>{item}</span>
</ReorderItem>
