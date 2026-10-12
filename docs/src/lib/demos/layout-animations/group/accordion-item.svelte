<script lang="ts">
	import { createLayoutMotion } from "motion-sv";

	let { title, content }: { title: string; content: string } = $props();

	const layout = createLayoutMotion();

	let isOpen = $state(false);
	const toggle = layout.update.with(() => (isOpen = !isOpen));
</script>

<layout.div class="item" style={{ borderRadius: 12 }} onclick={toggle}>
	<layout.h4 layout="position">{title}</layout.h4>
	{#if isOpen}
		<p>{content}</p>
	{/if}
</layout.div>
