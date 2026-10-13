---
title: LazyMotion
description: Reduce bundle size by rendering m components and loading only the features they use, synchronously or lazily.
---

<script>
	import Callout from "#lib/components/callout.svelte";
	import Demo from "#lib/components/demo.svelte";
	import sync from "#lib/demos/lazy-motion/sync.svelte?demo";
	import asyncDemo from "#lib/demos/lazy-motion/async.svelte?demo";
	import layout from "#lib/demos/lazy-motion/layout.svelte?demo";
</script>

For ease of use, the [`motion` component](/docs/motion-component) comes with all of its features built in. In a minimal Vite app, that's about 48kb of gzipped JavaScript on top of Svelte itself.

With `LazyMotion` and the `m` component, the initial render needs about a third of that, and you choose which features to load on top, either as part of your main bundle or lazily, after the page has rendered.

## Usage

Instead of `motion`, import the slimmer `m` component:

```svelte
<script lang="ts">
	import { m } from "motion-sv";
</script>
```

`m` is used exactly like `motion`, but it doesn't come with any features: no animations, gestures or layout animations. Instead, you load them with the `LazyMotion` component, which provides them to every `m` component inside it:

```svelte
<script lang="ts">
	import { LazyMotion, domAnimation, m } from "motion-sv";
</script>

<!-- Load only the domAnimation features -->
<LazyMotion features={domAnimation}>
	<m.div animate={{ opacity: 1 }} />
</LazyMotion>
```

<Demo demo={sync} />

`m.create()` turns your own components into `m` components, [like `motion.create()`](/docs/motion-component#custom-components).

An `m` component outside of `LazyMotion`, or inside one whose features haven't loaded yet, renders the styles of its initial state but doesn't animate.

## Available features

There are two feature bundles you can load:

- `domAnimation`: animations, variants, exit animations, and the hover, press, focus and in-view gestures. It adds about 20kb.
- `domMax`: everything in `domAnimation`, plus the pan and drag gestures and layout animations. It adds about 34kb.

Both include the same animation features, so `domMax` is `domAnimation` with more on top, rather than a separate set to load as well.

### Synchronous loading

Passing a bundle straight to `features` includes it in your main JavaScript bundle, and the components animate from the first render:

```svelte
<script lang="ts">
	import { LazyMotion, domMax, m } from "motion-sv";
</script>

<LazyMotion features={domMax}>
	<m.div drag whileDrag={{ scale: 1.1 }} />
</LazyMotion>
```

### Lazy loading

With a bundler that supports dynamic imports, like Vite, `features` also accepts a function that loads the bundle. It runs when `LazyMotion` mounts, so the features are fetched in a separate chunk after the first render.

First, create a module that exports only the features you want to load:

```typescript
// features.ts
import { domMax } from "motion-sv";

export default domMax;
```

Then import it from the function:

```svelte
<script lang="ts">
	import { LazyMotion, m } from "motion-sv";

	const loadFeatures = () => import("./features.js").then((mod) => mod.default);
</script>

<LazyMotion features={loadFeatures}>
	<m.div animate={{ scale: 1.5 }} />
</LazyMotion>
```

<Demo demo={asyncDemo} />

`features` can also be a promise of the bundle, like `import("./features.js").then((mod) => mod.default)`. The import then starts as soon as that line runs, rather than when `LazyMotion` mounts.

Once the features arrive, each `m` component starts animating from its initial state, including its enter animation and any changes made in the meantime. A lazy bundle loads once: changing `features` afterwards doesn't load it again.

## Layout animations

[Layout animations](/docs/layout-animations) need a layout namespace, which `createLayoutMotion()` builds on `motion` by default. Pass it `m` first to render its components as `m` components, and load `domMax`, which includes layout animations:

```svelte
<script lang="ts">
	import { LazyMotion, createLayoutMotion, domMax, m } from "motion-sv";

	let isOn = $state(false);
	const layout = createLayoutMotion(m, () => isOn);
</script>

<LazyMotion features={domMax}>
	<button class={["switch", { on: isOn }]} onclick={() => (isOn = !isOn)}>
		<layout.div class="handle" />
	</button>
</LazyMotion>
```

<Demo demo={layout} />

## Props

### features

The features to load: `domAnimation` or `domMax`, a promise of either, or a function that returns such a promise.

### strict

Default: `false`

If `true`, rendering a `motion` component inside this `LazyMotion` throws an error. A `motion` component brings all of its features with it, which removes the bundle size benefits of `LazyMotion`, so `strict` helps you catch any that slip in.

```svelte
<LazyMotion features={domAnimation} strict>
	<!-- Throws: render m.div instead -->
	<motion.div />
</LazyMotion>
```

To allow a specific `motion` component anyway, give it the `ignoreStrict` prop. It then logs a warning instead of throwing:

```svelte
<LazyMotion features={domAnimation} strict>
	<motion.div ignoreStrict />
</LazyMotion>
```

<Callout type="note">

These checks only run in development. Production builds skip them.

</Callout>
