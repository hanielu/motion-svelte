<script lang="ts">
	import type { Snippet } from "svelte";
	import type { MotionConfigProps } from "./types.js";
	import { MotionConfigContext, useMotionConfig } from "./context.js";

	let { children, transition, reducedMotion, nonce, inViewOptions }: MotionConfigProps & { children: Snippet } =
		$props();

	const parentConfig = useMotionConfig();

	const config = $derived({
		transition: transition ?? parentConfig().transition,
		reducedMotion: reducedMotion ?? parentConfig().reducedMotion,
		nonce: nonce ?? parentConfig().nonce,
		inViewOptions: inViewOptions ?? parentConfig().inViewOptions,
	});

	MotionConfigContext.set(() => config);
</script>

{@render children()}
