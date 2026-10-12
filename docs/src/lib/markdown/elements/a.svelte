<script lang="ts">
	import type { HTMLAnchorAttributes } from "svelte/elements";

	let { href, children, ...rest }: HTMLAnchorAttributes = $props();

	// Links to other sites open in a new tab
	const isExternal = $derived(!!href && /^https?:\/\//.test(href));
</script>

<a {href} target={isExternal ? "_blank" : undefined} rel={isExternal ? "noreferrer" : undefined} {...rest}>
	{@render children?.()}
</a>

<style>
	a {
		color: var(--accent);
		text-decoration: none;
	}

	a:hover {
		text-decoration: underline;
	}
</style>
