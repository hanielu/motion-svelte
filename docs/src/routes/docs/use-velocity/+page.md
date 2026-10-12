---
title: useVelocity
description: Creates a motion value that tracks the velocity of another motion value.
---

<script>
	import Demo from "#lib/components/demo.svelte";
	import dragScale from "#lib/demos/use-velocity/drag-scale.svelte?demo";
</script>

`useVelocity` takes a [motion value](/docs/motion-value) and returns a new one that updates with its velocity.

```svelte
<script lang="ts">
	import { motion, useMotionValue, useTransform, useVelocity } from "motion-sv";

	const x = useMotionValue(0);
	const xVelocity = useVelocity(x);
	const scaleX = useTransform(xVelocity, [-3000, 0, 3000], [1.6, 1, 1.6]);
	const scaleY = useTransform(xVelocity, [-3000, 0, 3000], [0.6, 1, 0.6]);
</script>

<motion.div drag="x" dragSnapToOrigin style={{ x, scaleX, scaleY }} />
```

Drag and throw the box. The faster it moves, the more it stretches:

<Demo demo={dragScale} />

## Usage

Import `useVelocity` from `motion-sv`:

```typescript
import { useVelocity } from "motion-sv";
```

Pass it any numerical motion value. It returns a new motion value that updates with the velocity of the original, in units per second:

```svelte
<script lang="ts">
	import { motion, useMotionValue, useMotionValueEvent, useVelocity } from "motion-sv";

	const x = useMotionValue(0);
	const xVelocity = useVelocity(x);

	useMotionValueEvent(xVelocity, "change", (latest) => {
		console.log("Velocity", latest);
	});
</script>

<motion.div style={{ x }} />
```

When the original value stops changing, the velocity keeps updating every frame until it reaches `0`.

Like other hooks, call `useVelocity` during component setup, at the top level of the `<script>`.

Any numerical motion value works, even one returned by `useVelocity`:

```typescript
const x = useMotionValue(0);
const xVelocity = useVelocity(x);
const xAcceleration = useVelocity(xVelocity);
```
