<script lang="ts">
	import { goto } from "$app/navigation";
	import { search, type SearchPage } from "#lib/search.js";
	import IconSearch from "~icons/lucide/search";

	let dialog = $state<HTMLDialogElement>();
	let query = $state("");
	let selected = $state(0);
	let pages = $state.raw<SearchPage[]>([]);
	let loading: Promise<void> | undefined;

	const results = $derived(search(pages, query));

	function open() {
		loading ??= fetch("/search.json")
			.then((response) => response.json())
			.then((index: SearchPage[]) => {
				pages = index;
			})
			.catch(() => {
				loading = undefined; // Try again next time the search opens
			});
		dialog?.showModal();
	}

	function close() {
		dialog?.close();
		query = "";
		selected = 0;
	}

	function onkeydown(event: KeyboardEvent) {
		if (event.key === "ArrowDown") {
			event.preventDefault();
			selected = Math.min(selected + 1, results.length - 1);
		} else if (event.key === "ArrowUp") {
			event.preventDefault();
			selected = Math.max(selected - 1, 0);
		} else if (event.key === "Enter" && results[selected]) {
			event.preventDefault();
			close();
			goto(results[selected].href);
		}
	}

	function onWindowKeydown(event: KeyboardEvent) {
		if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
			event.preventDefault();
			if (dialog?.open) close();
			else open();
		}
	}
</script>

<svelte:window onkeydown={onWindowKeydown} />

<button type="button" class="trigger" onclick={open}>
	<IconSearch />
	<span>Search</span>
	<kbd>⌘K</kbd>
</button>

<dialog bind:this={dialog} onclose={() => (query = "")} onclick={(event) => event.target === dialog && close()}>
	<div class="panel">
		<label class="field">
			<IconSearch />
			<!-- svelte-ignore a11y_autofocus -->
			<input
				type="search"
				placeholder="Search the docs"
				autofocus
				bind:value={() => query, (value) => ((query = value), (selected = 0))}
				{onkeydown}
			/>
		</label>
		{#if query}
			<ul>
				{#each results as result, index (result.href)}
					<li>
						<a
							href={result.href}
							class={{ selected: index === selected }}
							onclick={close}
							onpointermove={() => (selected = index)}
						>
							<span class="where">{result.page}{result.heading ? ` › ${result.heading}` : ""}</span>
							<span class="excerpt">{result.excerpt}</span>
						</a>
					</li>
				{:else}
					<li class="empty">No results for “{query}”</li>
				{/each}
			</ul>
		{/if}
	</div>
</dialog>

<style>
	.trigger {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		height: 2rem;
		padding: 0 0.5rem 0 0.625rem;
		border: 1px solid var(--border);
		border-radius: 0.5rem;
		background: var(--bg-subtle);
		color: var(--text-muted);
		font: inherit;
		font-size: 0.8125rem;
		cursor: pointer;
	}

	.trigger:hover {
		color: var(--text);
	}

	kbd {
		padding: 0 0.3125rem;
		border: 1px solid var(--border);
		border-radius: 0.25rem;
		font-family: inherit;
		font-size: 0.6875rem;
	}

	dialog {
		width: min(36rem, calc(100vw - 2rem));
		margin: 12vh auto auto;
		padding: 0;
		border: 1px solid var(--border);
		border-radius: 0.875rem;
		background: var(--bg);
		color: var(--text);
		box-shadow: 0 24px 48px rgb(0 0 0 / 0.35);
	}

	dialog::backdrop {
		background: rgb(0 0 0 / 0.5);
		backdrop-filter: blur(2px);
	}

	.field {
		display: flex;
		align-items: center;
		gap: 0.625rem;
		padding: 0 1rem;
		border-bottom: 1px solid var(--border);
		color: var(--text-muted);
	}

	input {
		flex: 1;
		height: 3.25rem;
		border: none;
		outline: none;
		background: none;
		color: var(--text);
		font: inherit;
		font-size: 1rem;
	}

	ul {
		max-height: 60vh;
		margin: 0;
		padding: 0.5rem;
		overflow-y: auto;
		list-style: none;
	}

	a {
		display: flex;
		flex-direction: column;
		gap: 0.125rem;
		padding: 0.625rem 0.75rem;
		border-radius: 0.5rem;
		text-decoration: none;
	}

	a.selected {
		background: var(--accent-soft);
	}

	.where {
		font-size: 0.875rem;
		font-weight: 500;
	}

	a.selected .where {
		color: var(--accent);
	}

	.excerpt {
		overflow: hidden;
		color: var(--text-muted);
		font-size: 0.8125rem;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	.empty {
		padding: 1rem 0.75rem;
		color: var(--text-muted);
		font-size: 0.875rem;
	}

	@media (max-width: 40rem) {
		.trigger span,
		.trigger kbd {
			display: none;
		}
	}
</style>
