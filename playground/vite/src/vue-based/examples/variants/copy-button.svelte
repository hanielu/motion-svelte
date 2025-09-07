<script lang="ts">
	import { motion, AnimatePresence, type Variants } from "motion-sv";
	import CopyIcon from "~icons/mdi/content-copy";
	import CheckmarkIcon from "~icons/mdi/check";

	const variants: Variants = {
		hidden: { scale: 0.5 },
		visible: { scale: 1 },
		// hidden: { opacity: 0, scale: 0.5 },
		// visible: { opacity: 1, scale: 1 },
	};

	let copied = $state(false);

	function copy() {
		copied = true;
		setTimeout(() => {
			copied = false;
		}, 3000);
	}
</script>

<div class="wrapper">
	<button aria-label="Copy code snippet" onclick={copy}>
		<AnimatePresence mode="wait" initial={false}>
			{#key copied}
				<motion.div initial={{ scale: 0.5 }} animate={{ scale: 1 }} exit={{ scale: 0.5 }}>
					{#if copied}
						<CheckmarkIcon />
					{:else}
						<CopyIcon />
					{/if}
				</motion.div>
			{/key}
		</AnimatePresence>
	</button>
</div>

<style>
	/* .wrapper {
		display: grid;
		height: 100vh;
		width: 100vw;
		place-items: center;
	} */

	:global {
		.element {
			width: 48px;
			height: 48px;
			background: #fad658;
			border-radius: 12px;
		}

		.button {
			background: white;
			padding: 8px 16px;
			border-radius: 8px;
			font-size: 14px;
		}
	}
</style>
