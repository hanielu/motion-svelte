<script lang="ts">
	// Upstream imports `animate` from "framer-motion/dom/mini", which is `animateMini`.
	import { animateMini as animate } from "motion-sv";
	import { onMount } from "svelte";

	let ref = $state<HTMLDivElement>();

	onMount(() => {
		if (!ref) return;

		try {
			CSS.registerProperty({
				name: "--x",
				syntax: "<length>",
				inherits: false,
				initialValue: "0px",
			});
		} catch (e) {
			// console.error(e)
		}

		const animation = animate(ref, { "--x": ["0px", "500px"] }, { duration: 0.1 });

		return () => {
			animation.cancel();
		};
	});
</script>

<div
	id="box"
	bind:this={ref}
	style="width: 100px; height: 100px; background-color: #fff; left: var(--x); position: relative"
>
	content
</div>
