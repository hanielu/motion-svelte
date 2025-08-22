<script lang="ts">
	import type { Feature } from '@/features/index.js';
	import type { Snippet } from 'svelte';
	import { ref } from 'runed';
	import { LazyMotionContext } from './context.js';

	type MaybePromise<T> = T | Promise<T> | (() => Promise<T>);

	interface LazyMotionProps {
		children: Snippet;
		features?: MaybePromise<Feature[]>;
		strict?: boolean;
	}

	let { children, features: featuresProp = [], strict = false }: LazyMotionProps = $props();

	const features = ref<any[]>(Array.isArray(featuresProp) ? featuresProp : []);

	if (!Array.isArray(featuresProp)) {
		const featuresPromise = typeof featuresProp === 'function' ? featuresProp() : featuresProp;
		featuresPromise.then((feats) => {
			features.value = feats;
		});
	}

	LazyMotionContext.set({
		features,
		strict,
	});
</script>

{@render children()}
