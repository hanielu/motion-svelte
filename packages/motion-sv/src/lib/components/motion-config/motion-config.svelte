<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { MotionConfigProps } from './types.js';
	import { MotionConfigContext, useMotionConfig } from './context.js';
	import { computed } from 'runed';

	let { children, transition, reducedMotion, nonce, inViewOptions }: MotionConfigProps & { children: Snippet } =
		$props();

	const parentConfig = useMotionConfig();

	const config = computed(() => ({
		transition: transition ?? parentConfig.value.transition,
		reducedMotion: reducedMotion ?? parentConfig.value.reducedMotion,
		nonce: nonce ?? parentConfig.value.nonce,
		inViewOptions: inViewOptions ?? parentConfig.value.inViewOptions,
	}));

	MotionConfigContext.set(config);
</script>

{@render children()}
