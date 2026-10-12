---
title: Animation
description: Animate any value with the motion component, from simple prop changes to orchestrated sequences across whole trees.
---

<script>
	import Callout from "#lib/components/callout.svelte";
	import Demo from "#lib/components/demo.svelte";
	import state from "#lib/demos/animation/state.svelte?demo";
	import heightAuto from "#lib/demos/animation/height-auto.svelte?demo";
	import pathDrawing from "#lib/demos/animation/path-drawing.svelte?demo";
	import enter from "#lib/demos/introduction/enter.svelte?demo";
	import exit from "#lib/demos/introduction/exit.svelte?demo";
	import keyframes from "#lib/demos/animation/keyframes.svelte?demo";
	import variants from "#lib/demos/animation/variants.svelte?demo";
	import controls from "#lib/demos/animation/controls.svelte?demo";
	import content from "#lib/demos/animation/content.svelte?demo";
</script>

motion-sv gives you several ways to animate your UI, from a single prop that follows your state to orchestrated animations that run through a whole tree of elements.

## Basic animations

Almost every animation runs on [a `motion` component](/docs/motion-component). It's a normal DOM element with animation superpowers:

```svelte
<script lang="ts">
	import { motion } from "motion-sv";
</script>

<motion.div />
```

For basic animations, set values on the `animate` prop:

```svelte
<motion.div animate={{ opacity: 1 }} />
```

Whenever a value in `animate` changes, the component animates to it. Because `animate` is a normal prop, it can read Svelte state, and the element follows that state:

```svelte
<script lang="ts">
	let x = $state(0);
</script>

<motion.div animate={{ x }} />
<input type="range" min={-100} max={100} bind:value={x} />
```

<Demo demo={state} />

## Animatable values

Motion can animate any CSS value, even ones browsers can't animate on their own, like `mask-image`. It supports:

- Numbers: `0`, `100` and so on.
- Strings containing numbers: `"0vh"`, `"10px"` and so on.
- Colors: hex, RGBA and HSLA.
- Complex strings containing several numbers and colors, like `box-shadow`.
- `display: "none"` / `"block"` and `visibility: "hidden"` / `"visible"`.

### Value type conversion

Generally, values animate between two values of the same type, like `"0px"` to `"100px"`. Colors can animate freely between hex, RGBA and HSLA.

`x`, `y`, `width`, `height`, `top`, `left`, `right` and `bottom` can also animate between different value types:

```svelte
<motion.div initial={{ x: "100%" }} animate={{ x: "calc(100vw - 50%)" }} />
```

`width` and `height` can animate to and from `"auto"`:

```svelte
<motion.div initial={{ height: 0 }} animate={{ height: "auto" }} />
```

<Demo demo={heightAuto} />

<Callout type="note">

If you also animate `display` to or from `"none"`, animate `visibility` between `"hidden"` and `"visible"` instead. Elements with `display: none` can't be measured.

</Callout>

### Transforms

Unlike CSS, Motion can animate every transform axis independently:

- Translate: `x`, `y`, `z`
- Scale: `scale`, `scaleX`, `scaleY`
- Rotate: `rotate`, `rotateX`, `rotateY`, `rotateZ`
- Skew: `skewX`, `skewY`
- Perspective: `transformPerspective`

`motion` components have an enhanced `style` prop that accepts individual transforms too:

```svelte
<motion.section style={{ x: -20 }} />
```

Independent transforms are especially flexible with gestures, where each one can animate separately:

```svelte
<motion.button whileHover={{ scale: 1.1 }} whilePress={{ scale: 0.9 }} />
```

Independent transforms perform well, but Motion's hybrid engine can also hardware-accelerate an animation when you set `transform` directly:

```svelte
<motion.li
	initial={{ transform: "translateX(-100px)" }}
	animate={{ transform: "translateX(0px)" }}
	transition={{ type: "spring" }}
/>
```

<Callout type="tip">

On SVG elements, `x`, `y` and `scale` are transforms. To animate the `x` and `y` attributes instead, use `attrX` and `attrY`.

</Callout>

### Transform origin

`transform-origin` has three shorthand values that can be set and animated on their own:

- `originX`
- `originY`
- `originZ`

As numbers, `originX` and `originY` are progress values between `0` and `1`. `originZ` is in pixels.

```svelte
<motion.div style={{ originX: 0.5 }} />
```

### CSS variables

Motion can animate the value of a CSS variable, and use CSS variables as animation targets.

#### Animating CSS variables

Animating a CSS variable is a convenient way to animate many children at once:

```svelte
<motion.ul
	initial={{ "--rotate": "0deg" }}
	animate={{ "--rotate": "360deg" }}
	transition={{ duration: 2, repeat: Infinity }}
>
	<li style="transform: rotate(var(--rotate))"></li>
	<li style="transform: rotate(var(--rotate))"></li>
	<li style="transform: rotate(var(--rotate))"></li>
</motion.ul>
```

<Callout type="note">

Animating a CSS variable always triggers paint, so it can be faster to drive the children with [motion values](/docs/motion-value) instead.

</Callout>

#### CSS variables as animation targets

HTML `motion` components accept CSS variables as animation targets:

```svelte
<motion.li animate={{ backgroundColor: "var(--action-bg)" }} />
```

### SVG line drawing

Many SVG elements can draw themselves with three special values: `pathLength`, `pathSpacing` and `pathOffset`.

```svelte
<motion.path initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />
```

All three are progress values between `0` and `1`, where `1` is the total length of the path.

<Demo demo={pathDrawing} />

Line drawing works with `circle`, `ellipse`, `line`, `path`, `polygon`, `polyline` and `rect` elements.

## Transitions

By default, Motion picks a transition that suits the value being animated. Physical values like `x` and `scale` animate with spring physics, while values like `opacity` and `color` animate with a duration and an easing curve.

You can define your own with [the `transition` prop](/docs/transitions):

```svelte
<motion.div animate={{ x: 100 }} transition={{ ease: "easeOut", duration: 2 }} />
```

## Enter animations

When a `motion` component is created, it animates to the values in `animate` if they differ from the ones it first renders with. Set those starting values with CSS, or with the `initial` prop:

```svelte
<motion.li initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} />
```

<Demo demo={enter} />

Set `initial` to `false` to disable the enter animation. The element renders with the values in `animate` straight away.

```svelte
<motion.div initial={false} animate={{ y: 100 }} />
```

## Exit animations

Svelte removes elements from the DOM as soon as they leave an `{#if}` or `{#each}` block. Wrap them in [`AnimatePresence`](/docs/animate-presence) and they stay in the DOM while their `exit` animation plays:

```svelte
<script lang="ts">
	import { AnimatePresence, motion } from "motion-sv";

	let isVisible = $state(true);
</script>

<AnimatePresence>
	{#if isVisible}
		<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
	{/if}
</AnimatePresence>
```

<Demo demo={exit} />

## Keyframes

Values in `animate` can be arrays of keyframes. The value animates through each one in turn:

```svelte
<motion.div animate={{ x: [0, 100, 0] }} />
```

Use `null` as the first keyframe to start from the value's current state:

```svelte
<motion.div animate={{ x: [null, 100, 0] }} />
```

If this animation interrupts another, it continues from wherever the value is, so the change feels natural.

By default, keyframes are spaced evenly through the animation. To place them yourself, set [the `times` option](/docs/transitions#times) of the transition. `times` is an array of progress values between `0` and `1`, one per keyframe:

```svelte
<motion.circle
	cx={500}
	animate={{
		cx: [null, 100, 200],
		transition: { duration: 3, times: [0, 0.2, 1] },
	}}
/>
```

<Demo demo={keyframes} />

## Gesture animations

`motion` components have props that animate to a target while a gesture is active, and back again when it ends:

```svelte
<motion.button
	initial={{ opacity: 0 }}
	whileHover={{ backgroundColor: "rgba(220, 220, 220, 1)" }}
	whilePress={{ backgroundColor: "rgba(255, 255, 255, 1)" }}
	whileInView={{ opacity: 1 }}
/>
```

There are props for hover, press, focus, drag and in view: `whileHover`, `whilePress`, `whileFocus`, `whileDrag` and `whileInView`. [Learn more about gestures](/docs/gestures).

## Variants

Setting `animate` to a target works well for animating a single element. To orchestrate animations through the DOM, use variants.

Variants are a set of named targets:

```typescript
const variants = {
	visible: { opacity: 1 },
	hidden: { opacity: 0 },
};
```

Pass them to a `motion` component with the `variants` prop:

```svelte
<motion.div {variants} />
```

You can now refer to them by name anywhere you'd set an animation target:

```svelte
<motion.div {variants} initial="hidden" animate="visible" />
```

To apply several variants at once, pass an array of names:

```svelte
<motion.div animate={["visible", "danger"]} />
```

### Propagation

Variants are useful for reusing and combining targets, but their real power is orchestrating animations through a tree.

Variants flow down through `motion` components. Here, when the `ul` enters the viewport, every child with a `visible` variant animates in too:

```svelte
<script lang="ts">
	import { motion, type Variants } from "motion-sv";

	const list: Variants = {
		visible: { opacity: 1 },
		hidden: { opacity: 0 },
	};

	const item: Variants = {
		visible: { opacity: 1, x: 0 },
		hidden: { opacity: 0, x: -100 },
	};
</script>

<motion.ul initial="hidden" whileInView="visible" variants={list}>
	<motion.li variants={item} />
	<motion.li variants={item} />
	<motion.li variants={item} />
</motion.ul>
```

The children don't set `initial`, `animate` or `whileInView` themselves: they inherit the parent's variant names, and animate with their own definition of each.

### Orchestration

By default, children animate at the same time as their parent. Variants unlock extra `transition` options that change this, like [`when`](/docs/transitions#when) and [`delayChildren`](/docs/transitions#delaychildren):

```typescript
import { stagger, type Variants } from "motion-sv";

const list: Variants = {
	visible: {
		opacity: 1,
		transition: {
			when: "beforeChildren",
			delayChildren: stagger(0.3), // Stagger children by 0.3 seconds
		},
	},
	hidden: {
		opacity: 0,
		transition: {
			when: "afterChildren",
		},
	},
};
```

`when: "beforeChildren"` finishes the parent's animation before the children start, and `"afterChildren"` waits for the children to finish first. [`stagger`](https://motion.dev/docs/stagger) spreads the children's delays, from the first child to the last by default.

<Demo demo={variants} height={320} />

<Callout type="note">

`staggerChildren` and `staggerDirection` still work, but `delayChildren: stagger()` replaces them: `stagger(0.1, { from: "last" })` is the same as `staggerChildren: 0.1, staggerDirection: -1`.

</Callout>

### Dynamic variants

A variant can be a function, which runs when the variant becomes active:

```typescript
const variants: Variants = {
	hidden: { opacity: 0 },
	visible: (index: number) => ({
		opacity: 1,
		transition: { delay: index * 0.3 },
	}),
};
```

The function receives the component's `custom` prop, so each element can resolve the same variant differently:

```svelte
{#each items as item, index (item.id)}
	<motion.div custom={index} {variants} initial="hidden" animate="visible" />
{/each}
```

## Animation controls

Declarative animations are ideal for most UI, but sometimes you need to start animations yourself. `useAnimationControls()` creates controls that you pass to `animate` instead of a target:

```svelte
<script lang="ts">
	import { motion, useAnimationControls } from "motion-sv";

	const controls = useAnimationControls();

	async function play() {
		await controls.start({ x: 160 });
		await controls.start({ rotate: 90 });
		await controls.start({ x: 0, rotate: 0 });
	}
</script>

<motion.div animate={controls} />
<button onclick={play}>Play</button>
```

Call `useAnimationControls()` at the top level of the `<script>`, and only call its methods once the component has mounted, in an event handler or an `$effect`.

- `start(definition, transition?)` animates every component that uses these controls. `definition` can be a target, a variant name, an array of variant names, or a function, which each component resolves with its own `custom` prop. It returns a promise that resolves when all the animations have finished.
- `set(definition)` sets the values instantly.
- `stop()` stops the animations.

```svelte
<script lang="ts">
	const controls = useAnimationControls();

	function play() {
		controls.start((i: number) => ({ x: 160, transition: { delay: i * 0.1 } }));
	}
</script>

{#each [0, 1, 2] as i (i)}
	<motion.div custom={i} animate={controls} />
{/each}
```

<Demo demo={controls} height={300} />

For full imperative control, use [`useAnimate`](/docs/use-animate). It can:

- Animate any HTML or SVG element, not just `motion` components.
- Run complex animation sequences.
- Control playback with `time`, `speed`, `play()`, `pause()` and the other playback controls.

```svelte
<script lang="ts">
	import { useAnimate } from "motion-sv";

	const [scope, animate] = useAnimate();

	$effect(() => {
		const controls = animate([
			[scope.current, { x: "100%" }],
			["li", { opacity: 1 }],
		]);

		controls.speed = 0.8;

		return () => controls.stop();
	});
</script>

<ul bind:this={scope.current}>
	<li></li>
	<li></li>
	<li></li>
</ul>
```

## Animate content

[Motion values](/docs/motion-value) aren't Svelte state, so changing one doesn't update the markup. To render a motion value's latest value, read it through [`useCurrentMotionValue`](/docs/use-current-motion-value), whose `current` property is reactive:

```svelte
<script lang="ts">
	import { animate, useCurrentMotionValue, useMotionValue } from "motion-sv";

	const count = useMotionValue(0);
	const latest = useCurrentMotionValue(count);

	$effect(() => {
		const controls = animate(count, 100, { duration: 5 });
		return () => controls.stop();
	});
</script>

<pre>{Math.round(latest.current)}</pre>
```

<Demo demo={content} />

As the value changes, Svelte updates only the text that reads `latest.current`.
