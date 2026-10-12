---
title: useMotionValueEvent
description: Subscribes to a motion value's events for the lifetime of a component.
---

<script>
	import Callout from "#lib/components/callout.svelte";
	import Demo from "#lib/components/demo.svelte";
	import events from "#lib/demos/use-motion-value-event/events.svelte?demo";
</script>

`useMotionValueEvent` adds an event listener to a [motion value](/docs/motion-value) for the lifetime of a component.

```svelte
<script lang="ts">
	import { motion, useMotionValue, useMotionValueEvent } from "motion-sv";

	const x = useMotionValue(0);

	useMotionValueEvent(x, "animationStart", () => {
		console.log("animation started on x");
	});

	useMotionValueEvent(x, "change", (latest) => {
		console.log("x changed to", latest);
	});
</script>

<motion.div style={{ x }} />
```

When the component unmounts, its listeners are removed.

## Usage

Import `useMotionValueEvent` from `motion-sv`:

```typescript
import { useMotionValueEvent } from "motion-sv";
```

To listen to a motion value's event, pass the motion value, the event's name and a callback:

```typescript
const color = useMotionValue("#00f");

useMotionValueEvent(color, "change", (latest) => {
	console.log(latest);
});
```

The available events are:

- `"change"`
- `"animationStart"`
- `"animationComplete"`
- `"animationCancel"`

`"change"` callbacks receive the motion value's latest state. `"animationCancel"` fires when an animation is stopped before it completes, for instance because another animation on the same value has started.

<Demo demo={events} height={340} />

Like other hooks, call `useMotionValueEvent` during component setup, at the top level of the `<script>`. It starts listening once the component has mounted.

<Callout type="tip">

To render a motion value's latest state in your markup, you don't need to copy it into `$state` with a `"change"` listener. [`useCurrentMotionValue`](/docs/use-current-motion-value) gives you a reactive `current` property that does this for you.

</Callout>

### Advanced

`useMotionValueEvent` is a helper for a motion value's [`on` method](/docs/motion-value#on). With `on`, you can start listening whenever you like, for instance in an event handler. You're then responsible for unsubscribing, at the latest when the component unmounts.

`on` returns a function that unsubscribes the listener, so in an `$effect`, you can return it, or a function that calls several of them:

```svelte
<script lang="ts">
	$effect(() => {
		const doSomething = () => {};

		const unsubscribeX = x.on("change", doSomething);
		const unsubscribeY = y.on("change", doSomething);

		return () => {
			unsubscribeX();
			unsubscribeY();
		};
	});
</script>
```
