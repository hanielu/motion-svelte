<script lang="ts">
	import Lightbox from "./lightbox.svelte";
	import { motion, AnimatePresence, createLayoutMotion } from "motion-sv";

	const images = [
		{ id: "1", r2Url: "https://picsum.photos/id/10/800/600" },
		{ id: "2", r2Url: "https://picsum.photos/id/20/800/600" },
	];

	let selectedIndex = $state<number | null>(null);
	const layout = createLayoutMotion(motion);
</script>

<div class="columns-2 gap-2 p-4">
	{#each images as image, index (image.id)}
		<layout.button
			layoutId={index.toString()}
			onclick={layout.update.with(() => (selectedIndex = index))}
			transition={{
				layout: { type: "spring", stiffness: 300, damping: 30 },
			}}
		>
			<img src={image.r2Url} alt="" class="w-full" />
		</layout.button>
	{/each}
</div>

<AnimatePresence>
	{#if selectedIndex !== null}
		<Lightbox {images} bind:selectedIndex {layout} onClose={() => (selectedIndex = null)} />
	{/if}
</AnimatePresence>
