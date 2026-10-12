---
title: useTime
description: Creates a motion value that updates every frame with the time since it was created.
---

<script>
	import Demo from "#lib/components/demo.svelte";
	import rotate from "#lib/demos/use-time/rotate.svelte?demo";
	import wave from "#lib/demos/use-time/wave.svelte?demo";
</script>

`useTime` returns a [motion value](/docs/motion-value) that updates once per frame with the time, in milliseconds, since it started.

It's especially useful for perpetual animations.

```svelte
<script lang="ts">
	import { motion, useTime, useTransform } from "motion-sv";

	const time = useTime();
	const rotate = useTransform(time, [0, 4000], [0, 360], { clamp: false });
</script>

<motion.div style={{ rotate }} />
```

<Demo demo={rotate} />

## Usage

Import `useTime` from `motion-sv`:

```typescript
import { useTime } from "motion-sv";
```

`useTime` creates a new motion value. Once the component has mounted, it updates every frame with the time elapsed since its first frame.

Like other hooks, call `useTime` during component setup, at the top level of the `<script>`. It stops updating when the component unmounts.

You can use the value directly, or compose it with other motion value hooks:

```typescript
const time = useTime();
const rotate = useTransform(
	time,
	[0, 4000], // For every 4 seconds...
	[0, 360], // ...rotate 360deg
	{ clamp: false }
);
```

[`useTransform`](/docs/use-transform) with a function is handy for maths-based motion, like a sine wave. Here, each dot follows the same wave a little behind the one before it:

```typescript
const time = useTime();

const offsets = Array.from({ length: 7 }, (_, i) =>
	useTransform(() => Math.sin(time.get() / 300 - i * 0.6) * 40)
);
```

Calling hooks in a loop like this is fine in Svelte, because a component's setup only runs once.

<Demo demo={wave} />
