<script lang="ts">
	import type { Feature } from "@/features/index.js";
	import type { Snippet } from "svelte";
	import { LazyMotionContext } from "./context.js";

	type MaybePromise<T> = T | Promise<T> | (() => Promise<T>);

	interface LazyMotionProps {
		children: Snippet;
		features?: MaybePromise<Feature[]>;
		strict?: boolean;
	}

	let { children, features: featuresProp = [], strict = false }: LazyMotionProps = $props();

	let features = $state.raw<Feature[]>(Array.isArray(featuresProp) ? featuresProp : []);

	if (!Array.isArray(featuresProp)) {
		const featuresPromise = typeof featuresProp === "function" ? featuresProp() : featuresProp;
		featuresPromise.then((feats) => {
			features = feats;
		});
	}

	LazyMotionContext.set({
		features: () => features,
		strict,
	});
</script>

{@render children()}
