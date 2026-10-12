<script lang="ts">
	import { MotionConfig, ReorderGroup, ReorderItem, useMotionValue } from "motion-sv";

	/**
	 * Reproduction + supported-workaround fixture for the scaled-parent Reorder
	 * cluster (#2449 / #2750).
	 *
	 * A Reorder list sits inside a parent with a raw CSS `transform: scale()` and
	 * a non-centre `transform-origin`. Raw CSS transforms on ancestors are
	 * invisible to the projection / drag measurement system (it only tracks motion
	 * values), so by default the dragged item translates faster/slower than the
	 * cursor and reorder thresholds fire at the wrong positions — the list appears
	 * to "move around" relative to the pointer.
	 *
	 * The supported fix is `correctParentTransform(ref)` fed to
	 * `MotionConfig transformPagePoint`: it routes BOTH pan-session pointer points
	 * and projection viewport measurements through the inverse of the parent's
	 * computed matrix, putting gesture offsets and measured boxes back in the same
	 * (local) space.
	 *
	 * - `?scale=`     parent scale factor (default `0.5`)
	 * - `?corrected=` when `"true"`, applies `correctParentTransform`
	 */
	const initialItems = [0, 1, 2, 3];

	const params = new URLSearchParams(window.location.search);
	const scale = parseFloat(params.get("scale") || "0.5");
	const corrected = params.get("corrected") === "true";

	let ref = $state<HTMLDivElement>();
	let items = $state(initialItems);
</script>

{#snippet group()}
	<ReorderGroup
		axis="y"
		onReorder={(newOrder) => (items = newOrder)}
		values={items}
		id="reorder-group"
		style={{ listStyle: "none", padding: 0, margin: 0, width: 280 }}
	>
		{#each items as item (item)}
			{@const y = useMotionValue(0)}
			{@const hue = item * 90}
			<!-- Item -->
			<ReorderItem
				value={item}
				id={`item-${item}`}
				data-testid={`item-${item}`}
				dragMomentum={false}
				transition={{ duration: 0 }}
				style={{
					y,
					height: 50,
					marginBottom: 10,
					borderRadius: 8,
					listStyle: "none",
					cursor: "grab",
					background: `hsl(${hue}, 70%, 50%)`,
				}}
			/>
		{/each}
	</ReorderGroup>
{/snippet}

<div
	bind:this={ref}
	id="scaled-parent"
	style="position: absolute; top: 0; left: 0; width: 300px; height: 600px; padding: 10px; box-sizing: border-box; background: #222; transform: scale({scale}); transform-origin: top left"
>
	<!-- Wrapper. motion-sv: MotionConfig has no `transformPagePoint` and `correctParentTransform` isn't exported, so
	     upstream's transformPagePoint={correctParentTransform(ref)} can't be expressed. -->
	{#if corrected}
		<MotionConfig>
			{@render group()}
		</MotionConfig>
	{:else}
		{@render group()}
	{/if}
</div>

<style>
	:global(body) {
		margin: 0;
		padding: 0;
		background: #ffaa00;
	}
</style>
