<script lang="ts">
	import { animate, motion } from "motion-sv";
	import { onMount } from "svelte";

	let pathRef = $state<HTMLElement | SVGElement | null>(null);

	onMount(() => {
		if (!pathRef) return;

		animate(
			pathRef,
			{
				x: 5,
				y: 5,
			},
			{ duration: 0.01 }
		);
	});

	/**
	 * ==============   Styles   ================
	 */

	const box = {
		width: 140,
		height: 140,
		backgroundColor: "white",
		borderRadius: 20,
		padding: 20,
	};

	const container = {
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		flex: 1,
		width: 500,
		height: 300,
		maxWidth: "100%",
		borderRadius: 20,
	};
</script>

<div>
	<motion.div
		style={{
			...container,
			background: "linear-gradient(180deg, #7700ff 0%, rgb(68, 0, 255) 100%)",
		}}
	>
		<motion.div class="icon-container" style={{ ...box }} drag="x" dragConstraints={{ left: 0, right: 0 }} dragElastic={0.5}>
			<svg class="progress-icon" viewBox="0 0 50 50">
				<motion.path
					bind:ref={pathRef}
					fill="none"
					stroke-width="2"
					stroke="rgb(68, 0, 255)"
					style={{
						x: 5,
						y: 5,
					}}
					d="M 0, 20 a 20, 20 0 1,0 40,0 a 20, 20 0 1,0 -40,0"
				/>
			</svg>
		</motion.div>
	</motion.div>
</div>
