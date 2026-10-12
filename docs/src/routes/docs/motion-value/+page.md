---
title: Motion values
description: Composable, signal-like values that track the state and velocity of animated values, and update the DOM without re-rendering your component.
---

<script>
	import Demo from "#lib/components/demo.svelte";
	import dragOpacity from "#lib/demos/motion-value/drag-opacity.svelte?demo";
	import springFollow from "#lib/demos/motion-value/spring-follow.svelte?demo";
</script>

Motion values track the state and velocity of animated values. They're fast because Motion renders them with its own optimised DOM renderer, outside of Svelte's update cycle.

`motion` components create motion values for you behind the scenes. For more advanced effects, you can create them yourself and pass them in:

```svelte
<script lang="ts">
	import { motion, useMotionValue } from "motion-sv";

	const x = useMotionValue(0);
</script>

<motion.div style={{ x }} />
```

Creating motion values yourself lets you:

- Set and get their state.
- Pass them to multiple components to synchronise their motion.
- Chain them together with hooks like [`useTransform`](/docs/use-transform).
- Update visual properties without triggering a Svelte update.
- Subscribe to their changes.

For example, this element fades out as it's dragged away from the center:

```svelte
<script lang="ts">
	import { motion, useMotionValue, useTransform } from "motion-sv";

	const x = useMotionValue(0);
	const opacity = useTransform(x, [-150, 0, 150], [0, 1, 0]);
</script>

<motion.div drag="x" dragSnapToOrigin style={{ x, opacity }} />
```

<Demo demo={dragOpacity} />

## Usage

Create a motion value with `useMotionValue`. The number or string you pass it is its initial state.

```typescript
import { useMotionValue } from "motion-sv";

const x = useMotionValue(0);
```

`useMotionValue` is vanilla Motion's [`motionValue`](https://motion.dev/docs/motion-value) under a hook-style name, so unlike most hooks it isn't tied to a component. You can also create a motion value in a module and share it between components.

Pass a motion value to a `motion` component through `style`:

```svelte
<motion.li style={{ x }} />
```

Or, for SVG attributes, through the attribute itself:

```svelte
<script lang="ts">
	const cx = useMotionValue(100);
</script>

<svg viewBox="0 0 200 200">
	<motion.circle {cx} cy={100} r={20} />
</svg>
```

You can pass the same motion value to as many components as you like.

Update a motion value with `set`:

```typescript
x.set(100);
```

This updates the DOM without triggering a Svelte update. You can set a value many times in a row: Motion batches the changes and renders once, on the next animation frame.

A motion value can hold any number or string. Read its latest state with `get`:

```typescript
x.get(); // 100
```

Numerical motion values also track their velocity, which `getVelocity` returns in units per second, so it stays consistent across devices with different frame rates:

```typescript
const xVelocity = x.getVelocity();
```

For strings and colors, `getVelocity` always returns `0`.

### Rendering a motion value

Motion values aren't Svelte state, which is what makes them fast: changing one doesn't make Svelte update anything. The flip side is that `x.get()` in your markup renders once and then goes stale.

To show a motion value in your markup, wrap it with [`useCurrentMotionValue`](/docs/use-current-motion-value). Its `current` property is reactive, so the markup and any `$derived` that read it update when the value changes:

```svelte
<script lang="ts">
	import { useCurrentMotionValue, useMotionValue } from "motion-sv";

	const x = useMotionValue(0);
	const currentX = useCurrentMotionValue(x);

	const side = $derived(currentX.current < 0 ? "left" : "right");
</script>

<p>{Math.abs(Math.round(currentX.current))}px to the {side}</p>
```

Only do this when you need the value as text or for logic. To animate styles, pass the motion value to `style` directly, so Motion can update the element without involving Svelte.

### Events

Listen to a motion value's events with [its `on` method](#on) or the [`useMotionValueEvent`](/docs/use-motion-value-event) hook, which subscribes for the lifetime of the component.

```typescript
useMotionValueEvent(x, "change", (latest) => console.log(latest));
```

The available events are `"change"`, `"animationStart"`, `"animationComplete"` and `"animationCancel"`.

### Composition

Beyond `useMotionValue`, motion-sv has hooks for creating and composing motion values, like [`useTransform`](/docs/use-transform) and [`useSpring`](/docs/use-spring).

`useTransform` takes the latest state of one or more motion values and creates a new motion value from them:

```typescript
const y = useTransform(() => x.get() * 2);
```

`useSpring` creates a motion value that's attached to another through a spring:

```typescript
const dragX = useMotionValue(0);
const dragY = useMotionValue(0);
const x = useSpring(dragX);
const y = useSpring(dragY);
```

Here, the small handle sets `dragX` and `dragY` as it's dragged, and the ball springs after it:

<Demo demo={springFollow} />

Composed motion values can go on to be passed to `motion` components, or composed further with hooks like [`useVelocity`](/docs/use-velocity).

## API

### `get()`

Returns the latest state of the motion value.

### `getPrevious()`

Returns the motion value's state before its latest change.

### `getVelocity()`

Returns the latest velocity of the motion value, in units per second. Returns `0` if the value isn't numerical.

### `set()`

Sets the motion value to a new state.

```typescript
color.set("#f00");
```

### `jump()`

Jumps the motion value to a new state, breaking continuity with its previous values:

- Resets its velocity to `0`.
- Ends any active animation.
- Ignores attached effects, like `useSpring`'s spring.

```typescript
const x = useSpring(0);

x.jump(10);
x.getVelocity(); // 0
```

### `isAnimating()`

Returns `true` if the value is currently animating.

### `stop()`

Stops the active animation.

### `on()`

Subscribes to one of the motion value's events:

- `"change"`
- `"animationStart"`
- `"animationCancel"`
- `"animationComplete"`

It returns a function that unsubscribes the listener.

```typescript
const unsubscribe = x.on("change", (latest) => console.log(latest));
```

In a component, subscribe in an `$effect` and return the unsubscribe function, so the listener is removed when the component unmounts. Or use [`useMotionValueEvent`](/docs/use-motion-value-event), which does this for you.

### `destroy()`

Removes all of the motion value's subscribers and stops its animation.

Hooks and `motion` components remove their own subscriptions when their component unmounts, so you only need this for motion values you manage yourself, like one created in a module, once you're done with it.
