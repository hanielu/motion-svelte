---
title: useTransform
description: Creates a motion value that transforms the output of one or more other motion values.
---

<script>
	import Callout from "#lib/components/callout.svelte";
	import Demo from "#lib/components/demo.svelte";
	import transformFunction from "#lib/demos/use-transform/transform-function.svelte?demo";
	import valueMapping from "#lib/demos/use-transform/value-mapping.svelte?demo";
</script>

`useTransform` creates a new [motion value](/docs/motion-value) that transforms the output of one or more other motion values.

```typescript
const x = useMotionValue(1);
const y = useMotionValue(1);

const z = useTransform(() => x.get() + y.get()); // z.get() === 2
```

## Usage

Import `useTransform` from `motion-sv`:

```typescript
import { useTransform } from "motion-sv";
```

`useTransform` can be used in two ways: with a transform function, or by mapping a value from one range to another:

```typescript
// Transform function
const doubledX = useTransform(() => x.get() * 2);

// Value mapping
const color = useTransform(x, [0, 100], ["#f00", "#00f"]);
```

Like other hooks, call `useTransform` during component setup, at the top level of the `<script>`.

### Transform function

A transform function is a normal function that returns a value:

```typescript
const doubledX = useTransform(() => x.get() * 2);
```

`useTransform` subscribes to every motion value the function reads with `get()`. When one of them changes, the function runs again on the next animation frame to compute the new value.

It also runs again when Svelte state that it reads changes. Here, the ball bobs up and down with [`useTime`](/docs/use-time), and the slider sets how far it travels:

```svelte
<script lang="ts">
	import { motion, useTime, useTransform } from "motion-sv";

	let distance = $state(60);

	const time = useTime();
	const y = useTransform(() => Math.sin(time.get() / 500) * distance);
</script>

<motion.div style={{ y }} />
<input type="range" min="0" max="80" bind:value={distance} />
```

<Demo demo={transformFunction} height={320} />

You can also pass the motion values to transform first, and receive their latest values as arguments. Pass one motion value to receive its latest value, or an array of them to receive an array of their latest values:

```typescript
const doubledX = useTransform(x, (latestX) => latestX * 2);

const area = useTransform([width, height], ([latestWidth, latestHeight]: number[]) => latestWidth * latestHeight);
```

These forms recompute when Svelte state the function reads changes too.

### Value mapping

`useTransform` can also map a single motion value from one range of values to another.

To illustrate, take this `x` motion value:

```typescript
const x = useMotionValue(0);
```

You can use `useTransform` to create a new motion value called `opacity`:

```typescript
const opacity = useTransform(x, input, output);
```

By defining an `input` range and an `output` range, you can define relationships like "when `x` is `0`, `opacity` is `1`. When `x` is `100` pixels either side, `opacity` is `0`":

```typescript
const input = [-100, 0, 100];
const output = [0, 1, 0];
```

Both ranges can be any length, but they must be the same length as each other.

The input range must always be a series of increasing or decreasing numbers.

The output range must contain values of the same type, but they can be in any order. It can be any [value type Motion can animate](/docs/animation#animatable-values), like numbers, units, colors and other strings.

```typescript
const backgroundColor = useTransform(x, [0, 100], ["#f00", "#00f"]);
```

Drag this box to change its rotation and color:

```svelte
<script lang="ts">
	import { motion, useMotionValue, useTransform } from "motion-sv";

	const x = useMotionValue(0);
	const background = useTransform(x, [-150, 0, 150], ["#ff0088", "#9911ff", "#0cdcf7"]);
	const rotate = useTransform(x, [-150, 150], [-90, 90]);
</script>

<motion.div drag="x" dragConstraints={{ left: -150, right: 150 }} style={{ x, rotate, background }} />
```

<Demo demo={valueMapping} />

With `clamp: false`, the ranges keep mapping beyond their ends. For instance, this says "for every `100px` scrolled, rotate another `360deg`":

```typescript
const { scrollY } = useScroll();
const rotate = useTransform(scrollY, [0, 100], [0, 360], { clamp: false });
```

#### Output multiple values

It's common to map one motion value and input range into several motion values:

```typescript
const opacity = useTransform(offset, [100, 600], [1, 0.4]);
const scale = useTransform(offset, [100, 600], [1, 0.6]);
const filter = useTransform(offset, [100, 600], ["blur(0px)", "blur(10px)"]);
```

To avoid the repetition, `useTransform` can also map to several motion values in one call. Pass an object of output ranges, and it returns an object of motion values with the same keys:

```typescript
const { opacity, scale, filter } = useTransform(offset, [100, 600], {
	opacity: [1, 0.4],
	scale: [1, 0.6],
	filter: ["blur(0px)", "blur(10px)"],
});
```

#### Changing the input range

An input range array is fixed once `useTransform` has been called. If it depends on something that changes, like an element's measured size, wrap a getter for it with `reactiveInputRange`. The mapping then updates whenever the Svelte state the getter reads changes:

```svelte
<script lang="ts">
	import { reactiveInputRange, useMotionValue, useTransform } from "motion-sv";

	let width = $state(0);

	const x = useMotionValue(0);
	const opacity = useTransform(x, reactiveInputRange(() => [0, width]), [1, 0]);
</script>

<div bind:clientWidth={width}>
	<!-- ... -->
</div>
```

<Callout type="note">

Pass the input range getter through `reactiveInputRange`, never as a bare function. A function in the second position is always treated as a [transformer](#transform-function).

</Callout>

## Options

Value mapping accepts some additional options as its fourth argument.

### `clamp`

**Default:** `true`

If `true`, the output is clamped to the output range. If `false`, it keeps mapping when the input goes beyond the input range.

```typescript
const x = useMotionValue(0);
const y = useTransform(x, [0, 1], [0, 2]);
const z = useTransform(x, [0, 1], [0, 2], { clamp: false });

x.set(2);
// On the next frame: y is 2, because the input is clamped, and z is 4
```

<Callout type="note">

Transformed values update on the next animation frame after a change, not immediately. Reading `y.get()` straight after `x.set(2)` still returns its previous value.

</Callout>

### `ease`

An easing function, or an array of easing functions, to ease the mixing between each pair of values. With an array, it needs one easing function fewer than the ranges have values, as each one applies to the transition between two values.

These must be JavaScript functions, like the [easing functions](https://motion.dev/docs/easing-functions) exported by `motion-sv`:

```typescript
import { circOut, cubicBezier, useTransform } from "motion-sv";

const y = useTransform(x, [0, 1], [0, 2], { ease: circOut });

const z = useTransform(x, [0, 1], [0, 2], { ease: cubicBezier(0.17, 0.67, 0.83, 0.67) });
```

### `mixer`

A function to mix between each pair of output values.

It's called with each pair of output values, and must return a function that takes a progress value between `0` and `1` and returns the mixed value:

```typescript
const mixer = (from: string, to: string) => (progress: number) => (progress < 0.5 ? from : to);

const label = useTransform(x, [0, 100], ["start", "end"], { mixer });
```

This lets you plug in more advanced mixers than Motion's own, for instance [Flubber](https://github.com/veltman/flubber) for morphing between SVG paths.
