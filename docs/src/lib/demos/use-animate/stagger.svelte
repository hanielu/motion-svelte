<script lang="ts">
	import { stagger, useAnimate } from "motion-sv";
	import { untrack } from "svelte";

	const [scope, animate] = useAnimate<HTMLUListElement>();

	// Runs once, after the list mounts. `untrack` keeps the effect from re-running when state `animate` reads changes.
	$effect(() => {
		untrack(() => animate("li", { opacity: 1, x: 0 }, { delay: stagger(0.1) }));
	});
</script>

<ul bind:this={scope.current}>
	<li>Scoped</li>
	<li>Selectors</li>
	<li>Stagger</li>
	<li>Cleanup</li>
</ul>

<style>
	ul {
		display: flex;
		flex-direction: column;
		gap: 8px;
		width: 220px;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	li {
		padding: 10px 16px;
		border-radius: 10px;
		background: rgb(255 62 0 / 0.15);
		opacity: 0;
		transform: translateX(-40px);
	}
</style>
