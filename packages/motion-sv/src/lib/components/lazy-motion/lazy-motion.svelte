<script lang="ts">
	import type { FeatureBundle } from "#lib/features/dom-animation.js";
	import type { Snippet } from "svelte";
	import { LazyMotionContext } from "./context.js";

	type FeaturesProp = FeatureBundle | Promise<FeatureBundle> | (() => Promise<FeatureBundle>);

	interface LazyMotionProps {
		children: Snippet;
		features: FeaturesProp;
		strict?: boolean;
	}

	let { children, features: featuresProp, strict = false }: LazyMotionProps = $props();

	let features = $state.raw<Partial<FeatureBundle>>({});

	// Check if it's a FeatureBundle object (has renderer property)
	if (typeof featuresProp === "object" && "renderer" in featuresProp) {
		// Sync load
		features = featuresProp;
	} else if (typeof featuresProp === "function") {
		// Async load - function that returns promise
		featuresProp().then((mod) => {
			features = mod;
		});
	} else if (featuresProp instanceof Promise) {
		// Async load - direct promise
		featuresProp.then((mod) => {
			features = mod;
		});
	}

	LazyMotionContext.set({
		features: () => features,
		strict,
	});
</script>

{@render children()}
