---
title: useAnimationFrame
description: Runs a callback once every animation frame, for as long as the component is mounted.
---

<script>
	import Demo from "#lib/components/demo.svelte";
	import useAnimationFrameDemo from "#lib/demos/use-animation-frame/use-animation-frame.svelte?demo";
</script>

`useAnimationFrame` runs a callback once every animation frame, from when the component mounts until it unmounts.

```typescript
useAnimationFrame((t) => {
	const rotate = Math.sin(t / 10000) * 200;
	const y = (1 + Math.sin(t / 1000)) * -50;
	cube.style.transform = `translateY(${y}px) rotateX(${rotate}deg) rotateY(${rotate}deg)`;
});
```

<Demo demo={useAnimationFrameDemo} height={520} />

## Usage

Import `useAnimationFrame` from `motion-sv`:

```typescript
import { useAnimationFrame } from "motion-sv";
```

Call it at the top level of your component's `<script>` with a callback. The callback receives two arguments:

- `time`: the time in milliseconds since the callback first ran.
- `delta`: the time in milliseconds since the previous frame.

```svelte
<script lang="ts">
	import { useAnimationFrame } from "motion-sv";

	let box = $state<HTMLElement>();

	useAnimationFrame((time, delta) => {
		if (!box) return;
		box.style.transform = `rotateY(${time / 10}deg)`;
	});
</script>

<div bind:this={box}></div>
```

The callback runs in Motion's frame loop, in the same batch as Motion's own animations. It's a good place to write styles directly, without updating Svelte state every frame.

### Using `delta`

`time` counts from the first frame, so it keeps going while your callback returns early, and while the browser isn't running frames, like when the tab is in the background. To move something at a steady speed that you can pause and resume, add up `delta` instead:

```svelte
<script lang="ts">
	let box = $state<HTMLElement>();
	let isPaused = $state(false);
	let angle = 0;

	useAnimationFrame((_, delta) => {
		if (!box || isPaused) return;

		// 90 degrees per second
		angle += (delta / 1000) * 90;
		box.style.transform = `rotate(${angle}deg)`;
	});
</script>
```

`delta` is capped at 40 milliseconds, so after a long pause between frames, values driven by it carry on from where they were instead of jumping ahead.
