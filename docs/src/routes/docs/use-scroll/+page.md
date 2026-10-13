---
title: useScroll
description: Creates scroll-linked motion values, for progress indicators, parallax and other scroll-linked animations.
---

<script>
	import Callout from "#lib/components/callout.svelte";
	import Demo from "#lib/components/demo.svelte";
	import scrollContainer from "#lib/demos/scroll-animations/scroll-container.svelte?demo";
	import scrollLinked from "#lib/demos/scroll-animations/scroll-linked.svelte?demo";
	import scrollTrackElementInViewport from "#lib/demos/scroll-animations/scroll-track-element-in-viewport.svelte?demo";
	import scrollLinkedWithSpring from "#lib/demos/use-scroll/scroll-linked-with-spring.svelte?demo";
</script>

`useScroll` creates scroll-linked animations, like progress indicators and parallax effects.

```svelte
<script lang="ts">
	import { motion, useScroll } from "motion-sv";

	const { scrollYProgress } = useScroll();
</script>

<motion.div style={{ scaleX: scrollYProgress }} />
```

`useScroll` can run some animations with the browser's [`ScrollTimeline` API](https://developer.mozilla.org/en-US/docs/Web/API/ScrollTimeline), for [hardware-accelerated performance](#hardware-acceleration). The browser then drives the animation itself, so it stays in sync with scrolling and smooth even when the main thread is busy.

## Usage

Import `useScroll` from `motion-sv`:

```typescript
import { useScroll } from "motion-sv";
```

`useScroll` returns four [motion values](/docs/motion-value):

- `scrollX` and `scrollY`: the absolute scroll position, in pixels.
- `scrollXProgress` and `scrollYProgress`: the scroll position between the defined [offsets](#offset), as a value between `0` and `1`.

Like other hooks, call `useScroll` during component setup, at the top level of the `<script>`.

### Page scroll

By default, `useScroll` tracks the page's scroll.

```typescript
const { scrollY } = useScroll();

useMotionValueEvent(scrollY, "change", (latest) => {
	console.log("Page scroll: ", latest);
});
```

For example, you can make a page scroll indicator by passing `scrollYProgress` straight to the `scaleX` style of a progress bar:

```svelte
<script lang="ts">
	import { motion, useScroll } from "motion-sv";

	const { scrollYProgress } = useScroll();
</script>

<motion.div class="progress-bar" style={{ scaleX: scrollYProgress }} />

<style>
	:global(.progress-bar) {
		position: fixed;
		inset: 0 0 auto;
		height: 10px;
		background: #ff0088;
		transform-origin: 0%;
	}
</style>
```

In this demo and the next one, the article scrolls inside a box instead of the page, so the box is passed to `useScroll` as its [`container`](#element-scroll):

<Demo demo={scrollLinked} height={400} />

As `useScroll` returns motion values, you can compose them with other motion value hooks, like [`useTransform`](/docs/use-transform) and [`useSpring`](/docs/use-spring). Here, the progress bar follows the scroll position with a spring, which smooths out its movement:

```svelte
<script lang="ts">
	import { motion, useScroll, useSpring } from "motion-sv";

	const { scrollYProgress } = useScroll();
	const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
</script>

<motion.div class="progress-bar" style={{ scaleX }} />
```

<Demo demo={scrollLinkedWithSpring} height={400} />

Since `scrollY` is a motion value, you can also tell which direction the user is scrolling in, by comparing its latest value with its previous one:

```svelte
<script lang="ts">
	import { useMotionValueEvent, useScroll } from "motion-sv";

	const { scrollY } = useScroll();
	let direction = $state<"up" | "down">("down");

	useMotionValueEvent(scrollY, "change", (current) => {
		const diff = current - (scrollY.getPrevious() ?? 0);
		direction = diff > 0 ? "down" : "up";
	});
</script>
```

That's handy for hiding a sticky header while the user scrolls down, and showing it again when they scroll up.

### Element scroll

To track the scroll position of a scrollable element, pass it as the `container` option.

`bind:this` only assigns the element once the component has mounted, after `useScroll` has run. So pass it through a getter, which `useScroll` reads once the element is bound:

```svelte
<script lang="ts">
	import { motion, useScroll } from "motion-sv";

	let list = $state<HTMLElement>();

	const { scrollXProgress } = useScroll({
		get container() {
			return list;
		},
	});
</script>

<svg viewBox="0 0 100 100">
	<motion.circle cx="50" cy="50" r="30" style={{ pathLength: scrollXProgress }} />
</svg>
<ul bind:this={list} style="overflow-x: scroll">
	<!-- ...items -->
</ul>
```

Here, the list's horizontal scroll progress fills the ring. The list is a `motion` component, bound with `bind:ref`, so it can also animate its `maskImage`, fading out the edges that have more to scroll to:

<Demo demo={scrollContainer} height={330} />

### Element position

To track the progress of an element as it moves through the container, pass it as the `target` option, through a getter too.

```svelte
<script lang="ts">
	import { useScroll } from "motion-sv";

	let target = $state<HTMLElement>();

	const { scrollYProgress } = useScroll({
		get target() {
			return target;
		},
		offset: ["end end", "start start"],
	});
</script>

<div bind:this={target}></div>
```

Here, each item has its own progress indicator, which fills as the item scrolls through the box, from when it's fully in view at the bottom until its top reaches the top:

<Demo demo={scrollTrackElementInViewport} height={440} />

The demo calls `useScroll` once per item, so each item gets its own scroll progress. Calling a hook in a loop is fine in Svelte, because a component's setup only runs once. The scrollable box is passed as `container`, through a getter too.

<Callout type="note">

When tracking a `target` inside a scrollable element, give that element a non-static `position`, like `position: relative`. Motion measures where the target sits through its offset parent, so without it, the progress is off by the container's own position on the page.

</Callout>

### Scroll offsets

With [the `offset` option](#offset), you can define which parts of the target you want to track against which parts of the container. For example, you can track an element as it enters from the bottom, leaves at the top, or travels through the whole viewport.

### Hardware acceleration

`scrollXProgress` and `scrollYProgress` can run on the browser's native scroll timelines, instead of being updated with JavaScript on every scroll event. This happens when:

- The browser supports it: `ScrollTimeline` to track a container, or `ViewTimeline` to track a `target`.
- Without a `target`, no `offset` is set.
- With a `target`, the `offset` can be expressed as a `ViewTimeline` range. That's the default and any offset whose container edges are `start` or `end`, like `["start end", "end start"]`, without pixel or `vh`/`vw` values.
- The progress is passed to an HTML `motion` element's `opacity`, `clipPath`, `filter`, `backgroundColor` or `transform` style, either directly or through [`useTransform`](/docs/use-transform) with an input and output range.

```svelte
<script lang="ts">
	const { scrollYProgress } = useScroll();
	const backgroundColor = useTransform(scrollYProgress, [0, 1], ["#ff0088", "#0cdcf7"]);
</script>

<!-- Both of these run on a ScrollTimeline -->
<motion.div style={{ opacity: scrollYProgress, backgroundColor }} />
```

In every other case, including properties like `scaleX`, Motion updates the values with JavaScript. The motion values themselves update either way, so you can always read them, or pass them to other hooks.

## Options

`useScroll` accepts the following options.

### `container`

**Default:** the page

The scrollable element to track the scroll position of. By default, this is the page, but it can be any scrollable element. Pass bound elements through a getter.

### `target`

**Default:** the scrollable area of the `container`

An element to track the progress of within the `container`. Pass bound elements through a getter.

`target` is tracked by its layout position, so any CSS `transform` applied to it or its ancestors is ignored when measuring its progress.

### `axis`

**Default:** `"y"`

The scroll axis to apply `offset` to.

### `offset`

**Default:** `["start start", "end end"]`

`offset` describes intersections: points where the `target` and `container` meet.

For example, the intersection `"start end"` means the point where the start of the target, on the tracked axis, meets the end of the container.

So if the target is an element, the container is the page, and you're tracking the vertical axis, then `"start end"` is where the top of the element meets the bottom of the viewport. `scrollYProgress` is `0` at the first intersection, and `1` at the last.

#### Accepted intersections

Both target and container points can be defined as:

- **Numbers:** `0` is the start of the axis and `1` is the end. So to match the top of the target with the middle of the container, use `"0 0.5"`. Values outside this range are allowed.
- **Names:** `"start"`, `"center"` and `"end"` are shortcuts for `0`, `0.5` and `1`.
- **Pixels:** pixel values like `"100px"` and `"-50px"` are that many pixels from the start of the target or container.
- **Percentages:** like numbers, expressed as `"0%"` to `"100%"`.
- **Viewport units:** `"vh"` and `"vw"` values.

An intersection can also be an array of two numbers, `[target, container]`, so `"start end"` is the same as `[0, 1]`.

#### Presets

`ScrollOffset` has presets for common offsets:

```typescript
import { ScrollOffset, useScroll } from "motion-sv";

const { scrollYProgress } = useScroll({
	get target() {
		return target;
	},
	offset: ScrollOffset.Enter,
});
```

| Preset | Equivalent to |
| --- | --- |
| `ScrollOffset.Enter` | `["start end", "end end"]`: as the target enters through the end of the container |
| `ScrollOffset.Exit` | `["start start", "end start"]`: as the target leaves through the start of the container |
| `ScrollOffset.Any` | `["end start", "start end"]` |
| `ScrollOffset.All` | `["start start", "end end"]`, the default |

Progress always runs from the first intersection to the last. So with `ScrollOffset.Any`, it counts down from `1` when the target starts to enter to `0` once it has left. To count up instead, use `["start end", "end start"]`.

### `trackContentSize`

**Default:** `false`

When the size of the page's or an element's content changes, its scrollable area can change too. Browsers don't fire an event when that happens, so by default, `useScroll` doesn't update until the next `"scroll"` event.

Set `trackContentSize` to `true` to have `useScroll` check for changes to the content size on every frame:

```typescript
useScroll({ trackContentSize: true });
```

<Callout type="note">

Content size tracking is off by default because the scrollable area is usually stable, and checking it has a small overhead.

</Callout>
