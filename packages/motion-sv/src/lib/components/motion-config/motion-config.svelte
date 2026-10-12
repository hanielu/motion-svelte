<script lang="ts">
	import type { Snippet } from "svelte";
	import { resolveTransition } from "motion-dom";
	import type { MotionConfigProps } from "./types.js";
	import { setMotionConfig, useMotionConfig } from "./context.js";

	let {
		children,
		transition,
		reducedMotion,
		skipAnimations,
		nonce,
		inViewOptions,
	}: MotionConfigProps & { children: Snippet } = $props();

	const parentConfig = useMotionConfig();

	const config = $derived({
		// A transition with `inherit: true` is merged with the parent's, as in React
		transition: resolveTransition(transition, parentConfig().transition) ?? parentConfig().transition,
		reducedMotion: reducedMotion ?? parentConfig().reducedMotion,
		skipAnimations: skipAnimations ?? parentConfig().skipAnimations,
		nonce: nonce ?? parentConfig().nonce,
		inViewOptions: inViewOptions ?? parentConfig().inViewOptions,
	});

	setMotionConfig(() => config);
</script>

{@render children()}
