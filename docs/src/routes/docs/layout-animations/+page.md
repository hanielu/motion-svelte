---
title: Layout animations
description: Animate between any two layouts, even between different elements, with performant transforms.
---

<script>
	import { LayoutGroup } from "motion-sv";
	import Callout from "#lib/components/callout.svelte";
	import Demo from "#lib/components/demo.svelte";
	import layoutAnimation from "#lib/demos/layout-animations/layout-animation.svelte?demo";
	import sharedLayoutAnimation from "#lib/demos/layout-animations/shared-layout-animation.svelte?demo";
	import appStore from "#lib/demos/layout-animations/app-store.svelte?demo";
	import notificationsList from "#lib/demos/layout-animations/notifications-list.svelte?demo";
	import resize from "#lib/demos/layout-animations/resize.svelte?demo";
	import reorderItems from "#lib/demos/layout-animations/reorder-items.svelte?demo";
	import list from "#lib/demos/layout-animations/list.svelte?demo";
	import sharedModal from "#lib/demos/layout-animations/shared-modal.svelte?demo";
	import group from "#lib/demos/layout-animations/group.svelte?demo";
	import scaleCorrection from "#lib/demos/layout-animations/scale-correction.svelte?demo";
</script>

Motion's layout animations can animate between any two layouts, even between different elements. They can animate values CSS can't, like switching `justify-content` from `flex-start` to `flex-end`, and they run on `transform`, so they stay smooth.

<Demo demo={layoutAnimation} />

With `layoutId`, they can match two different elements and animate from one to the other, for anything from an underline that follows the selected tab to a card that expands into a full view.

<Demo demo={sharedLayoutAnimation} height={440} />

<Demo demo={appStore} height={700} />

Layout animations are the one part of motion-sv that works differently from Motion for React and Vue. Read [how they work in Svelte](#how-layout-animations-work-in-svelte) first, and the rest of this page will feel familiar.

## How layout animations work in Svelte

To animate a layout change, Motion needs to measure each element twice: once **before** the change, and once after. It then animates the element from the old box to the new one with `transform`.

React and Vue take the "before" measurement for you, in a hook that runs right before every re-render. Svelte updates the DOM directly and has no such hook, so motion-sv can't know a layout change is coming. Instead, you tell it:

1. **Create a layout namespace** with `createLayoutMotion()`. It works like `motion`: `layout.div`, `layout.li`, `layout.button` and so on.
2. **Render the elements that should animate through it.** Its components animate their layout by default, as if they had the `layout` prop.
3. **Call `layout.update()` with the state change.** It measures the namespace's elements before Svelte updates the DOM. Once the DOM has updated, they animate to their new layout, before the browser paints.

```svelte
<script lang="ts">
	import { createLayoutMotion } from "motion-sv";

	const layout = createLayoutMotion();

	let isOn = $state(false);

	function toggleSwitch() {
		isOn = !isOn;
		layout.update();
	}
</script>

<button class={["toggle-container", isOn ? "start" : "end"]} onclick={toggleSwitch}>
	<layout.div class="toggle-handle" />
</button>
```

`update.with()` wraps a function so that it calls `update()` for you, which is handy for event handlers:

```svelte
<script lang="ts">
	const toggleSwitch = layout.update.with(() => (isOn = !isOn));
</script>
```

Call `update()` in the same synchronous code as the state change. Svelte applies changes to the DOM after your code finishes, so it doesn't matter whether `update()` comes before or after the assignment. It must not come after an `await` or a `flushSync()`, because by then the DOM has already changed.

<Callout type="tip">

There are two exceptions where you don't need `update()`:

- **Shared layout animations.** When an element with a `layoutId` replaces another, it animates from it automatically. See [shared layout animations](#shared-layout-animations).
- **Exits and reorders.** Before an element exits, [`AnimatePresence`](/docs/animate-presence) measures the layout elements inside it, and the rest of their [`LayoutGroup`](/docs/layout-group). A [`ReorderGroup`](/docs/reorder) measures its items whenever its `values` change.

</Callout>

## Usage

<Demo demo={notificationsList} height={564} />

Any layout change you announce with `update()` can be animated: `width` and `height`, grid columns, flex direction, reordering a list, or adding and removing items.

```svelte
<layout.div style={{ width: isOpen ? "80vw" : 0 }} />
```

<Demo demo={resize} />

Change CSS immediately, through `style` or a class, rather than through `animate`. The layout animation animates it for you.

Reordering a list is a layout change too. Here, each item's CSS `order` changes every second, and `update()` runs with each change:

<Demo demo={reorderItems} height={300} />

Adding and removing items works the same way. Here, each item is rendered through the namespace, and `update()` runs with every change to the list. [`AnimatePresence`](/docs/animate-presence) keeps removed items around for their `exit` animation, while the others move into place.

```svelte
<script lang="ts">
	import { AnimatePresence, createLayoutMotion } from "motion-sv";

	const layout = createLayoutMotion();

	let items = $state([1, 2, 3]);
	const remove = layout.update.with((id: number) => (items = items.filter((item) => item !== id)));
</script>

<ul>
	<AnimatePresence>
		{#each items as id (id)}
			<layout.li exit={{ opacity: 0 }} onclick={() => remove(id)}>Item {id}</layout.li>
		{/each}
	</AnimatePresence>
</ul>
```

<Demo demo={list} height={360} />

### Skipping an update

Return `STOP_UPDATE` from a function wrapped with `update.with()` to skip the layout update, for instance when nothing changed:

```svelte
<script lang="ts">
	import { createLayoutMotion, STOP_UPDATE } from "motion-sv";

	const layout = createLayoutMotion();

	const select = layout.update.with((id: string) => {
		if (id === selected) return STOP_UPDATE;
		selected = id;
	});
</script>
```

### Sharing a namespace

Each `createLayoutMotion()` call creates its own namespace, and `update()` measures only that namespace's elements. When a change affects elements in several components, render them all through the same namespace. It's a plain object, so pass it down as a prop or through context.

```svelte
<!-- list.svelte -->
<script lang="ts">
	import { createLayoutMotion } from "motion-sv";
	import Row from "./row.svelte";

	const layout = createLayoutMotion();
</script>

{#each rows as row (row.id)}
	<Row {row} {layout} />
{/each}
```

```svelte
<!-- row.svelte -->
<script lang="ts">
	import type { LayoutMotionNamespace } from "motion-sv";

	let { row, layout }: { row: Row; layout: LayoutMotionNamespace } = $props();
</script>

<layout.li>{row.title}</layout.li>
```

When separate namespaces affect each other's layout, wrap their elements in a [`LayoutGroup`](#group-layout-animations) instead.

### `m`, LazyMotion and custom components

`createLayoutMotion()` builds on `motion` by default. Pass `m` to use it with [`LazyMotion`](/docs/lazy-motion):

```svelte
<script lang="ts">
	import { createLayoutMotion, m } from "motion-sv";

	const layout = createLayoutMotion(m);
</script>
```

Like `motion.create()`, `layout.create()` turns a component into a layout-animated motion component:

```svelte
<script lang="ts">
	import Card from "./card.svelte";

	const LayoutCard = layout.create(Card);
</script>
```

## Shared layout animations

When an element with a `layoutId` mounts while another element with the same `layoutId` leaves, it animates out from the old one. This works with plain `motion` components, without `update()`.

```svelte
{#each tabs as item (item.label)}
	<motion.li onclick={() => (selectedTab = item)}>
		{item.label}
		{#if item.label === selectedTab.label}
			<motion.div class="underline" layoutId="underline" />
		{/if}
	</motion.li>
{/each}
```

<!-- The same demo is at the top of the page. Its own LayoutGroup id keeps the two underlines apart. -->
<LayoutGroup id="shared-layout-animations">
<Demo demo={sharedLayoutAnimation} height={440} />
</LayoutGroup>

If the old element is still on the page when the new one enters, they crossfade from the old to the new. To animate back to the original element when the new one is removed, wrap it in [`AnimatePresence`](/docs/animate-presence), which keeps it on the page until its exit has finished:

```svelte
<motion.button layoutId="panel" onclick={() => (isOpen = true)}>Open</motion.button>

<AnimatePresence>
	{#if isOpen}
		<motion.div class="panel" layoutId="panel" onclick={() => (isOpen = false)} />
	{/if}
</AnimatePresence>
```

<Demo demo={sharedModal} height={300} />

<Callout type="note">

The automatic handoff covers elements that are added or removed. If a `layoutId` element stays mounted and moves, or other elements move along with the handoff, render them through a layout namespace and call `update()` too.

</Callout>

## Setting a transition

Layout animations can be customised with [the `transition` prop](/docs/transitions).

```svelte
<layout.div transition={{ duration: 0.3 }} />
```

To set a transition for just the layout animation, use the `layout` key:

```svelte
<layout.div
	animate={{ opacity: 0.5 }}
	transition={{
		default: { ease: "linear" },
		layout: { duration: 0.3 },
	}}
/>
```

A shared layout animation uses the transition of the element it's animating to:

```svelte
<motion.button
	layoutId="modal"
	onclick={() => (isOpen = true)}
	transition={{ type: "spring" }}
>
	<!-- This transition is used when the modal closes -->
	Open
</motion.button>

<AnimatePresence>
	{#if isOpen}
		<!-- This transition is used when the modal opens -->
		<motion.dialog layoutId="modal" transition={{ duration: 0.3 }} />
	{/if}
</AnimatePresence>
```

## Animating within a scrollable element

To animate layout correctly within a scrollable element, give it the `layoutScroll` prop. This lets Motion account for the element's scroll offset when measuring its children.

```svelte
<motion.div layoutScroll style={{ overflow: "scroll" }}>
	<!-- ...layout children -->
</motion.div>
```

## Animating within fixed containers

To animate layout correctly within a `position: fixed` element, give it the `layoutRoot` prop. This lets Motion account for the page's scroll offset when measuring its children.

```svelte
<motion.div layoutRoot style={{ position: "fixed" }}>
	<!-- ...layout children -->
</motion.div>
```

## Group layout animations

`update()` measures the elements of its own namespace. Elements in other components, with namespaces of their own, aren't measured, so when their layout changes as a result, they jump.

[`LayoutGroup`](/docs/layout-group) links them: when any element inside it is measured, all of its layout elements are. Here each accordion item is a component with its own namespace, and opening one pushes the others down:

```svelte
<script lang="ts">
	import { LayoutGroup } from "motion-sv";
	import AccordionItem from "./accordion-item.svelte";
</script>

<LayoutGroup>
	<AccordionItem title="What is motion-sv?" />
	<AccordionItem title="Do I need createLayoutMotion?" />
</LayoutGroup>
```

```svelte
<!-- accordion-item.svelte -->
<script lang="ts">
	import { createLayoutMotion } from "motion-sv";

	let { title, content } = $props();

	const layout = createLayoutMotion();

	let isOpen = $state(false);
	const toggle = layout.update.with(() => (isOpen = !isOpen));
</script>

<layout.div onclick={toggle}>
	<layout.h4 layout="position">{title}</layout.h4>
	{#if isOpen}<p>{content}</p>{/if}
</layout.div>
```

<Demo demo={group} height={320} />

Without the `LayoutGroup`, the other items would jump to their new positions.

## Scale correction

Layout animations use `transform`, which keeps them fast, but scaling an element can visually distort its children. To correct this, render the children through the namespace too. Layout children are scale-corrected.

Here, the pink dot is rendered through the namespace, so it keeps its shape while its parent resizes. Render it with `motion.div` instead, and the parent's scale distorts it:

<Demo demo={scaleCorrection} height={300} />

Motion also corrects `borderRadius` and `boxShadow` distortion, as long as Motion sets them, like the parent's `initial` border radius above, rather than CSS. If you're not animating them, set them through `style`:

```svelte
<layout.div style={{ borderRadius: 20 }} />
```

## Troubleshooting

### The element isn't animating

- Check the element is rendered through a layout namespace (`<layout.div>`), not `<motion.div>`.
- Check `layout.update()` is called with the state change, in the same synchronous code (not after an `await`).
- Check the element isn't `display: inline`. Browsers don't apply `transform` to inline elements.
- If its layout changes because of another component's update, wrap both in a [`LayoutGroup`](#group-layout-animations) or [share one namespace](#sharing-a-namespace).

### SVG layout animations are broken

SVG elements aren't supported with layout animations. SVGs don't have a layout system, so animate their attributes, like `cx`, directly instead.

### The content stretches undesirably

This is a natural side effect of animating `width` and `height` with `scale`. It can often be fixed by rendering the children through the layout namespace too, so they're scale-corrected.

Elements that change aspect ratio, like images or text, often look better with `layout="position"`, which animates only their position:

```svelte
<layout.img layout="position" src={src} alt="" />
```

### Border radius or box shadows behave strangely

Motion corrects scale distortion on `borderRadius` and `boxShadow`, but only when they're set through `style`:

```svelte
<layout.div style={{ borderRadius: 10, boxShadow: "0 4px 12px rgb(0 0 0 / 0.2)" }} />
```

### The border looks stretched during the animation

Elements with a `border` may look stretched during a layout animation, for two reasons:

1. Changing `border` triggers layout recalculations, which defeats the performance benefits of animating `transform`. You might as well animate `width` and `height` classically.
2. `border` can't render thinner than `1px`, which limits how much Motion can correct it.

A workaround is to replace the `border` with a parent element whose padding acts as the border.

## Differences with the View Transitions API

More browsers now support the [View Transitions API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API), which is similar to layout animations.

View transitions are built into the browser, and they work by crossfading image snapshots of the old and new page. That makes simple crossfades cheap, and enables effects like full-screen wipes that layout animations aren't designed for.

They have some drawbacks compared to layout animations, though:

- **Not interruptible.** Interrupting a view transition snaps it to the end before the next one starts.
- **Blocks interaction.** The animating snapshots sit over the real page and block pointer events.
- **One element per name.** Layout animations allow more than one element with a `layoutId`; view transitions break if the previous element isn't removed.
- **Less performant.** View transitions animate `width` and `height` of real screenshots, rather than `transform`.
- **Doesn't account for scroll.** If the page scrolls during a view transition, elements animate the scroll delta incorrectly.
- **No relative animations.** A delayed nested element gets left behind when its parent animates away.
- **One animation at a time.** View transitions animate the whole page, which makes combining them with other animations difficult.

Each system has its strengths. Use the one that fits the job.

## Further reading

Nanda does an incredible job of [explaining the challenges](https://www.nan.fyi/magic-motion) of animating layout with transforms, with interactive examples.
