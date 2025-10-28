<script lang="ts">
	import { useLocation } from "@hvniel/svelte-router";
	import { examplesByCategory } from "./example-registry";

	const location = useLocation();
	const categories = Object.keys(examplesByCategory);

	let isOpen = $state(true);
	let currentPath = $derived(location.pathname);
</script>

<aside
	class={[
		"relative flex flex-col border-r border-neutral-800 bg-neutral-900 transition-all duration-300",
		{ "w-72": isOpen, "w-14": !isOpen },
	]}
>
	<!-- Header -->
	<div class="flex items-center justify-between border-b border-neutral-800 bg-neutral-950 px-4 py-3">
		{#if isOpen}
			<h1 class="text-lg font-semibold text-white">Motion Svelte</h1>
		{/if}
		<button
			onclick={() => (isOpen = !isOpen)}
			class="rounded-lg p-2 text-neutral-400 transition-colors hover:bg-neutral-800 hover:text-white"
			aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
		>
			{#if isOpen}
				<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
				</svg>
			{:else}
				<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
				</svg>
			{/if}
		</button>
	</div>

	<!-- Navigation Content -->
	{#if isOpen}
		<nav class="flex-1 overflow-y-auto px-3 py-4">
			<!-- Home Link -->
			<a
				href="/"
				class={[
					"mb-4 flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors",
					{
						"bg-neutral-800 text-white": currentPath === "/",
						"text-neutral-400 hover:bg-neutral-800 hover:text-white": currentPath !== "/",
					},
				]}
			>
				<svg class="mr-3 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
					/>
				</svg>
				Home
			</a>

			<!-- Categories -->
			{#each categories as category}
				<div class="mb-6">
					<h3 class="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-neutral-500">
						{category}
					</h3>
					<div class="space-y-1">
						{#each examplesByCategory[category] as example}
							{@const isActive = currentPath === `/example/${example.id}`}
							<a
								href={`/example/${example.id}`}
								class={[
									"flex items-center rounded-lg px-3 py-2 text-sm transition-colors",
									{
										"bg-indigo-600 text-white font-medium": isActive,
										"text-neutral-400 hover:bg-neutral-800 hover:text-white": !isActive,
									},
								]}
							>
								{example.name}
							</a>
						{/each}
					</div>
				</div>
			{/each}
		</nav>
	{/if}
</aside>
