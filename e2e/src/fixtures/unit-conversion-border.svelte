<script lang="ts">
	import { animate } from "motion-sv";
	import { onMount } from "svelte";

	/**
	 * Converting width from px to % on a content-box element with borders.
	 * The measured origin must be the used width (100px), not the bounding
	 * box width (120px including borders), or the animation starts with a jump.
	 */
	let ref = $state<HTMLDivElement>();

	onMount(() => {
		animate(
			ref!,
			{ width: "50%" },
			{
				duration: 10,
				ease: "linear",
				onUpdate: (width: any) => {
					if (typeof width === "number" && width > 110) {
						ref!.textContent = "Fail";
					}
				},
			}
		);
	});
</script>

<div style="width: 400px">
	<div
		bind:this={ref}
		id="box"
		style="width: 100px; height: 100px; box-sizing: content-box; border: 10px solid #000; background: #ffaa00"
	>
		Success
	</div>
</div>
