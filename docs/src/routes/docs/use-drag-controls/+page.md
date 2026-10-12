---
title: useDragControls
description: Controls that start, stop and cancel a motion component's drag gesture from other elements.
---

<script>
	import Demo from "#lib/components/demo.svelte";
	import handle from "#lib/demos/use-drag-controls/handle.svelte?demo";
	import scrubber from "#lib/demos/use-drag-controls/scrubber.svelte?demo";
</script>

A drag usually starts when the pointer presses down on [a `motion` component with the `drag` prop](/docs/gestures#drag) and then moves.

Sometimes the drag should start somewhere else, like from a handle on a card, or from any point along a video scrubber's track. `useDragControls` creates controls that start a drag gesture from any pointer event.

<Demo demo={handle} />

## Usage

Import `useDragControls` from `motion-sv`:

```typescript
import { useDragControls } from "motion-sv";
```

`useDragControls` returns drag controls. Pass them to a draggable `motion` component with the `dragControls` prop:

```svelte
<script lang="ts">
	import { motion, useDragControls } from "motion-sv";

	const controls = useDragControls();
</script>

<motion.div drag dragControls={controls} />
```

Then start a drag from another element's `pointerdown` event with `controls.start`:

```svelte
<div onpointerdown={(event) => controls.start(event)}></div>
```

The same controls can be passed to more than one `motion` component. `start` then drags all of them.

### Touch support

Give the element that starts the drag `touch-action: none`. Otherwise, touch devices treat the gesture as a scroll and cancel the drag.

```svelte
<div style="touch-action: none" onpointerdown={(event) => controls.start(event)}></div>
```

### Snap to cursor

By default, the dragged element moves by as much as the pointer does, from wherever it is.

Pass `snapToCursor: true` to `start` to center the element on the pointer first:

```typescript
controls.start(event, { snapToCursor: true });
```

<Demo demo={scrubber} height={160} />

### Disable automatic drag

With drag controls, the `motion` component still starts a drag gesture when it receives a `pointerdown` event itself. To only drag through the controls, as with a drag handle, set `dragListener` to `false`:

```svelte
<motion.div drag dragControls={controls} dragListener={false}>
	<div class="handle" onpointerdown={(event) => controls.start(event)}></div>
	<!-- Pressing anywhere else won't start a drag -->
</motion.div>
```

## Methods

### `start(event, options?)`

Starts a drag gesture on every `motion` component the controls are passed to, from a `pointerdown` event.

Options:

- `snapToCursor`: Center the element on the pointer when the drag starts. Default: `false`.
- `distanceThreshold`: How far, in pixels, the pointer must move before the drag starts. Default: `3`.

### `stop()`

Ends the drag gesture as if the pointer had been released. The momentum animation still runs, along with any `dragConstraints` and `dragSnapToOrigin` animations, and `onDragEnd` fires.

### `cancel()`

Ends the drag gesture straight away. The element stays where it is, and `onDragEnd` doesn't fire.

```svelte
<svelte:window onkeydown={(event) => event.key === "Escape" && controls.cancel()} />
```
