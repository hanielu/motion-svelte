<script lang="ts">
	import IconCheck from "~icons/lucide/check";
	import IconCopy from "~icons/lucide/copy";

	interface Props {
		/** Read when the button is pressed, so it can come from the DOM. */
		text: () => string;
	}

	let { text }: Props = $props();

	let copied = $state(false);

	async function copy() {
		try {
			await navigator.clipboard.writeText(text());
		} catch {
			return; // Clipboard access can be denied; the code stays selectable
		}
		copied = true;
		setTimeout(() => (copied = false), 1500);
	}
</script>

<button type="button" class="copy" aria-label="Copy code" onclick={copy}>
	{#if copied}<IconCheck />{:else}<IconCopy />{/if}
</button>

<style>
	.copy {
		position: absolute;
		top: 0.5rem;
		right: 0.5rem;
		display: grid;
		place-items: center;
		width: 2rem;
		height: 2rem;
		border: 1px solid var(--border);
		border-radius: 0.5rem;
		background: var(--bg);
		color: var(--text-muted);
		opacity: 0;
		cursor: pointer;
		transition: opacity 0.15s;
	}

	.copy:hover {
		color: var(--text);
	}
</style>
