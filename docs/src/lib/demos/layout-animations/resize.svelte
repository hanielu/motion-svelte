<script lang="ts">
	import { createLayoutMotion } from "motion-sv";

	let isOpen = $state(false);
	const layout = createLayoutMotion(() => isOpen);

	const toggle = () => (isOpen = !isOpen);
</script>

<div class="resize">
	<layout.div
		class={["card", { open: isOpen }]}
		style={{ borderRadius: 20 }}
		transition={{ type: "spring", visualDuration: 0.35, bounce: 0.2 }}
		onclick={toggle}
	>
		<layout.span class="label" layout="position">{isOpen ? "Click to close" : "Open"}</layout.span>
	</layout.div>
</div>

<style>
	.resize :global(.card) {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100px;
		height: 100px;
		background: #ff3e00;
		color: white;
		font-weight: 600;
		cursor: pointer;
	}

	.resize :global(.card.open) {
		width: 320px;
		height: 180px;
	}
</style>
