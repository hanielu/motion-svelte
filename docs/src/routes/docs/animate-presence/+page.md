---
title: AnimatePresence
description: Animate elements out before Svelte removes them from the page.
---

<script>
	import Demo from "#lib/components/demo.svelte";
	import exitAnimation from "#lib/demos/introduction/exit-animation.svelte?demo";
	import nested from "#lib/demos/animate-presence/nested.svelte?demo";
	import slideshow from "#lib/demos/animate-presence/slideshow.svelte?demo";
	import custom from "#lib/demos/animate-presence/custom.svelte?demo";
	import modeWait from "#lib/demos/animate-presence/mode-wait.svelte?demo";
	import modePopLayout from "#lib/demos/animate-presence/mode-pop-layout.svelte?demo";
</script>

`AnimatePresence` makes exit animations easy. Svelte removes an element from the DOM as soon as the block that renders it goes away. Wrap the block in `AnimatePresence`, and its `motion` elements stay on the page while their `exit` animation plays.

```svelte
<AnimatePresence>
	{#if isVisible}
		<motion.div exit={{ opacity: 0 }} />
	{/if}
</AnimatePresence>
```

<Demo demo={exitAnimation} />

## Usage

### Import

```typescript
import { AnimatePresence } from "motion-sv";
```

### Exit animations

`AnimatePresence` works with Svelte's blocks. Its `motion` elements animate out when a block inside it removes them. That can be an `{#if}` block whose condition turns false:

```svelte
<AnimatePresence>
	{#if isOpen}
		<motion.div exit={{ opacity: 0 }} />
	{/if}
</AnimatePresence>
```

A `{#key}` block whose key changes:

```svelte
<AnimatePresence>
	{#key image.src}
		<motion.img src={image.src} exit={{ opacity: 0 }} />
	{/key}
</AnimatePresence>
```

Or a keyed `{#each}` block whose item is removed:

```svelte
<AnimatePresence>
	{#each items as item (item.id)}
		<motion.li exit={{ opacity: 0 }}>{item.label}</motion.li>
	{/each}
</AnimatePresence>
```

The `motion` elements don't need to be direct children of the block. They can be nested inside other elements, or inside components:

```svelte
<AnimatePresence>
	{#if isOpen}
		<!-- Modal renders a <motion.div exit={{ opacity: 0 }}> -->
		<Modal />
	{/if}
</AnimatePresence>
```

Every `motion` element in the removed block plays the animation set by its own `exit` prop, and the block leaves the DOM once they've all finished:

```svelte
<motion.div exit={{ opacity: 0 }}>
	<img src={image.src} alt="" />
	<motion.p exit={{ y: 10 }}>{description}</motion.p>
</motion.div>
```

Like `initial` and `animate`, `exit` can be a target or a [variant](/docs/animation) label. Variants flow down to children, so a parent can exit its children first with `when: "afterChildren"`, and stagger them with `delayChildren`:

```svelte
<script lang="ts">
	import { AnimatePresence, motion, stagger, type Variants } from "motion-sv";

	const list: Variants = {
		visible: { opacity: 1, transition: { when: "beforeChildren", delayChildren: stagger(0.06) } },
		hidden: { opacity: 0, transition: { when: "afterChildren", delayChildren: stagger(0.04, { from: "last" }) } },
	};

	const item: Variants = {
		visible: { opacity: 1, x: 0 },
		hidden: { opacity: 0, x: -24 },
	};
</script>

<AnimatePresence>
	{#if isOpen}
		<motion.ul variants={list} initial="hidden" animate="visible" exit="hidden">
			{#each items as label (label)}
				<motion.li variants={item}>{label}</motion.li>
			{/each}
		</motion.ul>
	{/if}
</AnimatePresence>
```

<Demo demo={nested} height={320} />

### Changing key

Where React replaces an element by changing its `key`, Svelte has the `{#key}` block: when its expression changes, Svelte destroys the block's content and renders it again. Inside `AnimatePresence`, the old content plays its exit animation while the new content enters, which is all a slideshow needs:

```svelte
<script lang="ts">
	import { AnimatePresence, motion } from "motion-sv";

	const colors = ["#ff3e00", "#9911ff", "#0cdcf7", "#ff0088"];
	let index = $state(0);
</script>

<AnimatePresence initial={false}>
	{#key index}
		<motion.div
			class="slide"
			style={{ background: colors[index] }}
			initial={{ x: 300, opacity: 0 }}
			animate={{ x: 0, opacity: 1 }}
			exit={{ x: -300, opacity: 0 }}
		/>
	{/key}
</AnimatePresence>

<button onclick={() => (index = (index + 1) % colors.length)}>Next</button>
```

<Demo demo={slideshow} height={300} />

An exiting block no longer updates, so the old slide keeps its color while it leaves. Both slides are on the page while they swap, so the slides here use `position: absolute` to overlap. To show one at a time instead, use [`mode="wait"`](#mode).

## Props

### `initial`

By passing `initial={false}`, `AnimatePresence` disables the enter animation of the children that are present when it first renders. Children added later still animate in.

```svelte
<AnimatePresence initial={false}>
	{#key slide.id}
		<Slide {slide} />
	{/key}
</AnimatePresence>
```

### `custom`

Once a block is removed, it no longer updates, so an exiting element's props can't change anymore. Its exit animation can't depend on state that changes in the same update that removed it.

Pass that state to `AnimatePresence`'s `custom` prop instead. Exiting elements use its latest value to resolve [dynamic variants](/docs/animation), functions that return a target. Give the entering element the same value with its own `custom` prop.

Here, the slideshow uses the direction of the last click to decide which way each slide enters and leaves:

```svelte
<script lang="ts">
	import { AnimatePresence, motion, type Variants } from "motion-sv";

	let index = $state(0);
	let direction = $state(1);

	const variants: Variants = {
		enter: (direction: number) => ({ x: direction * 300, opacity: 0 }),
		center: { x: 0, opacity: 1 },
		exit: (direction: number) => ({ x: direction * -300, opacity: 0 }),
	};

	function paginate(newDirection: number) {
		direction = newDirection;
		index += newDirection;
	}
</script>

<AnimatePresence initial={false} custom={direction}>
	{#key index}
		<motion.div
			class="slide"
			custom={direction}
			{variants}
			initial="enter"
			animate="center"
			exit="exit"
		/>
	{/key}
</AnimatePresence>
```

<Demo demo={custom} height={300} />

### `mode`

Default: `"sync"`

Decides how `AnimatePresence` handles entering and exiting children:

- `"sync"`: Children animate in and out as soon as they're added and removed. Entering and exiting elements are on the page at the same time.
- `"wait"`: Entering children wait until the exiting children have animated out.
- `"popLayout"`: Exiting children are popped out of the page layout, so the elements around them can move to their new layout immediately.

#### `wait`

With `mode="wait"`, only one child is visible at a time. Here, each status animates out before the next one animates in:

```svelte
<AnimatePresence mode="wait">
	{#key index}
		<motion.div
			initial={{ opacity: 0, y: 16 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -16 }}
		>
			{steps[index]}
		</motion.div>
	{/key}
</AnimatePresence>
```

<Demo demo={modeWait} />

Svelte renders the new block straight away, so the entering `motion` elements wait on the page, hidden with `display: none`, until the exits have finished. Content outside of a `motion` element doesn't wait, so wrap the whole block's content in one.

#### `popLayout`

With `mode="popLayout"`, an exiting element is taken out of the page layout with `position: absolute`, at the position and size it had. Pair it with [layout animations](/docs/layout-animations), and the elements around it move into its space right away, while it animates out.

Render the other elements through a layout namespace. Before an element exits, `AnimatePresence` measures the layout elements inside it, so the namespace doesn't need a dependency for removals. Click a square to remove it:

```svelte
<script lang="ts">
	import { AnimatePresence, createLayoutMotion } from "motion-sv";

	const layout = createLayoutMotion();

	let items = $state([0, 1, 2, 3, 4]);
	const remove = (id: number) => (items = items.filter((item) => item !== id));
</script>

<ul style="position: relative">
	<AnimatePresence mode="popLayout">
		{#each items as id (id)}
			<layout.li
				initial={{ opacity: 0, scale: 0.6 }}
				animate={{ opacity: 1, scale: 1 }}
				exit={{ opacity: 0, scale: 0.6 }}
				onclick={() => remove(id)}
			/>
		{/each}
	</AnimatePresence>
</ul>
```

<Demo demo={modePopLayout} />

Adding an element moves the others without an exit, so the demo's namespace also depends on the list, as with any [layout change](/docs/layout-animations).

The popped element is positioned relative to its [offset parent](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/offsetParent), so give the element around it a `position` other than `static`, like the list's `position: relative` here.

### `anchorX`

Default: `"left"`

When `mode` is `"popLayout"`, `anchorX` decides which edge of its offset parent an exiting element is pinned to: `"left"` keeps its distance to the left edge, `"right"` to the right edge. Use `"right"` for right-aligned content, so it doesn't shift if its offset parent's width changes. In right-to-left layouts, the two edges are swapped.

```svelte
<AnimatePresence mode="popLayout" anchorX="right">
	<!-- ... -->
</AnimatePresence>
```

### `onExitComplete`

Fires when all exiting children have finished animating out.

```svelte
<AnimatePresence onExitComplete={() => console.log("All exits complete")}>
	<!-- ... -->
</AnimatePresence>
```

## Troubleshooting

### Exit animations aren't working

Make sure the element has an `exit` prop. Elements without one leave the page straight away. So do [components made with `motion.create()`](/docs/motion-component#custom-components): wrap them in a `motion` element with the `exit` animation.

In `{#each}` blocks, give every item a key that's unique and stays the same for that item, like an ID. The index is a bad key: when items are removed or reordered, Svelte matches indexes rather than items, and the wrong element animates out.

```svelte
<!-- Don't -->
{#each items as item, index (index)}

<!-- Do -->
{#each items as item (item.id)}
```

Also make sure `AnimatePresence` itself stays on the page. If it's removed, it can't hold its children, and they leave without their exit animations. For example, this won't work:

```svelte
{#if isVisible}
	<AnimatePresence>
		<motion.div exit={{ opacity: 0 }} />
	</AnimatePresence>
{/if}
```

Instead, put the condition inside `AnimatePresence`:

```svelte
<AnimatePresence>
	{#if isVisible}
		<motion.div exit={{ opacity: 0 }} />
	{/if}
</AnimatePresence>
```

### The elements around an exiting element jump

Only layout elements animate to a new layout. Render the siblings that move through a [layout namespace](/docs/layout-animations): before an element exits, `AnimatePresence` measures the layout elements inside it.

If elements outside it move too, like a button below the list, render them through a layout namespace as well, and wrap them and the `AnimatePresence` in a [`LayoutGroup`](/docs/layout-group), which measures the whole group together.

With the default `mode="sync"`, the exiting element stays in the layout until its exit animation finishes, and the elements around it move once it's gone. Use [`mode="popLayout"`](#poplayout) to move them right away.

If the same state change also adds elements or changes other layouts, give the namespace a dependency on that state, as with any layout change:

```svelte
<script lang="ts">
	let items = $state([{ id: 1 }, { id: 2 }]);
	// AnimatePresence measures removals, the dependency covers additions
	const layout = createLayoutMotion(() => items);
</script>
```

### `popLayout` elements appear in the wrong place

`mode="popLayout"` positions exiting elements with `position: absolute`, relative to their offset parent. Give the element around them a `position` other than `static`.

An ancestor with a `transform`, for instance during its own layout animation, positions its absolutely positioned descendants even when its `position` is `static`. So if the element around the `AnimatePresence` animates its layout, give it `position: relative` too, so that exiting elements are measured and positioned relative to the same element:

```svelte
<layout.ul style={{ position: "relative" }}>
	<AnimatePresence mode="popLayout">
		{#each items as item (item.id)}
			<layout.li exit={{ opacity: 0 }} />
		{/each}
	</AnimatePresence>
</layout.ul>
```
