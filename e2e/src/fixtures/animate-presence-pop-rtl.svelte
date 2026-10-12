<script lang="ts">
	import { AnimatePresence, motion } from "motion-sv";

	let state = $state(true);
</script>

<div dir="rtl">
	<div
		id="container"
		style="display: flex; width: fit-content; position: relative"
		onclick={() => (state = !state)}
		role="presentation"
	>
		<AnimatePresence mode="popLayout">
			<motion.div
				id="a"
				style={{
					width: 100,
					height: 100,
					backgroundColor: "red",
				}}
			/>
			{#if state}
				<motion.div
					id="b"
					exit={{
						opacity: 0,
						transition: { duration: 10 },
					}}
					style={{
						width: 100,
						height: 100,
						backgroundColor: "green",
					}}
				/>
			{/if}
		</AnimatePresence>
	</div>
</div>
