<script lang="ts">
	import { AnimatePresence, motion, MotionConfig } from "motion-sv";

	const items = [
		{ id: "a", title: "Item A", content: "Content for item A" },
		{ id: "b", title: "Item B", content: "Content for item B" },
		{ id: "c", title: "Item C", content: "Content for item C" },
	];

	let openId = $state<string | null>("a");
</script>

<MotionConfig transition={{ type: "tween", ease: "linear", duration: 10 }}>
	<div id="accordion" style="width: 400px">
		{#each items as item (item.id)}
			<div>
				<button class="trigger" data-id={item.id} onclick={() => (openId = openId === item.id ? null : item.id)}>
					{item.title}
				</button>
				<AnimatePresence initial={false}>
					{#if openId === item.id}
						<motion.div
							class="panel"
							data-panel={item.id}
							variants={{
								open: { height: "auto", opacity: 1 },
								closed: { height: 0, opacity: 0 },
							}}
							initial="closed"
							animate="open"
							exit="closed"
							style={{ overflow: "hidden" }}
							transition={{
								type: "tween",
								ease: "linear",
								duration: 10,
							}}
						>
							<div style="padding: 20px">{item.content}</div>
						</motion.div>
					{/if}
				</AnimatePresence>
			</div>
		{/each}
	</div>
</MotionConfig>
