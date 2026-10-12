---
title: useReducedMotion
description: Tracks whether the device's reduced motion setting is on.
---

<script>
	import Callout from "#lib/components/callout.svelte";
	import Demo from "#lib/components/demo.svelte";
	import panel from "#lib/demos/use-reduced-motion/panel.svelte?demo";
</script>

`useReducedMotion` tracks whether the device's reduced motion setting is on.

```typescript
const reducedMotion = useReducedMotion();
```

Use it to adapt your UI for people who prefer less motion. For instance, replace `x` and `y` animations, which can cause motion sickness, with `opacity`, stop background videos from autoplaying, or turn off parallax effects.

It follows the setting as it changes, so everything that reads it updates straight away.

```svelte
<script lang="ts">
	import { motion, useReducedMotion } from "motion-sv";

	let { isOpen }: { isOpen: boolean } = $props();

	const reducedMotion = useReducedMotion();
	const closedX = $derived(reducedMotion.current ? 0 : "-100%");
</script>

<motion.div animate={{ opacity: isOpen ? 1 : 0, x: isOpen ? 0 : closedX }} />
```

<Demo demo={panel} height={260} />

## Usage

Import `useReducedMotion` from `motion-sv`:

```typescript
import { useReducedMotion } from "motion-sv";
```

Call it in any component to find out whether the reduced motion setting is on. Its `current` property is `true` when it is:

```svelte
<script lang="ts">
	import { useReducedMotion } from "motion-sv";

	const reducedMotion = useReducedMotion();
</script>

{#if !reducedMotion.current}
	<video src="/background.mp4" autoplay muted loop></video>
{/if}
```

`current` is reactive, so use it in markup, `$derived` and `$effect` to change your app's behaviour.

<Callout type="note">

`useReducedMotion` returns Svelte's [`prefersReducedMotion`](https://svelte.dev/docs/svelte/svelte-motion#prefersReducedMotion) from `svelte/motion`. The two are interchangeable.

</Callout>

## Reduced motion across your app

`useReducedMotion` is for changing individual animations by hand. To make every `motion` component in your app respect the setting, wrap it in [`MotionConfig`](/docs/motion-config) with `reducedMotion="user"`:

```svelte
<MotionConfig reducedMotion="user">
	{@render children()}
</MotionConfig>
```

With reduced motion on, transform and layout animations then jump straight to their final values, while others, like `opacity` and `backgroundColor`, still animate.
