<script lang="ts">
	import { AnimatePresence, motion } from "motion-sv";

	/**
	 * Test for AnimatePresence with Radix UI Dialog (issue #3455: exit animations break when
	 * using asChild with motion components inside AnimatePresence).
	 *
	 * Radix is React-only, so Dialog.Root/Trigger/Portal/Overlay/Content/Title/Description/Close
	 * are approximated with plain elements: the trigger toggles, the portal moves its content
	 * into <body>, and the overlay/content are the motion components Radix's asChild would render.
	 */
	let isOpen = $state(false);
	let exitComplete = $state(false);
	let exitStarted = $state(false);

	// Dialog.Portal: renders its children into document.body.
	function portal(node: HTMLElement) {
		document.body.appendChild(node);
		return () => node.remove();
	}
</script>

<div class="App" style="padding: 20px">
	<style>
		.overlay {
			position: fixed;
			inset: 0;
			background: rgba(0, 0, 0, 0.5);
		}
		.dialog {
			position: fixed;
			background: white;
			padding: 20px;
			border-radius: 8px;
			width: 300px;
		}
	</style>

	<button id="trigger" type="button" aria-haspopup="dialog" aria-expanded={isOpen} onclick={() => (isOpen = !isOpen)}>
		{isOpen ? "Close" : "Open"}
	</button>
	<AnimatePresence onExitComplete={() => (exitComplete = true)}>
		{#if isOpen}
			<div style="display: contents" {@attach portal}>
				<motion.div
					id="overlay"
					class="overlay"
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					initial={{ opacity: 0 }}
					transition={{ duration: 0.3 }}
					onAnimationStart={(definition) => {
						if (
							definition === "exit" ||
							(typeof definition === "object" && "opacity" in definition && definition.opacity === 0)
						) {
							exitStarted = true;
						}
					}}
				/>

				<motion.div
					id="dialog"
					class="dialog"
					role="dialog"
					animate={{
						left: "50%",
						bottom: "50%",
						y: "50%",
						x: "-50%",
					}}
					exit={{
						left: "50%",
						bottom: 0,
						y: "100%",
						x: "-50%",
					}}
					initial={{
						left: "50%",
						bottom: 0,
						y: "100%",
						x: "-50%",
					}}
					transition={{ duration: 0.3 }}
				>
					<h2>Dialog Title</h2>

					<p>Dialog content here</p>

					<button id="close" type="button" onclick={() => (isOpen = false)}>Close</button>
				</motion.div>
			</div>
		{/if}
	</AnimatePresence>

	<div id="status" style="margin-top: 20px">
		<div id="exit-started" data-value={exitStarted.toString()}>
			Exit started: {exitStarted.toString()}
		</div>
		<div id="exit-complete" data-value={exitComplete.toString()}>
			Exit complete: {exitComplete.toString()}
		</div>
	</div>
</div>
