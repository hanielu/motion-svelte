<script lang="ts">
	import { useMotionValue, ReorderItem } from "motion-sv";
	import { useRaisedShadow } from "./use-raised-shadow.svelte";

	let { item }: { item: string } = $props();

	const y = useMotionValue(0);
	const boxShadow = useRaisedShadow(y);
</script>

<ReorderItem
	id={item}
	value={item}
	style={{ boxShadow, y }}
	class="rounded-lg select-none list-none mb-2 cursor-grab w-full py-4 px-6 bg-purple-500 justify-between flex flex-shrink-0"
>
	<span>{item}</span>
</ReorderItem>
