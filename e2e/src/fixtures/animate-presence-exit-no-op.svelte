<script lang="ts">
	import { AnimatePresence, motion } from "motion-sv";

	/**
	 * Reproduction for #3078: AnimatePresence won't remove modal if a
	 * child animation has a defined exit matching current values.
	 *
	 * Uses a portal like the original reproduction. The modal's dialog
	 * uses variants for enter/exit. Children use variants for enter and
	 * exit={{ opacity: 1, scale: 1 }} (same as their animated state).
	 */

	let show = $state(false);
	const onDone = () => (show = false);

	// React's createPortal(…, document.body): a layout-neutral wrapper moved into <body>.
	function portal(node: HTMLElement) {
		document.body.appendChild(node);
		return () => node.remove();
	}
</script>

<div style="padding: 20px">
	<button id="toggle" onclick={() => (show = true)}>Add Challenge</button>
	<AnimatePresence mode="wait">
		{#if show}
			<div style="display: contents" {@attach portal}>
				<div
					id="backdrop"
					onclick={onDone}
					role="presentation"
					style="position: fixed; inset: 0; background: rgba(0,0,0,0.5)"
				></div>
				<motion.dialog
					id="modal"
					variants={{
						hidden: { opacity: 0, y: -30 },
						visible: { opacity: 1, y: 0 },
					}}
					initial="hidden"
					animate="visible"
					exit="hidden"
					transition={{ type: "tween", duration: 0.3 }}
					open
					style={{
						position: "fixed",
						top: "50%",
						left: "50%",
						transform: "translate(-50%, -50%)",
					}}
				>
					<h2>New Challenge</h2>
					<motion.ul
						variants={{
							visible: {
								transition: { staggerChildren: 0.05 },
							},
						}}
						style={{ listStyle: "none", display: "flex", gap: 10 }}
					>
						{#each [0, 1] as i (i)}
							<motion.li
								data-testid={`item-${i}`}
								variants={{
									hidden: { opacity: 0, scale: 0.5 },
									visible: { opacity: 1, scale: 1 },
								}}
								exit={{ opacity: 1, scale: 1 }}
								transition={{ type: "spring", stiffness: 260 }}
								style={{
									width: 50,
									height: 50,
									background: "coral",
								}}
							/>
						{/each}
					</motion.ul>
					<button id="cancel" onclick={onDone}>Cancel</button>
				</motion.dialog>
			</div>
		{/if}
	</AnimatePresence>
</div>
