<script lang="ts">
	import type { Component } from "svelte";
	import { browser } from "$app/env";
	import IconCode from "~icons/lucide/code";
	import IconReplay from "~icons/lucide/rotate-ccw";
	import CopyButton from "./copy-button.svelte";

	interface Props {
		demo: { component: Component; code: string };
		/** Minimum height of the preview, in px. */
		height?: number;
	}

	let { demo, height = 260 }: Props = $props();

	let run = $state(0);
	let showCode = $state(true);
	let code = $state<HTMLDivElement>();
</script>

<figure class="demo">
	<div class="preview" style:min-height="{height}px">
		{#if browser}
			{#key run}
				<demo.component />
			{/key}
		{/if}
	</div>
	<div class="toolbar">
		<button type="button" onclick={() => run++}><IconReplay /> Replay</button>
		<button type="button" onclick={() => (showCode = !showCode)} aria-expanded={showCode}>
			<IconCode />
			{showCode ? "Hide code" : "Show code"}
		</button>
	</div>
	{#if showCode}
		<div class="code" bind:this={code}>
			{@html demo.code}
			<CopyButton text={() => code?.querySelector("pre")?.textContent ?? ""} />
		</div>
	{/if}
</figure>

<style>
	.demo {
		margin: 0 0 1.5rem;
		border: 1px solid var(--border);
		border-radius: 0.75rem;
		overflow: hidden;
	}

	.preview {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 2rem;
		overflow: hidden;
		background:
			radial-gradient(circle at 1px 1px, var(--border) 1px, transparent 0) 0 0 / 1.25rem 1.25rem,
			var(--bg-subtle);
	}

	.toolbar {
		display: flex;
		gap: 0.25rem;
		padding: 0.375rem 0.5rem;
		border-top: 1px solid var(--border);
		background: var(--bg);
	}

	.toolbar button {
		display: inline-flex;
		align-items: center;
		gap: 0.375rem;
		padding: 0.25rem 0.625rem;
		border: none;
		border-radius: 0.375rem;
		background: none;
		color: var(--text-muted);
		font: inherit;
		font-size: 0.8125rem;
		cursor: pointer;
	}

	.toolbar button:hover {
		background: var(--surface);
		color: var(--text);
	}

	.code {
		position: relative;
		max-height: 28rem;
		overflow: auto;
		border-top: 1px solid var(--border);
	}

	.code:hover :global(.copy),
	.code :global(.copy:focus-visible) {
		opacity: 1;
	}

	.code :global(.twinkleplop) {
		border-radius: 0;
	}
</style>
