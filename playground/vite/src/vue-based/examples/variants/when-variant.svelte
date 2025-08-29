<script lang="ts">
	import { motion, createLayoutMotion } from "motion-sve";

	const modalVariants = {
		visible: {
			opacity: 1,
			transition: { when: "beforeChildren", duration: 0.5 },
		},
		hidden: {
			opacity: 0,
			transition: { when: "afterChildren", duration: 0.4 },
		},
	};

	const childVariants = {
		visible: { y: 0, opacity: 1, transition: { duration: 4 } },
		hidden: { y: 20, opacity: 0, transition: { duration: 100 } },
	};

	let open = $state(false);
</script>

<button class="absolute z-20" onclick={() => (open = !open)}>Toggle</button>

{#if open}
	<motion.div
		class="backdrop"
		initial="hidden"
		animate="visible"
		exit="hidden"
		variants={modalVariants}
		style={{
			position: "fixed",
			inset: 0,
			display: "grid",
			placeItems: "center",
			background: "rgba(0,0,0,0.35)",
		}}
	>
		<motion.div
			variants={childVariants}
			style={{
				width: 360,
				padding: 24,
				borderRadius: 12,
				background: "white",
				boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
			}}
		>
			<motion.h2 variants={childVariants} style={{ margin: 0 }}>Modal Title</motion.h2>
			<motion.p variants={childVariants}>Children animate after parent on enter, then before parent on exit.</motion.p>
		</motion.div>
	</motion.div>
{/if}
