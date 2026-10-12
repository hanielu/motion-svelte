---
title: useCurrentMotionValue
description: Reads a motion value reactively, so you can render it in markup or use it in $derived and $effect.
---

<script>
	import Callout from "#lib/components/callout.svelte";
	import Demo from "#lib/components/demo.svelte";
	import dragReadout from "#lib/demos/use-current-motion-value/drag-readout.svelte?demo";
	import counter from "#lib/demos/use-current-motion-value/counter.svelte?demo";
</script>

[Motion values](/docs/motion-value) aren't Svelte state. Changing one updates the elements it's passed to without making Svelte update anything, which is what makes them fast. But it also means that reading one with `get()` in your markup shows its value once and never updates.

`useCurrentMotionValue` wraps a motion value in an object with a reactive `current` property, like Svelte's own [`Tween` and `Spring`](https://svelte.dev/docs/svelte/svelte-motion). Read `current` in your markup, a `$derived` or an `$effect`, and it updates whenever the motion value changes.

```svelte
<script lang="ts">
	import { motion, useCurrentMotionValue, useMotionValue } from "motion-sv";

	const x = useMotionValue(0);
	const currentX = useCurrentMotionValue(x);
</script>

<motion.div drag="x" style={{ x }} />
<output>x: {Math.round(currentX.current)}px</output>
```

<Demo demo={dragReadout} />

<Callout type="note">

`useCurrentMotionValue` is specific to motion-sv. In React and Vue, you'd subscribe to the motion value's `"change"` event and copy it into component state.

</Callout>

## Usage

Import `useCurrentMotionValue` from `motion-sv`:

```typescript
import { useCurrentMotionValue } from "motion-sv";
```

Pass it a motion value. It returns an object whose `current` property is the motion value's latest state:

```typescript
const x = useMotionValue(0);
const currentX = useCurrentMotionValue(x);

currentX.current; // 0
```

`current` works like any other Svelte state, so you can derive from it:

```svelte
<script lang="ts">
	const isFar = $derived(Math.abs(currentX.current) > 100);
</script>

{#if isFar}
	<p>Come back!</p>
{/if}
```

### Animating a number

Combined with [`useTransform`](/docs/use-transform) and [`animate`](https://motion.dev/docs/animate), it makes a counter that animates between numbers:

```svelte
<script lang="ts">
	import { animate, useCurrentMotionValue, useMotionValue, useTransform } from "motion-sv";

	const count = useMotionValue(0);
	const rounded = useTransform(() => Math.round(count.get()));
	const display = useCurrentMotionValue(rounded);

	$effect(() => {
		const controls = animate(count, 100, { duration: 2 });
		return () => controls.stop();
	});
</script>

<output>{display.current}</output>
```

<Demo demo={counter} />

### When to use it

Every change to the motion value updates whatever reads `current`. During an animation, that's once a frame. That's fine for text and logic, but for styles, pass the motion value to `style` instead. Motion then updates the element directly, without involving Svelte at all:

```svelte
<script lang="ts">
	const opacity = useMotionValue(1);
	const currentOpacity = useCurrentMotionValue(opacity);
</script>

<!-- Updates the element directly -->
<motion.div style={{ opacity }} />

<!-- Svelte updates this on every frame of the animation -->
<div style:opacity={currentOpacity.current}></div>
```

To run a side effect when a motion value changes, rather than render it, use [`useMotionValueEvent`](/docs/use-motion-value-event).

### Subscriptions

`useCurrentMotionValue` subscribes to the motion value only while `current` is read somewhere reactive, like your markup, a `$derived` or an `$effect`. When nothing reads it any more, for instance because the markup reading it is removed by an `{#if}`, it unsubscribes.

Reading `current` outside of a reactive context, like in an event handler, returns the latest value without subscribing, the same as `get()`.

Because it only subscribes when read, `useCurrentMotionValue` doesn't need to be called during component setup. You can create one anywhere, including in a module shared between components.

## API

```typescript
useCurrentMotionValue<T>(value: MotionValue<T>): { readonly current: T }
```

### `value`

The motion value to read.

### Returns

An object with a reactive `current` property, the latest state of `value`.
