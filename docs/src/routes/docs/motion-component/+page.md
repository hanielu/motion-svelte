---
title: motion
description: An HTML or SVG element, supercharged with props for animations, gestures and layout animations.
---

<script>
	import Callout from "#lib/components/callout.svelte";
	import Demo from "#lib/components/demo.svelte";
	import svg from "#lib/demos/motion-component/svg.svelte?demo";
	import customComponent from "#lib/demos/motion-component/custom-component.svelte?demo";
	import dynamicVariants from "#lib/demos/motion-component/dynamic-variants.svelte?demo";
</script>

The `motion` component drives most animations in motion-sv. There's one for every HTML and SVG element, like `motion.div`, `motion.button` and `motion.circle`. Think of it as a normal element, supercharged for 120fps animations and gestures.

## Usage

Import `motion` from `motion-sv`:

```svelte
<script lang="ts">
	import { motion } from "motion-sv";
</script>
```

Now you can use it exactly as you would a normal element:

```svelte
<motion.div class="box" />
```

It also accepts props like `animate`, `whileHover` and `whileInView`:

```svelte
<motion.div
	class="box"
	animate={{ scale: 2 }}
	whileInView={{ opacity: 1 }}
	style={{ x: 100 }}
/>
```

Here, `animate` animates the element whenever its values change, `whileInView` fades it in while it's in the viewport, and `style` sets `x`, one of the independent transforms that set part of `transform` without touching the rest.

Read [the animation guide](/docs/animation) for a full overview of animating with motion-sv. To animate an element's layout, render it through a layout namespace instead, as explained in [layout animations](/docs/layout-animations).

### SVG

SVG elements have `motion` components too. They can animate attributes like `cx` and `r`, as well as three values for drawing lines: `pathLength`, `pathSpacing` and `pathOffset`, each set as a progress between `0` and `1`.

```svelte
<motion.svg viewBox="0 0 100 100">
	<motion.circle
		cx="50"
		cy="50"
		r="40"
		initial={{ pathLength: 0 }}
		animate={{ pathLength: 1 }}
	/>
</motion.svg>
```

<Demo demo={svg} />

On SVG elements, `x`, `y` and `scale` are transforms, like on HTML elements. To animate the `x`, `y` and `scale` attributes instead, use `attrX`, `attrY` and `attrScale`.

### Custom components

`motion.create()` turns any Svelte component into a `motion` component:

```svelte
<script lang="ts">
	import { motion } from "motion-sv";
	import Button from "./button.svelte";

	const MotionButton = motion.create(Button);
</script>

<MotionButton whileHover={{ scale: 1.1 }}>Click me</MotionButton>
```

The component must spread its props onto the element it renders. Along with the element's attributes, Motion passes it an [attachment](https://svelte.dev/docs/svelte/@attach), and that's how Motion gets hold of the element to animate it.

```svelte
<!-- button.svelte -->
<script lang="ts">
	import type { HTMLButtonAttributes } from "svelte/elements";

	let { children, ...props }: HTMLButtonAttributes = $props();
</script>

<button {...props}>
	{@render children?.()}
</button>
```

<Demo demo={customComponent} />

<Callout type="warning">

Call `motion.create()` once, at the top level of a `<script>` or in a module, rather than in markup or in reactive code that re-runs. Each call with a component returns a new one, and rendering a new component remounts the element, which breaks its animations.

</Callout>

`motion.create()` also accepts a tag name, which is useful for custom elements:

```svelte
<script lang="ts">
	// Renders <custom-element>
	const MotionCustomElement = motion.create("custom-element");
</script>
```

Motion's own props, like `animate` and `whileHover`, aren't passed on to the component. To receive them too, for instance to read `animate` inside the component, set `forwardMotionProps`:

```typescript
const MotionCard = motion.create(Card, { forwardMotionProps: true });
```

The component should then take those props out before spreading the rest onto its element, or they'll end up as attributes in the DOM.

<Callout type="note">

Svelte only runs transitions on elements, so a component made with `motion.create()` can't play an [`exit`](/docs/animate-presence) animation: it leaves the page straight away. To animate it out, wrap it in a `motion` element with the `exit` animation.

</Callout>

### Changing the element

For a fixed element, use its own component, like `motion.section`. When the tag is chosen at runtime, the `as` prop changes the element a `motion` component renders:

```svelte
<motion.div as="section" animate={{ opacity: 1 }} />
```

### Performance

`motion` components animate values outside Svelte's reactivity, so a running animation doesn't update any state or re-run any of your code.

Updating `style` with [motion values](/docs/motion-value) instead of `$state` avoids Svelte updates too:

```svelte
<script lang="ts">
	import { motion, useMotionValue } from "motion-sv";

	const x = useMotionValue(0);

	$effect(() => {
		// Moves the element without updating any Svelte state
		const timeout = setTimeout(() => x.set(100), 1000);
		return () => clearTimeout(timeout);
	});
</script>

<motion.div style={{ x }} />
```

### Server-side rendering

`motion` components work with server-side rendering. The server renders each element with the styles of its initial state, so the page doesn't change when it hydrates.

```svelte
<!-- The server renders transform: translateX(100px) -->
<motion.div initial={false} animate={{ x: 100 }} />
```

## Props

`motion` components accept the following props, along with any attribute or event handler of the element they render.

### Animation

#### initial

The initial visual state of the `motion` component.

It can be set as an animation target:

```svelte
<motion.section initial={{ opacity: 0, x: 0 }} />
```

As a variant label, or several:

```svelte
<motion.li initial="visible" />

<motion.div initial={["visible", "active"]} />
```

Or as `false`, to disable the enter animation and render the element with the values in `animate`:

```svelte
<motion.div initial={false} animate={{ opacity: 0 }} />
```

#### animate

A target to animate to when the element enters, and whenever the target changes.

It can be set as an animation target:

```svelte
<motion.div
	initial={{ boxShadow: "0px 0px #000" }}
	animate={{ boxShadow: "10px 10px #000" }}
/>
```

As a variant label, or several:

```svelte
<motion.li animate="visible" />

<motion.div initial="hidden" animate={["visible", "active"]} />
```

Or as animation controls from `useAnimationControls()`, to start animations manually. See [animation controls](/docs/animation#animation-controls).

#### exit

A target to animate to when the element is removed. It can be set as an animation target or variant label.

Svelte removes elements straight away, so the element must be inside [`AnimatePresence`](/docs/animate-presence), which keeps it on the page while it animates out:

```svelte
<AnimatePresence>
	{#if isVisible}
		<motion.div exit={{ opacity: 0 }} />
	{/if}
</AnimatePresence>
```

#### transition

The default transition for this component, used by any animation prop (`animate`, `whileHover` and so on) whose target has no `transition` of its own.

```svelte
<motion.div transition={{ type: "spring" }} animate={{ scale: 1.2 }} />
```

See [transitions](/docs/transitions) for all the options.

#### variants

The [variants](/docs/animation#variants) for this component: named targets that `initial`, `animate` and the gesture props can refer to by name.

```svelte
<script lang="ts">
	import { motion, type Variants } from "motion-sv";

	let { isActive }: { isActive: boolean } = $props();

	const variants: Variants = {
		active: {
			backgroundColor: "#f00",
		},
		inactive: {
			backgroundColor: "#fff",
			transition: { duration: 2 },
		},
	};
</script>

<motion.div {variants} animate={isActive ? "active" : "inactive"} />
```

#### style

The element's inline styles, as an object. It works like the `style` attribute, with added support for [motion values](/docs/motion-value) and independent transforms like `x`, `rotate` and `originX`.

```svelte
<script lang="ts">
	import { motion, useMotionValue } from "motion-sv";

	const x = useMotionValue(30);
</script>

<motion.div style={{ x, rotate: 90, originX: 0.5 }} />
```

Unitless numbers get `px` where the style needs a unit, so `{ width: 100 }` renders `width: 100px`.

#### onUpdate

Callback that fires every frame in which any value on the component updates. It receives the latest values.

```svelte
<motion.article
	animate={{ opacity: 1 }}
	onUpdate={(latest) => console.log(latest.opacity)}
/>
```

#### onAnimationStart

Callback that fires when an animation starts, except for layout animations (see [`onLayoutAnimationStart`](#onlayoutanimationstart)). It receives the target or variant label that started animating.

```svelte
<motion.circle
	animate={{ r: 10 }}
	onAnimationStart={(definition) => console.log("Started", definition)}
/>
```

#### onAnimationComplete

Callback that fires when an animation completes, except for layout animations (see [`onLayoutAnimationComplete`](#onlayoutanimationcomplete)). It receives the target or variant label that finished animating.

```svelte
<motion.circle
	animate={{ r: 10 }}
	onAnimationComplete={(definition) => console.log("Completed", definition)}
/>
```

### Hover

#### whileHover

A target or variant label to animate to while the pointer hovers over the element. Hover ignores touch input, so it isn't triggered by touch screen taps.

```svelte
<!-- As a target -->
<motion.button whileHover={{ scale: 1.2 }} />

<!-- As a variant label -->
<motion.div whileHover="hovered" />
```

#### onHoverStart

Callback that fires when a pointer starts hovering over the element. It receives the triggering `PointerEvent` and an `info` object with the pointer's `point`.

```svelte
<motion.div onHoverStart={(event) => console.log(event)} />
```

#### onHoverEnd

Callback that fires when a pointer stops hovering over the element. It receives the triggering `PointerEvent` and `info`.

```svelte
<motion.div onHoverEnd={(event) => console.log(event)} />
```

### Press

Press is the gesture Motion for React calls tap, as in `whileTap`. It works with pointers, and with the Enter key when the element has focus.

#### whilePress

A target or variant label to animate to while the element is pressed.

```svelte
<!-- As a target -->
<motion.button whilePress={{ scale: 0.9 }} />

<!-- As a variant label -->
<motion.div whilePress="pressed" />
```

#### onPressStart

Callback that fires when a pointer starts pressing the element. It receives the triggering `PointerEvent` and an `info` object with the pointer's `point`.

```svelte
<motion.div onPressStart={(event) => console.log(event)} />
```

#### onPress

Callback that fires when a press ends with the pointer released inside the element. It receives the triggering `PointerEvent` and `info`.

```svelte
<motion.div onPress={(event) => console.log(event)} />
```

#### onPressCancel

Callback that fires when a press ends with the pointer released outside the element. It receives the triggering `PointerEvent` and `info`.

```svelte
<motion.div onPressCancel={(event) => console.log(event)} />
```

#### globalPressTarget

Default: `false`

If `true`, the press starts from a `pointerdown` anywhere in the window, rather than only on the element.

```svelte
<motion.div globalPressTarget whilePress={{ scale: 0.9 }} />
```

### Focus

#### whileFocus

A target or variant label to animate to while the element has focus. It follows `:focus-visible`, the same rule browsers use to decide when to show a focus ring.

```svelte
<!-- As a target -->
<motion.button whileFocus={{ outline: "dashed #000" }} />

<!-- As a variant label -->
<motion.div whileFocus="focused" />
```

### Pan

The pan gesture recognises a pointer pressing down on the element and moving at least 3 pixels. Unlike drag, it doesn't move the element.

<Callout type="note">

For pan gestures to work with touch input, disable touch scrolling on the element on at least one axis with the `touch-action` CSS rule, for instance `touch-action: pan-y` to keep vertical scrolling.

</Callout>

Pan and drag callbacks receive the triggering `PointerEvent` and an `info` object, with `x` and `y` values for:

- `point`: the pointer's position on the page.
- `delta`: the distance moved since the last event.
- `offset`: the distance moved since the gesture started.
- `velocity`: the current velocity of the pointer.

#### onPan

Callback that fires every time the pointer moves during a pan gesture.

```svelte
<script lang="ts">
	import { motion, type PanInfo } from "motion-sv";

	function onPan(event: PointerEvent, info: PanInfo) {
		console.log(info.point.x, info.point.y);
	}
</script>

<motion.div {onPan} />
```

#### onPanStart

Callback that fires when a pan gesture starts.

```svelte
<motion.div onPanStart={(event, info) => console.log(info.delta.x)} />
```

#### onPanEnd

Callback that fires when a pan gesture ends.

```svelte
<motion.div onPanEnd={(event, info) => console.log(info.offset.x)} />
```

#### onPanSessionStart

Callback that fires as soon as a pointer presses down on the element, before it has moved far enough to start a pan gesture.

```svelte
<motion.div onPanSessionStart={(event, info) => console.log(info.point.x)} />
```

### Drag

#### drag

Default: `false`

Makes the element draggable. Set `true` to drag in both directions, or `"x"` or `"y"` to drag along one axis only.

```svelte
<motion.div drag />
```

#### whileDrag

A target or variant label to animate to while the element is dragged.

```svelte
<!-- As a target -->
<motion.div drag whileDrag={{ scale: 0.9 }} />

<!-- As a variant label -->
<motion.div drag whileDrag="dragging" />
```

#### dragConstraints

Limits the area the element can be dragged within.

Set it as an object of optional `top`, `left`, `right` and `bottom` values, in pixels, relative to the element's starting position:

```svelte
<motion.div drag="x" dragConstraints={{ left: 0, right: 300 }} />
```

Or as an element, whose bounding box the dragged element stays within. Bind it with `bind:this`:

```svelte
<script lang="ts">
	import { motion } from "motion-sv";

	let container = $state<HTMLElement>();
</script>

<div bind:this={container}>
	<motion.div drag dragConstraints={container} />
</div>
```

#### dragSnapToOrigin

Default: `false`

If `true`, the element animates back to where it started when it's released. Set `"x"` or `"y"` to snap back along one axis only.

```svelte
<motion.div drag dragSnapToOrigin />
```

#### dragElastic

Default: `0.35`

How far the element can move beyond its constraints: `0` for no movement, `1` for full movement. Set `false` to disable movement beyond the constraints.

Pass an object of `top`, `right`, `bottom` and `left` values to set each side separately. Missing sides default to `0`.

```svelte
<motion.div drag dragConstraints={{ left: 0, right: 300 }} dragElastic={0.2} />
```

#### dragMomentum

Default: `true`

Whether the element keeps moving with the gesture's momentum when it's released.

```svelte
<motion.div drag dragConstraints={{ left: 0, right: 300 }} dragMomentum={false} />
```

#### dragTransition

Configures the momentum animation that starts when the element is released. It's an [inertia](/docs/transitions) animation based on the drag velocity, so it accepts inertia options like `power`, `timeConstant`, `bounceStiffness` and `bounceDamping`.

```svelte
<motion.div drag dragTransition={{ bounceStiffness: 600, bounceDamping: 10 }} />
```

#### dragDirectionLock

Default: `false`

Locks dragging to the first direction the pointer moves in. For instance, if the pointer moves further along the `x` axis than the `y` axis before the drag starts, the element only drags along `x` for the rest of the gesture.

```svelte
<motion.div drag dragDirectionLock />
```

#### dragPropagation

Default: `false`

Lets other draggable elements, like a draggable parent, drag along with this one. By default, the first element to start dragging stops any others from dragging during the same gesture.

```svelte
<motion.div drag="x" dragPropagation />
```

#### dragControls

Dragging usually starts by pressing down on the element itself. For some interfaces, like a video scrubber that jumps to wherever you press, you might want to start it from another element instead.

Create drag controls with [`useDragControls`](/docs/use-drag-controls) and pass them to `dragControls`. Their `start` method starts dragging from a pointer event on any element:

```svelte
<script lang="ts">
	import { motion, useDragControls } from "motion-sv";

	const dragControls = useDragControls();

	function startDrag(event: PointerEvent) {
		dragControls.start(event, { snapToCursor: true });
	}
</script>

<div role="presentation" onpointerdown={startDrag}></div>
<motion.div drag="x" {dragControls} />
```

<Callout type="note">

When drag controls start the gesture, you can stop the element itself from starting it with `dragListener={false}`.

</Callout>

#### dragListener

Default: `true`

Whether pressing down on the element starts dragging it. Set `false` with `dragControls` so only the controls can start the gesture.

```svelte
<motion.div drag="x" {dragControls} dragListener={false} />
```

#### onDrag

Callback that fires every time the pointer moves during a drag gesture. It receives the triggering `PointerEvent` and `info`, [like pan callbacks](#pan).

```svelte
<script lang="ts">
	import { motion, type PanInfo } from "motion-sv";

	function onDrag(event: PointerEvent, info: PanInfo) {
		console.log(info.point.x, info.point.y);
	}
</script>

<motion.div drag {onDrag} />
```

#### onDragStart

Callback that fires when a drag gesture starts. It receives the triggering `PointerEvent` and `info`.

```svelte
<motion.div drag onDragStart={(event, info) => console.log(info.point.x)} />
```

#### onDragEnd

Callback that fires when a drag gesture ends. It receives the triggering `PointerEvent` and `info`.

```svelte
<motion.div drag onDragEnd={(event, info) => console.log(info.velocity.x)} />
```

#### onDirectionLock

Callback that fires when the drag direction is locked with `dragDirectionLock`. It receives the locked axis, `"x"` or `"y"`.

```svelte
<motion.div drag dragDirectionLock onDirectionLock={(axis) => console.log(axis)} />
```

#### onDragTransitionEnd

Callback that fires when the momentum animation after a drag finishes.

```svelte
<motion.div drag onDragTransitionEnd={() => console.log("Drag transition complete")} />
```

#### onMeasureDragConstraints

Callback that fires when `dragConstraints` is an element and its constraints are measured. It receives the constraints as `top`, `left`, `right` and `bottom` values, and can return new ones to use instead.

```svelte
<motion.div
	drag
	dragConstraints={container}
	onMeasureDragConstraints={(constraints) => ({ ...constraints, top: 0 })}
/>
```

### Viewport

#### whileInView

A target or variant label to animate to while the element is in the viewport.

```svelte
<!-- As a target -->
<motion.div whileInView={{ opacity: 1 }} />

<!-- As a variant label -->
<motion.div whileInView="visible" />
```

#### inViewOptions

Options for how the element is tracked within the viewport.

```svelte
<motion.section whileInView={{ opacity: 1 }} inViewOptions={{ once: true }} />
```

- `once`: if `true`, the element stays in view once it has entered the viewport, and leaving it has no effect.
- `root`: an ancestor element to detect intersections with, instead of the viewport. Bind it with `bind:this`.
- `margin`: a margin added to the viewport, or `root`, to grow or shrink the detection area. Defaults to `"0px"`. Use several values to set each side, like `"0px -20px 0px 100px"`.
- `amount`: how much of the element must be in view for it to count as entered: `"some"`, `"all"` or a number between `0` and `1`. Defaults to `"some"`.
- `useClipPathWorkaround`: Chrome doesn't report elements as in view while a `clipPath` hides them completely, which stops `clipPath` reveal animations from starting. If `true`, Motion leaves out a fully clipping `clipPath` from the element's style until it's in view, while still animating from it.

[`MotionConfig`](/docs/motion-config) can set default `inViewOptions` for all the components inside it.

#### onViewportEnter

Callback that fires when the element enters the viewport. It receives the [`IntersectionObserverEntry`](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserverEntry) with the details of the intersection.

```svelte
<motion.div onViewportEnter={(entry) => console.log(entry?.isIntersecting)} />
```

#### onViewportLeave

Callback that fires when the element leaves the viewport. It receives the [`IntersectionObserverEntry`](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserverEntry) for the change.

```svelte
<motion.div onViewportLeave={(entry) => console.log(entry?.intersectionRatio)} />
```

### Layout

In motion-sv, elements animate their layout when they're rendered through a layout namespace from `createLayoutMotion()`, and its `update()` is called with the state change. Read [layout animations](/docs/layout-animations) first. These props configure them.

#### layout

Default: `false`, or `true` for components rendered through a layout namespace.

Which part of the layout animates. `true` animates both size and position. Set `"position"` or `"size"` to animate only the element's position or only its size:

```svelte
<layout.img layout="position" {src} alt="" />
```

`"preserve-aspect"` animates both while the element's aspect ratio stays about the same, and only its position when the aspect ratio changes.

#### layoutId

When an element with a `layoutId` mounts while another with the same `layoutId` leaves, it animates out from the old element's size and position. This works without a layout namespace or `update()`.

```svelte
{#each tabs as tab (tab)}
	<button onclick={() => (selected = tab)}>
		{tab}
		{#if tab === selected}
			<motion.div layoutId="underline" />
		{/if}
	</button>
{/each}
```

If the old element stays on the page, the two crossfade. See [shared layout animations](/docs/layout-animations#shared-layout-animations).

#### layoutDependency

In motion-sv, `update()` decides when layout is measured, so `layoutDependency` doesn't. It only affects `layoutId` handoffs: an element that takes over a `layoutId` from one with the same `layoutDependency` doesn't animate from it.

#### layoutScroll

For layout animations to work within a scrollable element, Motion needs to measure its scroll offset. For performance, it doesn't measure the scroll offset of every ancestor, so add `layoutScroll` to scrollable elements that contain layout animations.

```svelte
<motion.div layoutScroll style={{ overflow: "scroll" }}>
	<layout.div />
</motion.div>
```

#### layoutRoot

For layout animations to work within a `position: fixed` element, Motion needs to account for the page's scroll. Add `layoutRoot` to mark the element as fixed.

```svelte
<motion.div layoutRoot style={{ position: "fixed" }}>
	<layout.div />
</motion.div>
```

#### crossfade

Set `false` to stop a `layoutId` element crossfading with the element it takes over from. The old element is hidden straight away instead.

```svelte
<motion.div layoutId="modal" crossfade={false} />
```

#### onLayoutAnimationStart

Callback that fires when a layout animation starts.

#### onLayoutAnimationComplete

Callback that fires when a layout animation completes.

#### onBeforeLayoutMeasure

Callback that fires right before the element's layout is measured.

#### onLayoutMeasure

Callback that fires when the element's layout has been measured. It receives the new layout box and, if there is one, the previous one.

### Advanced

#### inherit

Set `false` to stop the component inheriting variant changes from its parent, or propagating them to its children.

```svelte
<motion.div inherit={false} />
```

#### custom

Custom data to pass to dynamic variants. A variant can be a function, which receives the component's `custom` value and returns a target.

```svelte
<script lang="ts">
	import { motion, type Variants } from "motion-sv";

	const variants: Variants = {
		visible: (index: number) => ({
			opacity: 1,
			transition: { delay: index * 0.2 },
		}),
	};
</script>

<motion.ul initial="hidden" animate="visible">
	<motion.li custom={0} {variants} />
	<motion.li custom={1} {variants} />
	<motion.li custom={2} {variants} />
</motion.ul>
```

<Demo demo={dynamicVariants} height={300} />

#### transformTemplate

By default, Motion applies transforms in the order translate, scale, rotate, skew.

To change this, set `transformTemplate` to a function that receives the latest transform values and the generated transform string, and returns a new transform string.

```svelte
<!-- Use the latest transform values -->
<motion.div
	style={{ x: 0, rotate: 180 }}
	transformTemplate={({ x, rotate }) => `rotate(${rotate}deg) translateX(${x}px)`}
/>

<!-- Or the generated transform string -->
<motion.div
	style={{ x: 0, rotate: 180 }}
	transformTemplate={(latest, generated) => `translate(-50%, -50%) ${generated}`}
/>
```

#### ref

The rendered element, which you can bind with `bind:ref`. It's set when the element mounts, and back to `null` when it unmounts.

```svelte
<script lang="ts">
	import { motion } from "motion-sv";

	let element = $state<HTMLElement | SVGElement | null>(null);
</script>

<motion.div bind:ref={element} />
```

`bind:this` on a `motion` component binds the component, not the element, so use `bind:ref` instead.

#### class

The element's classes. Like on a plain element, it accepts Svelte's [class arrays and objects](https://svelte.dev/docs/svelte/class):

```svelte
<motion.div class={["card", { active: isActive }]} />
```

Svelte scopes a component's styles to the elements in its own markup, and doesn't apply them to elements a `motion` component renders. Style them through a parent with `:global()`, like `.list :global(.card)`.
