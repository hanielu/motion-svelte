<script lang="ts">
	import { animate } from "motion-sv";
	import { onMount } from "svelte";

	/**
	 * An example of animating between different value types
	 */
	let ref = $state<HTMLDivElement>();

	onMount(() => {
		animate(ref!, { width: [0, 100], rotate: [0, 45] }, { duration: 0.1, ease: "linear" }).then(() => {
			animate(
				ref!,
				{ width: "50%" },
				{
					duration: 0.2,
					ease: "linear",
					onUpdate: (width: any) => {
						if (width > 200) {
							ref!.textContent = "Fail";
						}
					},
				}
			);
		});
	});
</script>

<div bind:this={ref} style="width: 100px; height: 100px; background: #ffaa00" id="box">Success</div>
