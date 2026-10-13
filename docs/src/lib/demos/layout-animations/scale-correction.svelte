<script lang="ts">
	import { createLayoutMotion } from "motion-sv";

	const layout = createLayoutMotion();

	let isOpen = $state(false);
	const toggleOpen = layout.update.with(() => (isOpen = !isOpen));
</script>

<div class="container">
	<layout.div data-open={isOpen} initial={{ borderRadius: "50px" }} class="parent" onclick={toggleOpen}>
		<layout.div data-open={isOpen} class="child" />
	</layout.div>
</div>

<style>
	.container {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.container :global(.parent) {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100px;
		height: 100px;
		background-color: currentColor;
	}

	.container :global(.parent[data-open="true"]) {
		width: 400px;
		height: 200px;
	}

	.container :global(.child) {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		background-color: #f107a3;
	}
</style>
