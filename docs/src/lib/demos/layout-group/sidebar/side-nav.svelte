<script lang="ts">
	import { createLayoutMotion } from "motion-sv";

	const links = ["Home", "Search", "Library"];

	let isOpen = $state(false);
	const layout = createLayoutMotion(() => isOpen);

	const toggle = () => (isOpen = !isOpen);
</script>

<layout.nav class={["side-nav", { open: isOpen }]} style={{ borderRadius: 16 }}>
	<layout.button class="toggle" layout="position" onclick={toggle} aria-expanded={isOpen}>
		{isOpen ? "Close" : "Menu"}
	</layout.button>
	{#each links as link (link)}
		<layout.div class="link" layout="position">
			<span class="icon"></span>
			{#if isOpen}{link}{/if}
		</layout.div>
	{/each}
</layout.nav>
