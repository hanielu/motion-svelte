<script lang="ts">
	import { motion } from "motion-sv";

	/**
	 * Reproduces #3079: whileInView not triggering after soft navigation.
	 * Tests several scenarios:
	 * - Element already in viewport on mount
	 * - Element remounting after unmount (soft navigation)
	 * - Element with custom root ref
	 */
	let page = $state<"home" | "projects">("home");

	// Card's scrollRef, one per card (Card is a snippet, which can't hold its own state).
	const scrollRefs = $state<Record<string, HTMLElement | undefined>>({});
</script>

<div>
	<nav>
		<button id="go-home" onclick={() => (page = "home")}>Home</button>
		<button id="go-projects" onclick={() => (page = "projects")}>Projects</button>
	</nav>
	{#if page === "home"}
		{@render HomePage()}
	{/if}
	{#if page === "projects"}
		{@render ProjectsPage()}
	{/if}
</div>

{#snippet HomePage()}
	<div id="home-page">Home</div>
{/snippet}

{#snippet ProjectsPage()}
	<div id="projects-page">
		{@render Card("card1")}
		{@render Card("card2")}
	</div>
{/snippet}

{#snippet Card(id: string)}
	<article bind:this={scrollRefs[id]}>
		<motion.div
			{id}
			data-in-view="false"
			initial={{ opacity: 0 }}
			whileInView={{ opacity: 1 }}
			inViewOptions={{ root: scrollRefs[id], once: true }}
			transition={{ duration: 0.01 }}
			onViewportEnter={() => {
				const el = document.getElementById(id);
				if (el) el.dataset.inView = "true";
			}}
			style={{ width: 100, height: 100, background: "red" }}
		/>
	</article>
{/snippet}
