<script lang="ts">
	import { motion, useInView } from "motion-sv";

	let container = $state<HTMLElement>();
	let target = $state<HTMLElement>();

	const inView = useInView(
		() => target,
		() => ({ root: container, amount: 0.5 })
	);
</script>

<div class="frame">
	<p class="status">{inView.current ? "In view" : "Out of view"}</p>
	<div class="scroller" bind:this={container}>
		<p class="hint">Scroll down</p>
		<div class="target" bind:this={target}>
			<motion.div
				class="box"
				initial={false}
				animate={{ scale: inView.current ? 1 : 0.5, opacity: inView.current ? 1 : 0.2 }}
				transition={{ type: "spring", bounce: 0.4 }}
			/>
		</div>
	</div>
</div>

<style>
	.frame {
		position: relative;
		width: min(320px, 100%);
	}

	.status {
		position: absolute;
		top: 12px;
		right: 12px;
		z-index: 1;
		margin: 0;
		padding: 4px 10px;
		border-radius: 999px;
		background: rgb(12 220 247 / 0.2);
		font-size: 14px;
	}

	.scroller {
		height: 240px;
		border-radius: 16px;
		background: rgb(12 220 247 / 0.08);
		overflow-y: auto;
	}

	.hint {
		margin: 0;
		padding: 16px;
	}

	.target {
		width: 120px;
		height: 120px;
		margin: 320px auto 40px;
	}

	.target :global(.box) {
		width: 100%;
		height: 100%;
		border-radius: 20px;
		background: #0cdcf7;
	}
</style>
