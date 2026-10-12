<script lang="ts">
	import { AnimatePresence, motion } from "motion-sv";

	// https://github.com/hanielu/motion-svelte/issues/18: a route change destroys the page that contains an
	// AnimatePresence. The page must leave at once instead of waiting for the children's exit animations.
	let route = $state<"a" | "b">("a");
	let status = $state<"idle" | "busy">("idle");
</script>

<button id="navigate" onclick={() => (route = "b")}>Go to B</button>
<button id="toggle" onclick={() => (status = status === "idle" ? "busy" : "idle")}>Toggle status</button>

{#if route === "a"}
	<section id="page-a" style="height: 100px">
		<AnimatePresence initial={false}>
			{#if status === "idle"}
				<motion.span
					id="label"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.3 }}
				>
					Idle
				</motion.span>
			{/if}
		</AnimatePresence>
	</section>
{:else}
	<section id="page-b" style="height: 100px">Page B</section>
{/if}
