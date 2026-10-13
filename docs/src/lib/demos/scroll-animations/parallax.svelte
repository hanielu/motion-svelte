<script lang="ts">
	import { motion, useScroll, useSpring, useTransform, type MotionValue } from "motion-sv";

	function useParallax(value: MotionValue<number>, distance: number) {
		return useTransform(value, [0, 1], [-distance, distance]);
	}

	// Stand-ins for the photos
	const images = [
		{ id: 1, background: "linear-gradient(160deg, #ff0088, #dd00ee)" },
		{ id: 2, background: "linear-gradient(160deg, #dd00ee, #9911ff)" },
		{ id: 3, background: "linear-gradient(160deg, #9911ff, #1e75f7)" },
		{ id: 4, background: "linear-gradient(160deg, #1e75f7, #0cdcf7)" },
		{ id: 5, background: "linear-gradient(160deg, #0cdcf7, #8df0cc)" },
	];

	// The images scroll inside this box, which stands in for the page
	let scroller = $state<HTMLElement>();
	const targets = $state<HTMLElement[]>([]);

	// Each image moves its heading with its own scroll progress through the box
	const ys = images.map((_, i) => {
		const { scrollYProgress } = useScroll({
			get container() {
				return scroller;
			},
			get target() {
				return targets[i];
			},
		});
		return useParallax(scrollYProgress, 300);
	});

	const { scrollYProgress } = useScroll({
		get container() {
			return scroller;
		},
	});
	const progress = useSpring(scrollYProgress, {
		stiffness: 100,
		damping: 30,
		restDelta: 0.001,
	});
</script>

<div class="example">
	<div class="scroller" bind:this={scroller}>
		{#each images as { id, background }, i (id)}
			<section class="img-container">
				<div bind:this={targets[i]} style:background></div>
				<motion.h2
					initial={{ visibility: "hidden" }}
					animate={{ visibility: "visible" }}
					style={{ y: ys[i] }}
				>
					{`#00${id}`}
				</motion.h2>
			</section>
		{/each}
	</div>
	<motion.div class="progress" style={{ scaleX: progress }} />
</div>

<style>
	.example {
		position: relative;
		width: 100%;
		height: 560px;
		overflow: hidden;
		border-radius: 12px;
		background: #0b1012;
	}

	.scroller {
		/* A positioned container lets Motion measure where the images sit inside it */
		position: relative;
		height: 100%;
		overflow-y: auto;
		scroll-snap-type: y mandatory;
	}

	.img-container {
		position: relative;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100%;
		scroll-snap-align: start;
	}

	.img-container > div {
		width: 300px;
		height: 400px;
		margin: 20px;
		overflow: hidden;
	}

	@media (max-width: 500px) {
		.img-container > div {
			width: 150px;
			height: 200px;
		}
	}

	.img-container :global(h2) {
		position: absolute;
		top: calc(50% - 25px);
		left: calc(50% + 120px);
		display: inline-block;
		margin: 0;
		color: #4ff0b7;
		font-family: ui-monospace, "SF Mono", Menlo, monospace;
		font-size: 50px;
		font-weight: 700;
		letter-spacing: -3px;
		line-height: 1.2;
	}

	.example :global(.progress) {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 50px;
		height: 5px;
		background: #4ff0b7;
		transform: scaleX(0);
	}
</style>
