---
title: Gestures
description: Hover, press, focus, pan and drag gestures that work across mouse, touch and keyboard, with animation props for each.
---

<script>
	import Callout from "#lib/components/callout.svelte";
	import Demo from "#lib/components/demo.svelte";
	import variants from "#lib/demos/gestures/variants.svelte?demo";
	import gestures from "#lib/demos/gestures/gestures.svelte?demo";
	import press from "#lib/demos/gestures/press.svelte?demo";
	import focus from "#lib/demos/gestures/focus.svelte?demo";
	import pan from "#lib/demos/gestures/pan.svelte?demo";
	import drag from "#lib/demos/gestures/drag.svelte?demo";
	import dragConstraints from "#lib/demos/gestures/drag-constraints.svelte?demo";
	import dragLockDirection from "#lib/demos/gestures/drag-lock-direction.svelte?demo";
	import propagation from "#lib/demos/gestures/propagation.svelte?demo";
</script>

`motion` components extend Svelte's event attributes with a set of UI gesture recognisers: hover, press, focus, pan and drag. They also detect when an element enters the viewport, which is covered in [scroll animations](/docs/scroll-animations).

Each gesture has callbacks, and most have a `while` prop that animates the element while the gesture is active.

## Animation props

`motion` components have five gesture animation props: `whileHover`, `whilePress`, `whileFocus`, `whileDrag` and `whileInView`. Each sets a target to animate to while its gesture is active. When the gesture ends, the element animates back.

```svelte
<motion.button
	whileHover={{
		scale: 1.2,
		transition: { duration: 1 },
	}}
	whilePress={{ scale: 0.9 }}
/>
```

Each prop accepts a target, or the name of a variant defined in `variants`. Variants flow down to children as usual, so a gesture on a parent can animate its children too:

```svelte
<script lang="ts">
	import { motion, type Variants } from "motion-sv";

	const button: Variants = {
		rest: { scale: 1 },
		hover: { scale: 1.05 },
		press: { scale: 0.95 },
	};

	const arrow: Variants = {
		rest: { x: 0 },
		hover: { x: 6 },
		press: { x: 12 },
	};
</script>

<motion.button variants={button} initial="rest" whileHover="hover" whilePress="press">
	Continue
	<svg viewBox="0 0 24 24">
		<motion.path d="M5 12h14M13 6l6 6-6 6" variants={arrow} />
	</svg>
</motion.button>
```

<Demo demo={variants} />

## Gestures

Each gesture below can drive an animation, like this box's `whileHover` and `whilePress`:

<Demo demo={gestures} />

### Hover

The hover gesture detects when a pointer moves onto or off an element.

It differs from `pointerenter` and `pointerleave` in that it only fires for real mouse and pen input. Touch screens emulate these events when they're tapped, and hover ignores them.

```svelte
<motion.a
	whileHover={{ scale: 1.2 }}
	onHoverStart={(event, info) => console.log("hover start", info.point)}
	onHoverEnd={(event, info) => console.log("hover end", info.point)}
/>
```

If the pointer leaves while it's pressed down on the element, the hover ends when the pointer is released.

### Press

The press gesture detects when the primary pointer (a left click or the first touch) presses down on an element and is released.

```svelte
<motion.button whilePress={{ scale: 0.9, rotate: 3 }} />
```

`onPressStart` fires when the press starts. When it ends, `onPress` fires if the pointer was released on the element, and `onPressCancel` fires if it was released outside it.

```svelte
<motion.div
	whilePress={{ scale: 0.9, rotate: 3 }}
	onPressStart={() => (status = "Pressing…")}
	onPress={() => (status = "Pressed!")}
	onPressCancel={() => (status = "Cancelled")}
>
	{status}
</motion.div>
```

<Demo demo={press} />

By default, a press has to start on the element. With `globalPressTarget`, a press that starts anywhere on the page counts, and `onPress` fires wherever it's released.

```svelte
<motion.div globalPressTarget whilePress={{ opacity: 0.5 }} />
```

If the pressable element is inside a draggable one and the pointer moves far enough to start a drag, the press doesn't complete: `onPress` doesn't fire.

#### Accessibility

Elements with press gestures are keyboard accessible.

Any element with a press prop can receive focus. If it isn't focusable already, like a `div`, it gets `tabindex="0"`. Once it's focused:

- Pressing `Enter` down triggers `onPressStart` and `whilePress`.
- Releasing `Enter` triggers `onPress`.
- If the element loses focus before `Enter` is released, `onPressCancel` fires.

### Focus

The focus gesture detects when an element gains or loses focus, by the same rules as the [CSS `:focus-visible` selector](https://developer.mozilla.org/en-US/docs/Web/CSS/:focus-visible).

Typically, that's when an `input` receives focus by any means, or when another element receives focus through accessible means, like keyboard navigation.

```svelte
<motion.input whileFocus={{ scale: 1.05 }} />
```

<Demo demo={focus} />

### Pan

The pan gesture recognises when a pointer presses down on an element and moves further than 3 pixels. It ends when the pointer is released.

```svelte
<motion.div onPan={(event, info) => console.log(info.offset.x, info.offset.y)} />
```

Pan callbacks receive the pointer event and an `info` object with:

- `point`: the pointer's position on the page, `x` and `y`.
- `delta`: how far the pointer moved since the last event.
- `offset`: how far the pointer has moved since the pan started.
- `velocity`: the pointer's current velocity.

`onPanStart` fires when the pan starts, `onPan` on every pointer move, and `onPanEnd` when the pointer is released. `onPanSessionStart` fires on the initial pointer down, before the pointer has moved far enough to start a pan.

Pan doesn't move the element by itself, and it has no `while` prop. Here, `onPan` sets a [motion value](/docs/motion-value) that tilts and moves the card, and `onPanEnd` animates it back:

```svelte
<script lang="ts">
	import { animate, motion, useMotionValue, useTransform, type PanInfo } from "motion-sv";

	const x = useMotionValue(0);
	const rotate = useTransform(x, [-200, 200], [-20, 20]);

	function onPan(_event: PointerEvent, info: PanInfo) {
		x.set(info.offset.x);
	}

	function onPanEnd() {
		animate(x, 0, { type: "spring", bounce: 0.4 });
	}
</script>

<motion.div style={{ x, rotate, touchAction: "none" }} {onPan} {onPanEnd} />
```

<Demo demo={pan} height={300} />

<Callout type="note">

For pan to work with touch input, the element must disable touch scrolling on one or both axes, with the [`touch-action`](https://developer.mozilla.org/en-US/docs/Web/CSS/touch-action) CSS property.

</Callout>

### Drag

The drag gesture applies pointer movement to the element's `x` and `y`:

```svelte
<motion.div drag whileDrag={{ scale: 1.2, backgroundColor: "#f00" }} />
```

Set `drag` to `"x"` or `"y"` to drag along one axis only:

```svelte
<motion.div drag="x" />
```

Draggable elements disable text selection and touch scrolling on the axes they drag, so they work on touch screens out of the box. Dragging doesn't start from an `input`, `select` or `textarea` inside the element, so those stay usable.

When the drag ends, the element keeps moving with the velocity it was released at, and decelerates with an inertia animation:

<Demo demo={drag} height={360} />

Disable this by setting `dragMomentum` to `false`, or configure it with `dragTransition`, which accepts [inertia options](/docs/transitions#inertia):

```svelte
<motion.div drag dragTransition={{ bounceStiffness: 600, bounceDamping: 10 }} />
```

Like pan, drag callbacks receive the pointer event and an `info` object with `point`, `delta`, `offset` and `velocity`:

```svelte
<motion.div
	drag
	onDragStart={(event, info) => console.log("start", info.point)}
	onDrag={(event, info) => console.log("drag", info.offset)}
	onDragEnd={(event, info) => console.log("end", info.velocity)}
	onDragTransitionEnd={() => console.log("momentum finished")}
/>
```

#### Constraints

`dragConstraints` limits how far the element can be dragged. It can be an object of `top`, `left`, `right` and `bottom` values, in pixels, relative to the element's starting position:

```svelte
<motion.div drag="x" dragConstraints={{ left: 0, right: 300 }} />
```

Or it can be another element, which the draggable element has to stay within. Get the element with `bind:this`:

```svelte
<script lang="ts">
	import { motion } from "motion-sv";

	let constraints = $state<HTMLElement>();
</script>

<div bind:this={constraints}>
	<motion.div drag dragConstraints={constraints} />
</div>
```

When the constraining element or the draggable element changes size, or the window is resized, Motion measures the constraints again.

By default, the element can be dragged past its constraints with some elasticity, and springs back when released. `dragElastic` sets how much: `0` means no movement past the constraints, and `1` means full movement. It defaults to `0.35`, and can also be an object of `top`, `left`, `right` and `bottom` values.

```svelte
<motion.div drag dragConstraints={constraints} dragElastic={0.2} />
```

<Demo demo={dragConstraints} height={364} />

#### Direction locking

`dragDirectionLock` locks the element to the first axis it's dragged along. Each time a drag starts, Motion detects the direction the pointer moves in, and the element only drags along that axis. `onDirectionLock` receives the axis once it's detected.

```svelte
<motion.div drag dragDirectionLock onDirectionLock={(axis) => console.log(axis)} />
```

<Demo demo={dragLockDirection} height={364} />

#### Snap to origin

`dragSnapToOrigin` animates the element back to where it started when the drag ends. Set it to `"x"` or `"y"` to snap back along one axis only.

```svelte
<motion.div drag dragSnapToOrigin />
```

Used with `dragConstraints`, the element can be dragged within the constraints, and still returns to its origin when released.

#### Drag controls

By default, a drag starts when the pointer presses down on the draggable element. To start it from somewhere else, like a handle or a video scrubber's track, create drag controls with [`useDragControls`](/docs/use-drag-controls) and pass them to `dragControls`:

```svelte
<script lang="ts">
	import { motion, useDragControls } from "motion-sv";

	const controls = useDragControls();
</script>

<div role="presentation" onpointerdown={(event) => controls.start(event)}></div>
<motion.div drag="x" dragControls={controls} dragListener={false} />
```

`dragListener={false}` stops the element itself from starting a drag, so it only drags through the controls.

## Event propagation

Pointer events bubble up through the DOM, so pressing a child element also presses its `motion` ancestors. To stop a child from triggering its ancestors' gestures, stop the event's propagation in the capture phase, with `onpointerdowncapture`:

```svelte
<motion.div whilePress={{ scale: 0.95 }}>
	<button onpointerdowncapture={(event) => event.stopPropagation()}>Press the button</button>
</motion.div>
```

<Demo demo={propagation} />

<Callout type="warning">

Use `onpointerdowncapture` rather than `onpointerdown` here. Svelte delegates `onpointerdown` to the root of the app, so by the time it runs, the event has already passed through the parent and started its gesture.

</Callout>

Drag is the exception, as only one element drags at a time by default: dragging a draggable child doesn't drag its draggable parent. Set `dragPropagation` on both to let them drag together.

```svelte
<motion.div drag dragPropagation>
	<motion.div drag dragPropagation />
</motion.div>
```

## SVG filters

Gestures aren't recognised on SVG `filter` elements, because they have no physical presence on the page and never receive pointer events.

Instead, add the `while` props and handlers to a parent, and animate the filter elements with variants:

```svelte
<motion.svg whileHover="hover">
	<filter id="blur">
		<motion.feGaussianBlur stdDeviation={0} variants={{ hover: { stdDeviation: 2 } }} />
	</filter>
</motion.svg>
```
