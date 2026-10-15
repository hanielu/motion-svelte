---
title: Scroll animations
description: Trigger animations when elements enter the viewport, or link values directly to scroll progress.
---

<script>
	import Callout from "#lib/components/callout.svelte";
	import Demo from "#lib/components/demo.svelte";
	import parallax from "#lib/demos/scroll-animations/parallax.svelte?demo";
	import scrollContainer from "#lib/demos/scroll-animations/scroll-container.svelte?demo";
	import scrollLinked from "#lib/demos/scroll-animations/scroll-linked.svelte?demo";
	import scrollTrackElementInViewport from "#lib/demos/scroll-animations/scroll-track-element-in-viewport.svelte?demo";
	import scrollTriggered from "#lib/demos/scroll-animations/scroll-triggered.svelte?demo";
</script>

There are two kinds of scroll animations:

- **Scroll-triggered:** a normal animation starts when an element enters or leaves the viewport.
- **Scroll-linked:** values are linked directly to scroll progress.

motion-sv supports both.

## Scroll-triggered animations

Scroll-triggered animations are normal animations that run when an element enters or leaves the viewport.

The `whileInView` prop sets a target, or variant, to animate to while the element is in view:

```svelte
<motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} />
```

When the element leaves the viewport, it animates back.

Here, each card container animates to its `onscreen` variant once 80% of it is in view, and the card inside it inherits the variant:

<Demo demo={scrollTriggered} height={500} />

`whileInView` is configured with the `inViewOptions` prop. To set the same options for every `motion` component in a part of your app, pass `inViewOptions` to [`MotionConfig`](/docs/motion-config).

### One-time animations

Set `once: true` and the element stays in its `whileInView` state once it has entered the viewport, instead of animating back out:

```svelte
<motion.div
	initial="hidden"
	whileInView="visible"
	{variants}
	inViewOptions={{ once: true }}
/>
```

### Changing scroll container

By default, the element is in view when it's within the window's viewport. To use another scrollable element as the viewport, get it with `bind:this` and pass it as `root`:

```svelte
<script lang="ts">
	import { motion } from "motion-sv";

	let container = $state<HTMLElement>();
</script>

<div bind:this={container} style="overflow: scroll">
	<motion.div
		initial={{ opacity: 0 }}
		whileInView={{ opacity: 1 }}
		inViewOptions={{ root: container }}
	/>
</div>
```

The demo above works this way, with its own scrollable box as the `root`.

### Amount and margin

`amount` sets how much of the element must be visible to count as in view. It can be `"some"` (the default), `"all"`, or a number between `0` and `1`, the fraction of the element that must be visible:

```svelte
<motion.div whileInView={{ opacity: 1 }} inViewOptions={{ amount: 0.5 }} />
```

`margin` grows or shrinks the viewport, with the same syntax as the CSS `margin` property. Positive values detect the element before it enters, and negative values once it's further in:

```svelte
<motion.div whileInView={{ opacity: 1 }} inViewOptions={{ margin: "0px 0px -100px 0px" }} />
```

<Callout type="note">

`margin` accepts pixel and percentage values only, like `"100px"` or `"0px 0px -20% 0px"`.

</Callout>

### Setting state

`onViewportEnter` and `onViewportLeave` fire as the element enters and leaves the viewport, with its [`IntersectionObserverEntry`](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserverEntry). Use them to set state:

```svelte
<motion.div
	onViewportEnter={() => (isVisible = true)}
	onViewportLeave={() => (isVisible = false)}
/>
```

To track whether any element (not just a `motion` component) is in view, use [`useInView`](/docs/use-in-view). Its `current` property is reactive:

```svelte
<script lang="ts">
	import { useInView } from "motion-sv";

	let element = $state<HTMLElement>();

	const isInView = useInView(() => element);
</script>

<section bind:this={element}>
	{isInView.current ? "In view" : "Out of view"}
</section>
```

## Scroll-linked animations

Scroll-linked animations are made with [motion values](/docs/motion-value) and [`useScroll`](/docs/use-scroll).

`useScroll` returns four motion values: two for the scroll offset in pixels (`scrollX` and `scrollY`), and two for the scroll progress, between `0` and `1` (`scrollXProgress` and `scrollYProgress`).

Pass them straight to `style`. For instance, `scrollYProgress` on `scaleX` makes a reading progress bar:

```svelte
<script lang="ts">
	import { motion, useScroll } from "motion-sv";

	const { scrollYProgress } = useScroll();
</script>

<motion.div
	style={{
		scaleX: scrollYProgress,
		originX: 0,
		position: "fixed",
		top: 0,
		left: 0,
		right: 0,
		height: 10,
		background: "#ff0088",
	}}
/>
```

The demo's article scrolls inside a box rather than the page, so it passes that box to `useScroll` as its [`container`](#scrollable-containers):

<Demo demo={scrollLinked} height={400} />

### Value smoothing

To smooth the value out, pass it through [`useSpring`](/docs/use-spring):

```svelte
<script lang="ts">
	import { motion, useScroll, useSpring } from "motion-sv";

	const { scrollYProgress } = useScroll();
	const scaleX = useSpring(scrollYProgress, {
		stiffness: 100,
		damping: 30,
		restDelta: 0.001,
	});
</script>

<motion.div style={{ scaleX }} />
```

### Transform other values

With [`useTransform`](/docs/use-transform), the progress values can drive any other value, like a color:

```svelte
<script lang="ts">
	import { motion, useScroll, useTransform } from "motion-sv";

	const { scrollYProgress } = useScroll();
	const backgroundColor = useTransform(scrollYProgress, [0, 0.5, 1], ["#f00", "#0f0", "#00f"]);
</script>

<motion.div style={{ backgroundColor }} />
```

### Scrollable containers

By default, `useScroll` tracks the page. To track a scrollable element instead, pass it as `container`. Elements bound with `bind:this`, or `bind:ref` on a `motion` component, are set after the component is created, so pass the options as a getter, which `useScroll` reads again once the element exists:

```svelte
<script lang="ts">
	import { motion, useScroll } from "motion-sv";

	let list = $state<HTMLElement>();

	const { scrollXProgress } = useScroll(() => ({ container: list }));
</script>

<svg viewBox="0 0 100 100">
	<motion.circle cx="50" cy="50" r="30" style={{ pathLength: scrollXProgress }} />
</svg>
<ul bind:this={list} style="overflow-x: scroll">
	<!-- ...items -->
</ul>
```

Here, the list's horizontal scroll progress fills the ring. The list also animates its `maskImage` whenever it reaches or leaves either end, to fade out the edges that have more to scroll to:

<Demo demo={scrollContainer} height={330} />

### Tracking an element

`useScroll` can also track an element's position as it moves through the viewport (or the `container`). Pass the element as `target`, and set `offset` to choose which part of its journey the progress values cover:

```svelte
<script lang="ts">
	import { motion, useScroll } from "motion-sv";

	let target = $state<HTMLElement>();

	const { scrollYProgress } = useScroll(() => ({
		target,
		offset: ["end end", "start start"],
	}));
</script>

<div bind:this={target}>
	<svg viewBox="0 0 100 100">
		<motion.circle cx="50" cy="50" r="30" style={{ pathLength: scrollYProgress }} />
	</svg>
</div>
```

`offset` sets where tracking starts and ends. Each entry describes a point where the target and the viewport meet: `"end end"` means the end of the target meets the end of the viewport. So `["end end", "start start"]` tracks from when the target is fully in view at the bottom of the viewport until its start reaches the top. Edges can be `"start"`, `"center"` and `"end"`, numbers between `0` and `1`, or pixel and percentage values. The default is `["start start", "end end"]`. [`useScroll`](/docs/use-scroll) covers offsets in detail.

Here, each item fills its own progress ring as it moves through a scrollable box. The box is passed as `container` too, so the progress is measured within it:

<Demo demo={scrollTrackElementInViewport} height={440} />

<Callout type="note">

When tracking a target inside a scrollable `container`, give the container a non-static `position`, like `position: relative`. Motion measures the target's position relative to it.

</Callout>

### Parallax

Map an element's scroll progress to `y` to move it at a different speed than the page:

```svelte
<script lang="ts">
	import { motion, useScroll, useTransform, type MotionValue } from "motion-sv";

	function useParallax(value: MotionValue<number>, distance: number) {
		return useTransform(value, [0, 1], [-distance, distance]);
	}

	let image = $state<HTMLElement>();

	const { scrollYProgress } = useScroll(() => ({ target: image }));
	const y = useParallax(scrollYProgress, 300);
</script>

<section>
	<img bind:this={image} src="/photo.jpg" alt="" />
	<motion.h2 style={{ y }}>#001</motion.h2>
</section>
```

Here, each heading follows its image's scroll progress, so it overtakes the image as it scrolls past. The images snap into place with CSS scroll snapping, and the scroll progress of the whole box drives a [smoothed](#value-smoothing) progress bar:

<Demo demo={parallax} height={560} />

### Scroll velocity and direction

[`useVelocity`](/docs/use-velocity) turns `scrollY` into a scroll velocity motion value, and [`useMotionValueEvent`](/docs/use-motion-value-event) can compare each new value with the previous one to find the direction:

```svelte
<script lang="ts">
	import { motion, useMotionValueEvent, useScroll, useTransform, useVelocity } from "motion-sv";

	const { scrollY } = useScroll();
	const scrollVelocity = useVelocity(scrollY);
	const skewY = useTransform(scrollVelocity, [-2000, 0, 2000], [-5, 0, 5]);

	let direction = $state<"up" | "down">("down");

	useMotionValueEvent(scrollY, "change", (current) => {
		direction = current > (scrollY.getPrevious() ?? 0) ? "down" : "up";
	});
</script>

<motion.header style={{ skewY }} data-direction={direction} />
```
