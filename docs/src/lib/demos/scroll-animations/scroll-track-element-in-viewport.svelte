<script lang="ts">
	import { motion, useScroll } from "motion-sv";

	// The items scroll inside this box, which stands in for the viewport
	let scroller = $state<HTMLElement>();
	const items = $state<HTMLElement[]>([]);

	// Each item tracks its own progress, from when its end meets the end of the box, until its start meets the start
	const progress = Array.from(
		{ length: 12 },
		(_, i) =>
			useScroll(() => ({
				container: scroller,
				target: items[i],
				offset: ["end end", "start start"],
			})).scrollYProgress
	);
</script>

<div class="scroller" bind:this={scroller}>
	{#each progress as scrollYProgress, i (i)}
		<section>
			<div class="item" bind:this={items[i]}>
				<figure>
					<svg width="75" height="75" viewBox="0 0 100 100">
						<circle cx="50" cy="50" r="30" pathLength="1" class="bg" />
						<motion.circle cx="50" cy="50" r="30" pathLength="1" style={{ pathLength: scrollYProgress }} />
					</svg>
				</figure>
			</div>
		</section>
	{/each}
</div>

<style>
	.scroller {
		/* A positioned container lets Motion measure where the items sit inside it */
		position: relative;
		box-sizing: border-box;
		width: 100%;
		height: 440px;
		overflow-y: auto;
		border: 1px solid rgb(127 127 127 / 0.25);
		border-radius: 12px;
	}

	section {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100%;
		max-height: 400px;
	}

	.item {
		position: relative;
		width: 200px;
		height: 250px;
		border: 2px dotted #ff0088;
	}

	figure {
		position: sticky;
		top: 0;
		width: 80px;
		height: 80px;
		margin: 0;
		padding: 0;
	}

	svg {
		stroke: #ff0088;
		stroke-dashoffset: 0;
		stroke-width: 5;
		fill: none;
		transform: translateX(-100px) rotate(-90deg);
	}

	.bg {
		opacity: 0.2;
	}
</style>
