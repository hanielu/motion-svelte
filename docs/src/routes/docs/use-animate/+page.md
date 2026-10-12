---
title: useAnimate
description: A version of Motion's animate function that's scoped to your component, and stops its animations when the component unmounts.
---

<script>
	import Callout from "#lib/components/callout.svelte";
	import Demo from "#lib/components/demo.svelte";
	import stagger from "#lib/demos/use-animate/stagger.svelte?demo";
	import sequence from "#lib/demos/use-animate/sequence.svelte?demo";
	import controls from "#lib/demos/use-animate/controls.svelte?demo";
</script>

`useAnimate` gives you a version of [Motion's `animate` function](https://motion.dev/docs/animate) that's scoped to the elements of your component.

It's for animations you want to control by hand: timelines, playback controls, selectors that only match inside your component, and animations that clean themselves up.

It returns a `scope` and an `animate` function. Every selector you pass to `animate` only matches elements inside `scope.current`:

```svelte
<script lang="ts">
	import { useAnimate } from "motion-sv";
	import { untrack } from "svelte";

	const [scope, animate] = useAnimate();

	$effect(() => {
		// This "li" selector only matches children of the <ul>
		untrack(() => animate("li", { opacity: 1 }));
	});
</script>

<ul bind:this={scope.current}>
	<li>One</li>
	<li>Two</li>
</ul>
```

When the component unmounts, every animation started with its `animate` function stops.

## Usage

Import `useAnimate` from `motion-sv`:

```typescript
import { useAnimate } from "motion-sv";
```

`useAnimate` returns two values: a `scope` and an [`animate` function](https://motion.dev/docs/animate).

```svelte
<script lang="ts">
	import { useAnimate } from "motion-sv";

	const [scope, animate] = useAnimate();
</script>
```

Bind `scope.current` to a regular HTML or SVG element with `bind:this`:

```svelte
<ul bind:this={scope.current}>
	<!-- ... -->
</ul>
```

Or to a `motion` component with `bind:ref`:

```svelte
<script lang="ts">
	import { motion, useAnimate } from "motion-sv";

	const [scope, animate] = useAnimate();
</script>

<motion.ul bind:ref={scope.current}>
	<!-- ... -->
</motion.ul>
```

`scope.current` is an `HTMLElement | SVGElement`. To narrow it, pass the element type, like `useAnimate<HTMLUListElement>()`.

Now you can use the scoped `animate` function to animate the scope element directly:

```typescript
animate(scope.current, { opacity: 1 }, { duration: 1 });
```

Or elements inside it, with a selector:

```typescript
animate("li", { backgroundColor: "#000" }, { ease: "linear" });
```

The `"li"` selector doesn't match every `li` on the page, only the ones inside the scope element.

<Demo demo={stagger} />

### When to call `animate`

Call `animate` from event handlers, or from an effect once the scope is bound.

```svelte
<button onclick={() => animate(scope.current, { rotate: 360 })}>Spin</button>
```

An `$effect` re-runs whenever state it reads changes. That's useful when an animation should follow your state:

```svelte
<script lang="ts">
	let isOpen = $state(false);

	$effect(() => {
		animate(scope.current, { opacity: isOpen ? 1 : 0, y: isOpen ? 0 : 20 });
	});
</script>
```

`animate` reads some state itself, like `scope.current` and the nearest `MotionConfig`'s settings. To run an animation only once, when the component mounts, wrap the call in `untrack`, so later changes don't start it again:

```svelte
<script lang="ts">
	import { untrack } from "svelte";

	$effect(() => {
		untrack(() => animate("li", { opacity: 1, x: 0 }, { delay: stagger(0.1) }));
	});
</script>
```

### Sequences

Pass `animate` an array of segments to play a [timeline sequence](https://motion.dev/docs/animate#timeline-sequences). Selectors in each segment are scoped too.

```typescript
function play() {
	animate([
		[".fill", { scaleX: [0, 1] }, { duration: 0.8 }],
		[".dot", { scale: [0, 1] }, { delay: stagger(0.1), type: "spring" }],
		[".label", { opacity: [0, 1] }, { at: "-0.2" }],
	]);
}
```

<Demo demo={sequence} />

### Playback controls

`animate` returns animation controls. You can pause and resume the animation, change its speed, seek with `time`, or wait for it to finish:

```typescript
const animation = animate(".ball", { x: 100 }, { repeat: Infinity, repeatType: "reverse" });

animation.pause();
animation.play();
animation.speed = 0.25;
animation.time = 0;

await animation.finished;
```

<Demo demo={controls} />

See [`animate`](https://motion.dev/docs/animate) for everything it can do, including animating motion values, objects and SVG, and every playback control.

### Scroll-triggered animations

Combine `useAnimate` with [`useInView`](/docs/use-in-view) to animate when the scope scrolls into view:

```svelte
<script lang="ts">
	import { stagger, useAnimate, useInView } from "motion-sv";

	const [scope, animate] = useAnimate();
	const inView = useInView(
		() => scope.current,
		() => ({ once: true })
	);

	$effect(() => {
		if (inView.current) {
			animate("li", { opacity: 1, y: 0 }, { delay: stagger(0.1) });
		}
	});
</script>

<ul bind:this={scope.current}>
	<li>One</li>
	<li>Two</li>
	<li>Three</li>
</ul>
```

## Cleanup

`scope.animations` holds every animation started with the scoped `animate` that hasn't finished yet. When the component unmounts, they're all stopped, so an animation never outlives its component.

Animations started with the `animate` function imported from `motion-sv` aren't scoped, and aren't stopped on unmount.

## Reduced motion

The scoped `animate` follows the nearest [`MotionConfig`](/docs/motion-config), like `motion` components do:

- With `reducedMotion="always"`, or `reducedMotion="user"` when the device's reduced motion setting is on, transforms and position and size values, like `x`, `scale` and `width`, jump straight to their final value. Other values, like `opacity` and colors, still animate.
- With `skipAnimations`, every value jumps straight to its final value.

<Callout type="note">

The `transition` set on `MotionConfig` doesn't apply to `useAnimate`. Pass transition options to `animate` instead.

</Callout>
