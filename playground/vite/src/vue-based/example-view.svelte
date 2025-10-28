<script lang="ts">
	import { useParams } from "@hvniel/svelte-router";
	import { examplesById } from "./example-registry";
	
	const params = useParams();
	
	let example = $derived(params.id ? examplesById[params.id] : undefined);
	let ExampleComponent = $derived(example?.component);
</script>

{#if example && ExampleComponent}
	<div class="flex h-full flex-col">
		<!-- Header -->
		<div class="border-b border-neutral-800 bg-neutral-950 px-8 py-6">
			<div class="mx-auto max-w-7xl">
				<div class="flex items-center gap-3">
					<div class="rounded-lg bg-indigo-600/10 p-2">
						<svg class="h-5 w-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
						</svg>
					</div>
					<div>
						<h1 class="text-2xl font-bold text-white">{example.name}</h1>
						<p class="text-sm text-neutral-500">{example.category}</p>
					</div>
				</div>
			</div>
		</div>

		<!-- Example Content - Scrollable -->
		<div class="flex-1 overflow-y-auto">
			<div class="mx-auto max-w-7xl px-8 py-8">
				<!-- Example Container with proper scrolling -->
				<div class="rounded-xl border border-neutral-800 bg-neutral-900/50 p-8">
					<ExampleComponent />
				</div>
				
				<!-- Add some bottom padding for better scrolling experience -->
				<div class="h-32"></div>
			</div>
		</div>
	</div>
{:else}
	<div class="flex h-full items-center justify-center">
		<div class="text-center">
			<div class="mb-4 inline-flex rounded-full bg-red-950/50 p-4">
				<svg class="h-12 w-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
				</svg>
			</div>
			<h2 class="mb-2 text-2xl font-bold text-white">Example Not Found</h2>
			<p class="text-neutral-400">The example <code class="rounded bg-neutral-800 px-2 py-1 text-red-400">"{params.id}"</code> does not exist.</p>
			<a href="/" class="mt-6 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700">
				<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
				</svg>
				Back to Home
			</a>
		</div>
	</div>
{/if}
