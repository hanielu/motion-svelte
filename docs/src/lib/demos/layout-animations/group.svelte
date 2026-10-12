<script lang="ts">
	import { LayoutGroup } from "motion-sv";
	import AccordionItem from "./group/accordion-item.svelte";
</script>

<div class="accordion">
	<LayoutGroup>
		<AccordionItem title="What is motion-sv?" content="Motion's animation engine, ported to Svelte 5." />
		<AccordionItem title="Do I need createLayoutMotion?" content="For elements that stay mounted and move, yes." />
		<AccordionItem title="And for layoutId?" content="Swapping layoutId elements animates on its own." />
	</LayoutGroup>
</div>

<style>
	.accordion {
		display: flex;
		flex-direction: column;
		gap: 8px;
		width: 320px;
	}

	.accordion :global(.item) {
		padding: 12px 16px;
		background: rgb(255 62 0 / 0.15);
		cursor: pointer;
	}

	.accordion :global(h4) {
		margin: 0;
		font-size: 15px;
	}

	.accordion :global(p) {
		margin: 8px 0 0;
		font-size: 14px;
		opacity: 0.8;
	}
</style>
