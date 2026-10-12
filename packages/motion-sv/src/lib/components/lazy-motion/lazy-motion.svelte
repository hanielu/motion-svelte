<script lang="ts">
	import type { FeatureBundle } from "#lib/features/dom-animation.js";
	import type { Snippet } from "svelte";
	import { untrack } from "svelte";
	import { setLazyMotion } from "./context.js";

	type LazyFeatureBundle = Promise<FeatureBundle> | (() => Promise<FeatureBundle>);

	interface LazyMotionProps {
		children: Snippet;
		features: FeatureBundle | LazyFeatureBundle;
		strict?: boolean;
	}

	let { children, features, strict = false }: LazyMotionProps = $props();

	const isLazy = (bundle: LazyMotionProps["features"]): bundle is LazyFeatureBundle =>
		typeof bundle === "function" || bundle instanceof Promise;

	let loaded = $state.raw<FeatureBundle>();

	// A lazy bundle loads once, when LazyMotion mounts, as in React; a later `features` prop doesn't reload it.
	$effect(() => {
		const bundle = untrack(() => features);
		if (!isLazy(bundle)) return;

		let isMounted = true;
		(typeof bundle === "function" ? bundle() : bundle).then((resolved) => {
			if (isMounted) loaded = resolved;
		});
		return () => {
			isMounted = false;
		};
	});

	setLazyMotion({
		get features() {
			return isLazy(features) ? (loaded ?? {}) : features;
		},
		get strict() {
			return strict;
		},
	});
</script>

{@render children()}
