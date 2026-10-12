<script lang="ts">
	import { AnimatePresence, motion } from "motion-sv";

	const color = ["red", "green"];

	const shortPoems = ["1", "2"];

	let items = $state(
		Array.from({ length: 2 }, (_, i) => ({
			color: color[i],
			poem: shortPoems[i],
			key: i,
		}))
	);

	const transition = { duration: 0.2 };
</script>

<button
	id="move"
	style="margin-bottom: 2rem"
	onclick={() => {
		const next = [...items];
		next.push(next.shift()!);
		items = next;
	}}
>
	Move
</button>

{#each items as { color, poem, key }, i (key)}
	<!-- Upstream's <ListItem isOpen={i === 0}> -->
	<div class="item" style="background-color: {color}">
		<AnimatePresence mode="wait" initial={false}>
			{#if i === 0}
				<motion.div
					initial="hide"
					animate="show"
					exit="hide"
					variants={{
						show: {
							opacity: 1,
							transition,
						},
						hide: {
							opacity: 0,
							transition,
						},
					}}
					style={{
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						color: "white",
					}}
				>
					{poem}
				</motion.div>
			{:else}
				<div style="height: 3rem"></div>
			{/if}
		</AnimatePresence>
	</div>
{/each}
