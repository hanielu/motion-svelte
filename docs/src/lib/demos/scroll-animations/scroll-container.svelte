<script lang="ts">
	import { animate, motion, useMotionValue, useMotionValueEvent, useScroll, type MotionValue } from "motion-sv";

	const left = `0%`;
	const right = `100%`;
	const leftInset = `20%`;
	const rightInset = `80%`;
	const transparent = `#0000`;
	const opaque = `#000`;

	const colors = ["#ff0088", "#dd00ee", "#9911ff", "#0d63f8", "#0cdcf7", "#4ff0b7"];

	let list = $state<HTMLElement | null>(null);

	const { scrollXProgress } = useScroll(() => ({ container: list }));
	const maskImage = useScrollOverflowMask(scrollXProgress);

	function useScrollOverflowMask(scrollXProgress: MotionValue<number>) {
		const maskImage = useMotionValue(
			`linear-gradient(90deg, ${opaque}, ${opaque} ${left}, ${opaque} ${rightInset}, ${transparent})`
		);

		useMotionValueEvent(scrollXProgress, "change", (value) => {
			if (value === 0) {
				animate(
					maskImage,
					`linear-gradient(90deg, ${opaque}, ${opaque} ${left}, ${opaque} ${rightInset}, ${transparent})`
				);
			} else if (value === 1) {
				animate(
					maskImage,
					`linear-gradient(90deg, ${transparent}, ${opaque} ${leftInset}, ${opaque} ${right}, ${opaque})`
				);
			} else if (scrollXProgress.getPrevious() === 0 || scrollXProgress.getPrevious() === 1) {
				animate(
					maskImage,
					`linear-gradient(90deg, ${transparent}, ${opaque} ${leftInset}, ${opaque} ${rightInset}, ${transparent})`
				);
			}
		});

		return maskImage;
	}
</script>

<div class="example">
	<svg class="progress" width="80" height="80" viewBox="0 0 100 100">
		<circle cx="50" cy="50" r="30" pathLength="1" class="bg" />
		<motion.circle cx="50" cy="50" r="30" class="indicator" style={{ pathLength: scrollXProgress }} />
	</svg>
	<motion.ul bind:ref={list} class="list" style={{ maskImage }}>
		{#each colors as color (color)}
			<li style:background={color}></li>
		{/each}
	</motion.ul>
</div>

<style>
	.example {
		position: relative;
		width: 100%;
		max-width: 400px;
	}

	.progress {
		position: absolute;
		top: -65px;
		left: -15px;
		transform: rotate(-90deg);
	}

	.progress :global(circle) {
		stroke-dashoffset: 0;
		stroke-width: 10%;
		fill: none;
	}

	.bg {
		stroke: rgb(127 127 127 / 0.12);
	}

	.progress :global(.indicator) {
		stroke: #ff0088;
	}

	.example :global(.list) {
		display: flex;
		gap: 20px;
		height: 220px;
		margin: 0 auto;
		padding: 20px 0;
		overflow-x: scroll;
		list-style: none;
	}

	li {
		flex: 0 0 200px;
	}

	.example :global(.list::-webkit-scrollbar) {
		width: 5px;
		height: 5px;
		border-radius: 1ex;
		background: rgb(127 127 127 / 0.2);
	}

	.example :global(.list::-webkit-scrollbar-thumb) {
		border-radius: 1ex;
		background: #ff0088;
	}

	.example :global(.list::-webkit-scrollbar-corner) {
		background: rgb(127 127 127 / 0.2);
	}
</style>
