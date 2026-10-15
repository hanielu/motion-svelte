---
title: Coming from React or Vue
description: What's the same and what's different in motion-sv, if you know Motion for React or Vue.
---

<script>
	import Callout from "#lib/components/callout.svelte";
</script>

motion-sv runs on the same engine as Motion for React and Vue, and most of the API is identical: the same `motion` components, the same props, the same transitions, hooks and vanilla functions. This page covers the differences, from syntax to the few places where Svelte works differently.

## Syntax

Props are passed with Svelte's syntax. Objects need double braces, one for the expression and one for the object:

```svelte
<script lang="ts">
	import { motion } from "motion-sv";

	let isOpen = $state(false);
</script>

<motion.div
	animate={{ opacity: isOpen ? 1 : 0 }}
	transition={{ duration: 0.3 }}
	onclick={() => (isOpen = !isOpen)}
/>
```

| React | Vue | Svelte |
| --- | --- | --- |
| `import { motion } from "motion/react"` | `import { motion } from "motion-v"` | `import { motion } from "motion-sv"` |
| `animate={{ x: 100 }}` | `:animate="{ x: 100 }"` | `animate={{ x: 100 }}` |
| `onClick={handler}` | `@click="handler"` | `onclick={handler}` |
| `className="box"` | `class="box"` | `class="box"` |
| `useState` | `ref` | `$state` |
| `{show && <motion.div />}` | `v-if="show"` | `{#if show}` |
| `items.map(...)` with `key` | `v-for` with `:key` | `{#each items as item (item.id)}` |

DOM events use Svelte's lowercase names, like `onclick` and `onpointerdown`. Motion's own callbacks keep their names, like `onHoverStart`, `onAnimationComplete` and `onDragEnd`.

## Props

The `motion` component supports the same props, with these differences:

- **`whilePress` instead of `whileTap`.** Like Motion for Vue, the press gesture is `whilePress`, and its callbacks are `onPressStart`, `onPress` and `onPressCancel`.
- **`inViewOptions` instead of `viewport`.** Like Motion for Vue, `whileInView` is configured with `inViewOptions`, which takes `root`, `margin`, `amount` and `once`.
- **`class` accepts Svelte's class arrays and objects**, like `class={["card", { active }]}`.

```svelte
<motion.button
	whileHover={{ scale: 1.05 }}
	whilePress={{ scale: 0.95 }}
	onPress={() => console.log("pressed")}
/>

<motion.div
	whileInView={{ opacity: 1 }}
	inViewOptions={{ once: true, amount: 0.5 }}
/>
```

## Refs

Get a `motion` component's element with `bind:ref`, the same way you'd use `ref` in React or Vue. For plain elements, use `bind:this` as usual.

```svelte
<script lang="ts">
	let box = $state<HTMLElement | SVGElement | null>(null);
	let container = $state<HTMLElement>();
</script>

<div bind:this={container}>
	<motion.div bind:ref={box} drag dragConstraints={container} />
</div>
```

## Children and custom components

Children are passed as normal Svelte content. Render a `motion` component as another element with `as`, or turn your own component into a motion component with `motion.create()`. The component must spread its props onto its element, so Motion receives the attachment that gives it the element.

```svelte
<script lang="ts">
	import { motion } from "motion-sv";
	import Button from "./button.svelte";

	const MotionButton = motion.create(Button);
</script>

<motion.div as="section" animate={{ opacity: 1 }} />
<MotionButton whileHover={{ scale: 1.1 }} />
```

## Layout animations

This is the biggest difference. React and Vue measure every element right before each re-render, so adding the `layout` prop is enough. Svelte has no hook that runs before the DOM updates, so motion-sv needs to know which state the layout depends on:

```svelte
<script lang="ts">
	import { createLayoutMotion } from "motion-sv";

	let isOn = $state(false);
	const layout = createLayoutMotion(() => isOn);
</script>

<layout.div class={{ on: isOn }} onclick={() => (isOn = !isOn)} />
```

- Render elements through a namespace from `createLayoutMotion()` instead of adding `layout` to `motion` components.
- Pass it a getter for the state that moves them, like React's `layoutDependency` but for the whole namespace. Or call `layout.update()` with the state change.
- Shared layout animations with `layoutId` work as in React, without a namespace.
- The `layoutDependency` prop isn't used to decide when to measure. The namespace's dependency is.

[The layout animations guide](/docs/layout-animations) covers all of this in detail.

## AnimatePresence

`AnimatePresence` works with Svelte's blocks instead of React's children diffing. Elements removed by `{#if}`, `{#each}` or `{#key}` stay on the page while their `exit` animation plays:

```svelte
<AnimatePresence>
	{#if isVisible}
		<motion.div exit={{ opacity: 0 }} />
	{/if}
</AnimatePresence>
```

Where React swaps elements by changing their `key`, use a `{#key}` block. The `mode`, `initial`, `custom`, `onExitComplete` and `anchorX` props work as in React. [Learn more](/docs/animate-presence).

## Motion values and hooks

Hooks work like their React and Vue versions. Call them during component setup, at the top level of the `<script>`.

- **`useMotionValue`** is Motion's `motionValue`. Motion values aren't Svelte state, so they don't re-render anything when they change. That's what makes them fast. To render one in markup, use [`useCurrentMotionValue`](/docs/use-current-motion-value), which gives you a reactive `current` property.
- **Changing inputs are passed as getters.** Where React re-runs a hook with new arguments, Svelte hooks take getters for inputs that can change, like elements that aren't bound yet:

```svelte
<script lang="ts">
	import { useInView, useScroll } from "motion-sv";

	let target = $state<HTMLElement>();

	const { scrollYProgress } = useScroll(() => ({ target }));
	const inView = useInView(() => target);
</script>

<div bind:this={target}>{inView.current ? "In view" : "Out of view"}</div>
```

- **`useAnimate`** binds its scope with `bind:this={scope.current}`.
- **`useTransform`** with a function recomputes when the motion values it reads change, and also when Svelte state it reads changes.

## Reorder

`Reorder.Group` and `Reorder.Item` are the named exports `ReorderGroup` and `ReorderItem`. Bind the order with `bind:values`, or pass `values` and `onReorder`. `ReorderItem`'s children receive whether it's being dragged.

```svelte
<ReorderGroup bind:values={items}>
	{#each items as item (item)}
		<ReorderItem value={item}>{item}</ReorderItem>
	{/each}
</ReorderGroup>
```

## Not available in Svelte

<Callout type="note">

These React and Vue APIs have no motion-sv equivalent:

- `usePresence`, `useIsPresent` and `usePresenceData`.
- `useCycle`, `useAnimatedState`, `useWillChange` and `useDomEvent`. Svelte's runes and event handlers cover what they're for.
- The `v-motion` directive and Nuxt modules from Motion for Vue.
- Motion+ components, like `Ticker`, `Carousel`, `Cursor`, `Typewriter` and `AnimateNumber`.

</Callout>

Everything from vanilla Motion, like `animate`, `scroll`, `inView`, `stagger` and the easing functions, is exported from `motion-sv` and works as documented on [motion.dev](https://motion.dev/docs/quick-start).
