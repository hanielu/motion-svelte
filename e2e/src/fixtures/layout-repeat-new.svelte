<script lang="ts">
	import { createLayoutMotion } from "motion-sv";

	function range(num: number) {
		return Array.from(Array(num).keys());
	}

	const layout = createLayoutMotion();

	const sharedMotionProps = {
		layout: true,
		style: { background: "red", width: "100%", height: "100px" },
		transition: {
			duration: 0.25,
			delay: 0.3,
			ease: [0.2, 0.0, 0.83, 0.83],
			layout: { duration: 0.3, ease: [0.2, 0.0, 0.83, 0.83] },
		},
	};

	let count = $state(0);
</script>

<div style="height: 50px">
	<button id="add" onclick={layout.update.with(() => (count += 1))}>Add item</button>
	<button id="reset" onclick={layout.update.with(() => (count = 0))}>Reset</button>
</div>
<div
	style="display: grid; grid-template-columns: repeat(auto-fill, minmax(127px, 1fr)); grid-gap: 10px; min-height: 100px; width: 500px"
>
	{#each range(count).reverse() as i (i)}
		<layout.div id={`box-${i}`} {...sharedMotionProps}>
			{i}
		</layout.div>
	{/each}
</div>
