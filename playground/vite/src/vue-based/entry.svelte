<script lang="ts">
	import ExampleView from "./example-view.svelte";
	import Navigation from "./navigation.svelte";
	import type { Snippet } from "svelte";
	import { BrowserRouter, Routes, Route, Outlet } from "@hvniel/svelte-router";
</script>

<BrowserRouter>
	<Routes>
		<Route element={layout as Snippet}>
			<Route path="/" element={home as Snippet} />
			<Route path="/example/:id" Component={ExampleView} />
		</Route>
	</Routes>
</BrowserRouter>

{#snippet layout()}
	<div class="flex h-screen overflow-hidden bg-neutral-950 text-neutral-100">
		<Navigation />
		<main class="flex-1 overflow-y-auto">
			<Outlet />
		</main>
	</div>
{/snippet}

{#snippet home()}
	<div class="mx-auto max-w-4xl px-8 py-12">
		<div class="mb-8">
			<h1 class="mb-4 text-5xl font-bold text-white">Motion Svelte Playground</h1>
			<p class="text-xl text-neutral-400">
				A testing environment for the <code class="rounded bg-neutral-800 px-2 py-1 text-indigo-400">motion-sv</code> package
			</p>
		</div>

		<div class="space-y-6">
			<div class="rounded-xl border border-neutral-800 bg-neutral-900/50 p-6">
				<div class="mb-3 flex items-center gap-3">
					<svg class="h-6 w-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
					</svg>
					<h2 class="text-lg font-semibold text-white">Quick Start</h2>
				</div>
				<p class="text-neutral-300">
					Select an example from the sidebar to see motion-sv in action. Each example demonstrates different animation
					capabilities.
				</p>
			</div>

			<div class="rounded-xl border border-indigo-900/50 bg-indigo-950/30 p-6">
				<div class="mb-3 flex items-center gap-3">
					<svg class="h-6 w-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
					<h2 class="text-lg font-semibold text-white">Live Testing</h2>
				</div>
				<p class="text-neutral-300">
					All examples are loaded simultaneously. When you make changes to the motion-sv package, breaking changes will
					be caught immediately across all examples.
				</p>
			</div>

			<div class="grid gap-4 sm:grid-cols-2">
				<div class="rounded-lg border border-neutral-800 bg-neutral-900/30 p-5">
					<h3 class="mb-2 font-medium text-white">Categories</h3>
					<ul class="space-y-1 text-sm text-neutral-400">
						<li>• Animate Presence</li>
						<li>• Layout Animations</li>
						<li>• Variants</li>
						<li>• From Docs</li>
						<li>• Other Examples</li>
					</ul>
				</div>
				<div class="rounded-lg border border-neutral-800 bg-neutral-900/30 p-5">
					<h3 class="mb-2 font-medium text-white">Features</h3>
					<ul class="space-y-1 text-sm text-neutral-400">
						<li>• URL-based routing</li>
						<li>• Collapsible sidebar</li>
						<li>• Proper scrolling</li>
						<li>• Live updates</li>
					</ul>
				</div>
			</div>
		</div>
	</div>
{/snippet}
