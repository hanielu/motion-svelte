---
title: Introduction
description: Motion for Svelte. Production-ready animations, gestures, layout and scroll effects for Svelte 5.
---

<script>
	import Callout from "#lib/components/callout.svelte";
	import Demo from "#lib/components/demo.svelte";
	import rotate from "#lib/demos/introduction/rotate.svelte?demo";
	import enter from "#lib/demos/introduction/enter.svelte?demo";
	import gestures from "#lib/demos/introduction/gestures.svelte?demo";
	import exit from "#lib/demos/introduction/exit.svelte?demo";
	import layoutToggle from "#lib/demos/layout-animations/toggle.svelte?demo";
</script>

motion-sv brings [Motion](https://motion.dev) (formerly Framer Motion) to Svelte 5. It runs on the same animation engine as Motion for React and Vue, with an API shaped for Svelte: `motion` components, runes-friendly hooks and snippets.

In this guide, we'll install motion-sv and take a whirlwind tour of its main features.

## Why motion-sv?

Svelte makes it easy to build dynamic interfaces, and its built-in transitions cover simple enter and exit effects. motion-sv is for everything beyond that, from micro-interactions to gesture-driven, physics-based and layout animations, all with one declarative API.

```svelte
<motion.button animate={{ opacity: 1 }} />
```

### Key advantages

- **Declarative.** Animations are props on the element. Change the values in `animate` and the element animates to them, so animations follow your state.
- **Hardware accelerated.** Motion runs animations through the same high-performance browser APIs as CSS where it can, and falls back to JavaScript for everything CSS can't do, like springs, interruptible keyframes and independent transforms.
- **Animate anything.** Transforms, colors, CSS variables, SVG paths, scroll position, layout. One consistent API handles simple transitions and advanced scroll, layout and gesture effects.
- **App-like gestures.** Hover, press, focus, pan and drag recognisers that work across mouse, touch and keyboard. Hover doesn't fire on touch taps, and press works with the keyboard.

### When is CSS a better choice?

For simple, self-contained effects like a color change on hover, a CSS transition is the lightest solution. Svelte's own `transition:` directives are great for simple enter and exit effects too. Reach for motion-sv when you need springs, gestures, layout animations, exit animations that respect interruption, or scroll-linked effects.

## Install

motion-sv is available on npm:

```shellscript
npm install motion-sv
```

It requires Svelte 5.40 or later, and works with SvelteKit and plain Vite apps.

<Callout type="tip">

Every function from vanilla Motion, like [`animate`](https://motion.dev/docs/animate), [`scroll`](https://motion.dev/docs/scroll), [`stagger`](https://motion.dev/docs/stagger) and the easing functions, is also exported from `motion-sv`, so you never need a second package.

</Callout>

## Usage

The core of motion-sv is [the `motion` component](/docs/motion-component). It's a normal DOM element, supercharged with animation capabilities.

```svelte
<script lang="ts">
	import { motion } from "motion-sv";
</script>

<motion.div />
```

Animating a `motion` component is as straightforward as setting values via the `animate` prop:

```svelte
<motion.div animate={{ rotate: 360 }} />
```

<Demo demo={rotate} />

When values in `animate` change, the component animates to them. Motion has great-feeling defaults, but animations can be configured via [the `transition` prop](/docs/transitions).

```svelte
<motion.div animate={{ scale: 2, transition: { duration: 2 } }} />
```

### Enter animation

When a component enters the page, it animates from the rendered value to the values in `animate`. You can provide different starting values via the `initial` prop.

```svelte
<motion.button initial={{ scale: 0 }} animate={{ scale: 1 }} />
```

<Demo demo={enter} />

Or disable the enter animation entirely by setting `initial` to `false`. The element renders straight away with the values in `animate`.

```svelte
<motion.button initial={false} animate={{ scale: 1 }} />
```

### Gestures

`motion` components extend Svelte's events with gesture recognisers for hover, press, focus, pan and drag.

```svelte
<motion.button
	whileHover={{ scale: 1.1 }}
	whilePress={{ scale: 0.95 }}
	onHoverStart={() => console.log("hover started!")}
/>
```

<Demo demo={gestures} />

Motion's gestures are designed to feel better than CSS alone. For instance, hover isn't triggered by touch screen taps. [Learn more about gestures](/docs/gestures).

### Scroll animations

motion-sv supports both kinds of scroll animations: scroll-triggered and scroll-linked.

Scroll-triggered animations run when an element enters or leaves the viewport, with the `whileInView` prop:

```svelte
<motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} />
```

Scroll-linked animations tie values directly to scroll progress. [`useScroll`](/docs/use-scroll) returns [motion values](/docs/motion-value), which you can pass straight to `style`:

```svelte
<script lang="ts">
	import { motion, useScroll } from "motion-sv";

	const { scrollYProgress } = useScroll();
</script>

<motion.div style={{ scaleX: scrollYProgress }} />
```

[Learn more about scroll animations](/docs/scroll-animations).

### Layout animations

Motion can animate between any two layouts using transforms, for example switching `justify-content` or resizing a card.

<Demo demo={layoutToggle} />

Svelte has no hook that runs right before the DOM updates, which is where React and Vue measure the old layout. So in motion-sv you create a layout namespace with `createLayoutMotion()`, render the elements through it, and call its `update()` together with the state change:

```svelte
<script lang="ts">
	import { createLayoutMotion } from "motion-sv";

	const layout = createLayoutMotion();

	let isOn = $state(false);
	const toggle = layout.update.with(() => (isOn = !isOn));
</script>

<button class={["switch", { on: isOn }]} onclick={toggle}>
	<layout.div class="handle" />
</button>
```

This is the one part of motion-sv that works differently from Motion for React and Vue, so it has [its own guide](/docs/layout-animations).

### Exit animations

Svelte removes elements from the DOM straight away. Wrap them in [`AnimatePresence`](/docs/animate-presence) and they stay in the DOM while their `exit` animation plays.

```svelte
<AnimatePresence>
	{#if isVisible}
		<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
	{/if}
</AnimatePresence>
```

<Demo demo={exit} />

## Learn next

That's a quick overview of what motion-sv can do. Next, read about [the `motion` component](/docs/motion-component) and [animation](/docs/animation) in depth, or if you know Motion from React or Vue, see [what's different in Svelte](/docs/coming-from-react-or-vue).
