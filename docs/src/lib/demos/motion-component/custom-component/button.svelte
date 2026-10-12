<script lang="ts">
	import type { HTMLButtonAttributes } from "svelte/elements";

	let { children, ...props }: HTMLButtonAttributes = $props();
</script>

<!-- Spreading the props passes on motion's attachment, so it can animate the <button> -->
<button {...props}>
	{@render children?.()}
</button>

<style>
	button {
		padding: 12px 28px;
		border: none;
		border-radius: 999px;
		background: #9911ff;
		color: white;
		font: inherit;
		font-weight: 600;
		cursor: pointer;
	}
</style>
