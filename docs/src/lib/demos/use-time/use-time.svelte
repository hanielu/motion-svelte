<script lang="ts">
	import { motion, useTime, useTransform } from "motion-sv";

	const time = useTime();
	const rotate = useTransform(
		time,
		[0, 4000], // time in milliseconds
		[0, 360], // rotation in degrees
		{ clamp: false }
	);
	const tinyRotate = useTransform(() => rotate.get() * 2); // 2x speed
	const smallRotate = useTransform(() => rotate.get() * 1.5); // 1.5x speed
</script>

<div class="example">
	<div class="layer" style:filter="blur(4px)">
		<div class="box-container tiny">
			{#each { length: 16 }, i (i)}
				<motion.div class="tiny-box" style={{ rotate: tinyRotate }} />
			{/each}
		</div>
	</div>
	<div class="layer" style:filter="blur(2px)">
		<div class="box-container small">
			{#each { length: 4 }, i (i)}
				<motion.div class="small-box" style={{ rotate: smallRotate }} />
			{/each}
		</div>
	</div>
	<div class="layer">
		<div class="box-container">
			<motion.div class="box" style={{ rotate }} />
		</div>
	</div>
</div>

<style>
	.example {
		position: relative;
		width: 100%;
		height: 400px;
	}

	.layer {
		position: absolute;
		inset: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 20px;
	}

	.box-container {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		align-items: center;
		gap: 50px;
	}

	.box-container.tiny {
		width: 500px;
		gap: 80px;
	}

	.box-container.small {
		width: 300px;
	}

	.example :global(.tiny-box) {
		width: 40px;
		height: 40px;
		border-radius: 5px;
		background-color: #9911ff;
	}

	.example :global(.small-box) {
		width: 80px;
		height: 80px;
		border-radius: 5px;
		background-color: #dd00ee;
	}

	.example :global(.box) {
		width: 100px;
		height: 100px;
		border-radius: 5px;
		background-color: #ff0088;
	}
</style>
