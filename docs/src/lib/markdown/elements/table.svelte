<script lang="ts">
	import type { HTMLTableAttributes } from "svelte/elements";

	let { children, ...rest }: HTMLTableAttributes = $props();
</script>

<div class="table">
	<table {...rest}>{@render children?.()}</table>
</div>

<style>
	.table {
		margin: 0 0 1.5rem;
		overflow-x: auto;
	}

	table {
		width: 100%;
		border-collapse: collapse;
		font-size: 0.875rem;
	}
</style>
