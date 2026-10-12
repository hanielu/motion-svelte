<script lang="ts">
	import { AnimatePresence, createLayoutMotion } from "motion-sv";
	import { onMount } from "svelte";

	/**
	 * Reproduction for #3746.
	 *
	 * A bar chart with two datasets that share a key ("persist"). Switching
	 * datasets should translate the persisting bar to its new position. It should
	 * never replay its enter animation (width from 0) and never re-mount.
	 *
	 * The reported bug appears on the *second* switch, under React.StrictMode
	 * (dev/react already renders every test inside StrictMode).
	 */

	interface Datum {
		id: string;
		value: number;
		color: string;
	}

	const datasetA: Datum[] = [
		{ id: "a", value: 120, color: "blue" },
		{ id: "persist", value: 200, color: "red" },
		{ id: "b", value: 160, color: "green" },
	];

	const datasetB: Datum[] = [
		{ id: "c", value: 140, color: "purple" },
		{ id: "d", value: 180, color: "orange" },
		{ id: "persist", value: 240, color: "red" },
	];

	interface PresenceDatasetState {
		mounts: Record<string, number>;
		resetWidths: () => void;
		minWidth: () => number;
	}

	/**
	 * Sample the persisting bar every frame so the spec can assert it never
	 * collapsed towards 0, rather than catching it at a single lucky moment.
	 */
	const widths: number[] = [];

	// Upstream's `state`; renamed because `$state` would read it as a store.
	const presenceDataset: PresenceDatasetState = {
		mounts: {},
		resetWidths: () => {
			widths.length = 0;
		},
		minWidth: () => (widths.length ? Math.min(...widths) : -1),
	};

	(window as unknown as { presenceDataset: PresenceDatasetState }).presenceDataset = presenceDataset;

	/**
	 * <Bar>'s mount effect. Upstream renders in React's <StrictMode>, which runs every effect setup → cleanup →
	 * setup on mount. Svelte has no StrictMode, so replay that sequence.
	 */
	function countMount(node: HTMLElement) {
		const id = node.id.slice("bar-".length);
		for (let run = 0; run < 2; run++) presenceDataset.mounts[id] = (presenceDataset.mounts[id] || 0) + 1;
	}

	let data = $state.raw(datasetA);

	onMount(() => {
		let raf = 0;
		const sample = () => {
			const el = document.getElementById("bar-persist");
			if (el) widths.push(el.getBoundingClientRect().width);
			raf = requestAnimationFrame(sample);
		};
		raf = requestAnimationFrame(sample);
		return () => cancelAnimationFrame(raf);
	});

	// motion-sv: layout animations need createLayoutMotion + an explicit update around the state change.
	const layout = createLayoutMotion();
</script>

{#snippet Bar({ id, value, color }: Datum)}
	<layout.div
		{@attach countMount}
		id={`bar-${id}`}
		initial={{ width: 0 }}
		animate={{ width: value }}
		exit={{ width: 0 }}
		transition={{ duration: 0.4, ease: "linear" }}
		style={{
			height: 40,
			marginBottom: 8,
			background: color,
		}}
	/>
{/snippet}

<div>
	<button id="switch" onclick={layout.update.with(() => (data = data === datasetA ? datasetB : datasetA))}>
		Switch dataset
	</button>
	<div style="position: relative">
		<AnimatePresence>
			{#each data as datum (datum.id)}
				{@render Bar(datum)}
			{/each}
		</AnimatePresence>
	</div>
</div>
