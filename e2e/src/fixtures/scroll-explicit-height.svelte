<script lang="ts">
	import { motion, useScroll, useTransform } from "motion-sv";

	let scrollContainerRef = $state<HTMLDivElement>();
	const refs = $state<HTMLElement[]>([]);

	// BubbleParallax, one per item (Svelte can't call hooks per {#each} iteration, so they're set up here).
	const items = Array.from({ length: 10 }, (_, index) => {
		const { scrollYProgress } = useScroll({
			get target() {
				return refs[index];
			},
			get container() {
				return scrollContainerRef;
			},
			offset: ["start end", "end start"],
		});

		const opacity = useTransform(scrollYProgress, (progressValue) => {
			const axis = 2 * progressValue - 1;
			return -Math.abs(axis) + 1;
		});

		return { id: "item-" + index, index, opacity };
	});
</script>

<div style="display: flex; justify-content: center; align-items: center; height: 100vh; background-color: #E0E0E0">
	<div
		id="scroll-container"
		bind:this={scrollContainerRef}
		style="width: 100%; height: 80vh; overflow-y: scroll; background-color: #1A237E; padding: 20px; box-sizing: border-box; border-radius: 8px"
	>
		<div style="color: white; text-align: center; font-size: 2rem; padding: 40px 0">Parallax Area</div>

		{#each items as { id, index, opacity } (index)}
			<motion.div
				{id}
				bind:ref={refs[index]}
				style={{
					opacity,
					marginBottom: "50px",
				}}
			>
				<div
					style="display: flex; align-items: center; justify-content: center; width: 100%; height: 300px; background-color: #BBDEFB; font-size: 5rem; color: #1A237E; border-radius: 10px"
				>
					{index + 1}
				</div>
			</motion.div>
		{/each}
	</div>
</div>
