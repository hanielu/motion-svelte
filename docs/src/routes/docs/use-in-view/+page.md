---
title: useInView
description: Tracks whether an element is within the viewport.
---

<script>
	import Callout from "#lib/components/callout.svelte";
	import Demo from "#lib/components/demo.svelte";
	import scrollTriggered from "#lib/demos/scroll-animations/scroll-triggered.svelte?demo";
	import root from "#lib/demos/use-in-view/root.svelte?demo";
</script>

`useInView` is a tiny hook that tracks whether an element is within the viewport. It works with any element.

```svelte
<script lang="ts">
	import { useInView } from "motion-sv";

	let element = $state<HTMLElement>();
	const inView = useInView(() => element);
</script>

<div bind:this={element}>{inView.current ? "In view" : "Out of view"}</div>
```

## Usage

Import `useInView` from `motion-sv`:

```typescript
import { useInView } from "motion-sv";
```

Pass `useInView` a function that returns the element to track. The element isn't bound yet when the component's `<script>` runs, so `useInView` reads it through the function, and starts tracking once it's there.

```svelte
<script lang="ts">
	import { useInView } from "motion-sv";

	let element = $state<HTMLElement>();
	const inView = useInView(() => element);
</script>

<div bind:this={element}></div>
```

To track a `motion` component, bind its element with `bind:ref`:

```svelte
<script lang="ts">
	import { motion, useInView } from "motion-sv";

	let element = $state<HTMLElement | SVGElement | null>(null);
	const inView = useInView(() => element);
</script>

<motion.div bind:ref={element} />
```

`inView.current` is `false` while the element is outside the viewport, and becomes `true` when it enters. It's reactive, so anything that reads it, in markup or in `$derived` and `$effect`, updates with it.

```svelte
<motion.div animate={{ opacity: inView.current ? 1 : 0 }} />
```

If the function returns a different element later, `useInView` tracks the new one instead.

### Effects

To run code when the element enters or leaves the viewport, read `inView.current` in an `$effect`:

```svelte
<script lang="ts">
	$effect(() => {
		console.log("Element is in view: ", inView.current);
	});
</script>
```

To animate elements with [`useAnimate`](/docs/use-animate) as they scroll into view:

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
```

<Callout type="tip">

To animate a `motion` component while it's in view, you don't need `useInView`. Use [the `whileInView` prop](/docs/scroll-animations) instead.

</Callout>

## Options

Pass options as a second function, so they can change too:

```typescript
const inView = useInView(
	() => element,
	() => ({ once: true })
);
```

### `root`

By default, `useInView` tracks the element as it enters and leaves the window's viewport. Set `root` to a scrollable ancestor to use that element's viewport instead.

```svelte
<script lang="ts">
	import { useInView } from "motion-sv";

	let container = $state<HTMLElement>();
	let element = $state<HTMLElement>();

	const inView = useInView(
		() => element,
		() => ({ root: container })
	);
</script>

<div bind:this={container} style="overflow: scroll">
	<div bind:this={element}></div>
</div>
```

<Demo demo={root} height={300} />

### `margin`

Default: `"0px"`

A margin to add to the viewport, to grow or shrink the area that counts as in view. Use up to four values, in the order top, right, bottom, left, like `"0px -20px 0px 100px"`.

```typescript
const inView = useInView(
	() => element,
	() => ({ margin: "0px 100px -50px 0px" })
);
```

<Callout type="note">

For browser security reasons, `margin` [doesn't take effect within cross-origin iframes](https://w3c.github.io/IntersectionObserver/#dom-intersectionobserver-rootmargin) unless `root` is set.

</Callout>

### `once`

Default: `false`

If `true`, `useInView` stops tracking the element once it has entered the viewport, and `current` stays `true`.

```typescript
const inView = useInView(
	() => element,
	() => ({ once: true })
);
```

### `initial`

Default: `false`

The value of `current` until the element first enters the viewport.

```typescript
const inView = useInView(
	() => element,
	() => ({ initial: true })
);
```

### `amount`

Default: `"some"`

How much of the element must be inside the viewport to count as in view. Either `"some"`, `"all"`, or a number between `0` and `1`.

```typescript
const inView = useInView(
	() => element,
	() => ({ amount: 0.5 })
);
```

## Example

These cards animate in as they scroll into view. They're `motion` components, so they use the [`whileInView`](/docs/scroll-animations#scroll-triggered-animations) prop, which detects when they enter the viewport the same way `useInView` does:

<Demo demo={scrollTriggered} height={500} />
