---
title: Transitions
description: Configure how values animate, with tweens, springs and inertia, plus delays, repeats and orchestration.
---

<script>
	import Callout from "#lib/components/callout.svelte";
	import Demo from "#lib/components/demo.svelte";
	import transition from "#lib/demos/transitions/transition.svelte?demo";
	import spring from "#lib/demos/transitions/spring.svelte?demo";
	import inertia from "#lib/demos/transitions/inertia.svelte?demo";
	import repeat from "#lib/demos/transitions/repeat.svelte?demo";
	import variants from "#lib/demos/animation/variants.svelte?demo";
	import appStore from "#lib/demos/layout-animations/app-store.svelte?demo";
</script>

A transition defines the kind of animation used when a value animates from one state to another.

```typescript
import type { Transition } from "motion-sv";

const transition: Transition = {
	duration: 0.8,
	delay: 0.5,
	ease: [0, 0.71, 0.2, 1.01],
};
```

Pass it to a `motion` component's `transition` prop:

```svelte
<motion.div animate={{ x: 100 }} {transition} />
```

The same options work with the [`animate`](https://motion.dev/docs/animate) function:

```typescript
animate(".box", { x: 100 }, transition);
```

<Demo demo={transition} />

## Setting a transition

Every animation target accepts a `transition`, which is used when that animation runs. That includes `animate`, `exit`, variants and the gesture props:

```svelte
<motion.div
	whileHover={{
		scale: 1.1,
		transition: { duration: 0.2 },
	}}
/>
```

When the hover ends, the element animates back with the transition of the state it returns to.

### Value-specific transitions

When several values animate, each one can have its own transition. `default` applies to every value without one:

```svelte
<motion.li
	animate={{
		x: 0,
		opacity: 1,
		transition: {
			default: { type: "spring" },
			opacity: { ease: "linear" },
		},
	}}
/>
```

The same object works with the `animate` function:

```typescript
animate(
	"li",
	{ x: 0, opacity: 1 },
	{
		default: { type: "spring" },
		opacity: { ease: "linear" },
	}
);
```

### Default transitions

The `transition` prop sets the default transition for a component. Its animations use it whenever their target doesn't define a transition of its own:

```svelte
<motion.div animate={{ x: 100 }} transition={{ type: "spring", stiffness: 100 }} />
```

To set a default for a whole group of components, use [`MotionConfig`](/docs/motion-config):

```svelte
<script lang="ts">
	import { MotionConfig } from "motion-sv";
</script>

<MotionConfig transition={{ duration: 0.4, ease: "easeInOut" }}>
	<App />
</MotionConfig>
```

So Motion looks for a transition in this order: the animation target's `transition`, then the component's `transition` prop, then the transition of the closest `MotionConfig`. The first one it finds replaces the others entirely. When none is set, it picks a default that suits the value: a spring for physical values like `x` and `scale`, and a short tween for values like `opacity` and `color`.

### Inheriting transitions

Set `inherit: true` to merge a transition with the less specific one it would otherwise replace, rather than replacing it. Its own options win.

A target's transition can inherit from the component's `transition` prop:

```svelte
<motion.div
	transition={{ duration: 1, ease: "easeOut" }}
	whileHover={{
		scale: 1.1,
		// duration: 0.2, ease: "easeOut"
		transition: { inherit: true, duration: 0.2 },
	}}
/>
```

And a value-specific transition can inherit from the transition around it:

```svelte
<motion.div
	animate={{ x: 100, opacity: 1 }}
	transition={{
		duration: 0.5,
		ease: "linear",
		// duration: 1, ease: "linear"
		x: { inherit: true, duration: 1 },
	}}
/>
```

## Transition settings

#### type

Default: dynamic

`type` decides the kind of animation. It can be `"tween"`, `"spring"` or `"inertia"`.

**Tween** animations have a duration and an easing curve.

**Spring** animations are either physics-based or duration-based:

- Physics-based springs are set with `stiffness`, `damping` and `mass`. They incorporate the velocity of any existing gesture or animation, so they feel natural to interact with.
- Duration-based springs are set with `visualDuration` (or `duration`) and `bounce`. They don't incorporate velocity, but they're easier to reason about.

<Demo demo={appStore} height={700} />

**Inertia** animations decelerate a value based on its initial velocity. They're mostly used to implement inertial scrolling, and they power the momentum at the end of a drag.

```svelte
<motion.path animate={{ pathLength: 1 }} transition={{ duration: 2, type: "tween" }} />
```

Set `type: false` to make the animation instant.

### Tween

#### duration

Default: `0.3` (or `0.8` if there are more than two keyframes)

The duration of the animation, in seconds. Setting it on a `"spring"` makes the spring duration-based.

```typescript
animate("ul > li", { opacity: 1 }, { duration: 1 });
```

#### ease

The easing function to use with tween animations. It accepts:

- An easing function name, like `"linear"`.
- An array of four numbers that defines a cubic bezier curve, like `[0.17, 0.67, 0.83, 0.67]`.
- A [JavaScript easing function](https://motion.dev/docs/easing-functions), which takes and returns a value between `0` and `1`.

The available easing function names are:

- `"linear"`
- `"easeIn"`, `"easeOut"`, `"easeInOut"`
- `"circIn"`, `"circOut"`, `"circInOut"`
- `"backIn"`, `"backOut"`, `"backInOut"`
- `"anticipate"`

```svelte
<script lang="ts">
	import { cubicBezier, motion } from "motion-sv";

	const ease = cubicBezier(0.35, 0.17, 0.3, 0.86);
</script>

<motion.div animate={{ x: 100 }} transition={{ ease }} />
```

When animating keyframes, `ease` can be an array, with a different easing between each pair of keyframes:

```svelte
<motion.div
	animate={{
		x: [0, 100, 0],
		transition: { ease: ["easeIn", "easeOut"] },
	}}
/>
```

#### times

When animating keyframes, `times` positions each keyframe in the animation.

Each value is a progress value between `0` (the start of the animation) and `1` (the end):

```svelte
<motion.div
	animate={{
		x: [0, 100, 0],
		transition: { times: [0, 0.3, 1] },
	}}
/>
```

There must be as many `times` as there are keyframes. By default, keyframes are spread evenly.

### Spring

Drag the sliders to try `visualDuration` and `bounce`, then click the track:

<Demo demo={spring} height={300} />

#### bounce

Default: `0.3`

The bounciness of a duration-based spring, from `-1` to `1`.

`0` means no bounce (critically damped) and `1` is extremely bouncy. Negative values, down to `-1`, make the spring overdamped: it starts faster, then settles more slowly into its target, without overshooting. A negative `bounce` changes the shape of the motion, not its timing: the spring still arrives at the same time as one with a `bounce` of `0`.

```svelte
<motion.div animate={{ rotateX: 90 }} transition={{ type: "spring", bounce: 0.25 }} />
```

<Callout type="note">

`bounce` and `duration` are ignored if `stiffness`, `damping` or `mass` are set.

</Callout>

#### visualDuration

The time, in seconds, that the spring takes to visually reach its target. The bulk of the motion happens within this time, and the bouncy part mostly happens after it. When set, it overrides `duration`.

This makes springs easier to edit, and to coordinate with other, time-based animations.

```svelte
<motion.div
	animate={{ rotateX: 90 }}
	transition={{ type: "spring", visualDuration: 0.5, bounce: 0.25 }}
/>
```

<Callout type="tip">

Set `bounce` along with `visualDuration`, even if it's `0`. A spring without `bounce` or `duration` is physics-based, and ignores `visualDuration`.

</Callout>

#### damping

Default: `10`

The strength of the opposing force. At `0`, the spring oscillates forever.

```svelte
<motion.a animate={{ rotate: 180 }} transition={{ type: "spring", damping: 300 }} />
```

#### mass

Default: `1`

The mass of the moving object. Higher values make the movement more lethargic.

```svelte
<motion.feTurbulence animate={{ baseFrequency: 0.5 }} transition={{ type: "spring", mass: 0.5 }} />
```

#### stiffness

Default: `100`

The stiffness of the spring. Higher values make the movement more sudden.

```svelte
<motion.section animate={{ rotate: 180 }} transition={{ type: "spring", stiffness: 50 }} />
```

#### velocity

Default: the value's current velocity

The initial velocity of the spring.

```svelte
<motion.div animate={{ rotate: 180 }} transition={{ type: "spring", velocity: 2 }} />
```

#### restSpeed

Default: `2`, or `0.01` for values that move less than 5 units, like `opacity` and `scale`

The animation ends once its absolute speed, in units per second, drops below this value, and its distance from the target is below `restDelta`.

```svelte
<motion.div animate={{ rotate: 180 }} transition={{ type: "spring", restSpeed: 0.5 }} />
```

#### restDelta

Default: `0.5`, or `0.005` for values that move less than 5 units

The animation ends once its distance from the target drops below this value, and its speed is below `restSpeed`.

```svelte
<motion.div animate={{ rotate: 180 }} transition={{ type: "spring", restDelta: 0.5 }} />
```

### Inertia

An inertia animation decelerates a value based on its initial velocity. Optionally, set `min` and `max` boundaries, and the value springs back to them when it goes past.

Inertia calculates a target value up front from the velocity and `power`. You can change that target with `modifyTarget`, for instance to snap it to a grid.

Inertia is also the animation that runs at the end of a drag, and you configure it with the [`dragTransition`](/docs/gestures#drag) prop. Here, `modifyTarget` makes the handle always come to rest on a tick:

<Demo demo={inertia} />

#### power

Default: `0.8`

A higher power calculates a target further away.

```svelte
<motion.div drag dragTransition={{ power: 0.2 }} />
```

#### timeConstant

Default: `325`

The duration of the deceleration, in milliseconds. Changing it changes how the motion feels.

```svelte
<motion.div drag dragTransition={{ timeConstant: 200 }} />
```

#### modifyTarget

A function that receives the calculated target and returns a new one. Useful for snapping the target to a grid.

```svelte
<motion.div
	drag
	dragTransition={{
		power: 0,
		// Snap the calculated target to the nearest 50 pixels
		modifyTarget: (target) => Math.round(target / 50) * 50,
	}}
/>
```

#### min

The minimum boundary. The value "bumps" against it, or springs to it straight away if the animation starts below it.

```svelte
<motion.div drag dragTransition={{ min: 0, max: 100 }} />
```

#### max

The maximum boundary. The value "bumps" against it, or springs to it straight away if the animation starts above it.

```svelte
<motion.div drag dragTransition={{ min: 0, max: 100 }} />
```

#### bounceStiffness

Default: `500`

The stiffness of the spring that bounces the value off `min` or `max`. Higher values make the movement more sudden.

```svelte
<motion.div drag dragTransition={{ min: 0, max: 100, bounceStiffness: 100 }} />
```

#### bounceDamping

Default: `10`

The damping of the spring that bounces the value off `min` or `max`. At `0`, the spring oscillates forever.

```svelte
<motion.div drag dragTransition={{ min: 0, max: 100, bounceDamping: 8 }} />
```

<Callout type="note">

Drag momentum starts from its own defaults, tuned for dragging, like a `timeConstant` of `750` and a bounce off the [drag constraints](/docs/gestures#constraints) that follows `dragElastic`. Anything you set in `dragTransition` overrides them.

</Callout>

### Orchestration

#### delay

Default: `0`

Delays the animation by this duration, in seconds.

```typescript
animate(element, { filter: "blur(10px)" }, { delay: 0.3 });
```

A negative `delay` starts the animation that far in. For instance, `delay: -1` starts it one second in.

#### repeat

Default: `0`

The number of times to repeat the transition. Set it to `Infinity` to repeat forever.

```svelte
<motion.div animate={{ rotate: 180 }} transition={{ repeat: Infinity, duration: 2 }} />
```

#### repeatType

Default: `"loop"`

How to repeat the animation:

- `"loop"`: repeats the animation from the start.
- `"reverse"`: alternates between playing forwards and backwards.
- `"mirror"`: swaps the origin and target on each repetition.

```svelte
<motion.div
	animate={{ rotate: 180 }}
	transition={{ repeat: 1, repeatType: "reverse", duration: 2 }}
/>
```

With an asymmetric easing curve like `"easeIn"`, the difference between `"reverse"` and `"mirror"` is easy to see: `"reverse"` plays the curve backwards, while `"mirror"` plays it forwards from the other end.

<Demo demo={repeat} />

#### repeatDelay

Default: `0`

The time to wait between repetitions, in seconds.

```svelte
<motion.div animate={{ rotate: 180 }} transition={{ repeat: Infinity, repeatDelay: 1 }} />
```

#### when

Default: `false`

With [variants](/docs/animation#variants), when this animation runs relative to the animations of its children:

- `"beforeChildren"`: the children animate after this animation finishes.
- `"afterChildren"`: this animation runs after the children's animations finish.

```svelte
<script lang="ts">
	import { motion, type Variants } from "motion-sv";

	const list: Variants = {
		hidden: {
			opacity: 0,
			transition: { when: "afterChildren" },
		},
	};

	const item: Variants = {
		hidden: {
			opacity: 0,
			transition: { duration: 2 },
		},
	};
</script>

<motion.ul variants={list} animate="hidden">
	<motion.li variants={item} />
	<motion.li variants={item} />
</motion.ul>
```

#### delayChildren

Default: `0`

With variants, delays the children's animations by this duration, in seconds.

```svelte
<script lang="ts">
	import { motion, type Variants } from "motion-sv";

	const container: Variants = {
		hidden: { opacity: 0 },
		show: {
			opacity: 1,
			transition: { delayChildren: 0.5 },
		},
	};

	const item: Variants = {
		hidden: { opacity: 0 },
		show: { opacity: 1 },
	};
</script>

<motion.ul variants={container} initial="hidden" animate="show">
	<motion.li variants={item} />
	<motion.li variants={item} />
</motion.ul>
```

With the [`stagger`](https://motion.dev/docs/stagger) function, the delay is spread across the children:

```typescript
const transition = {
	delayChildren: stagger(0.1),
};
```

By default, the stagger runs from the first child to the last. Its `from` option starts it from the `"last"` child, the `"center"`, or a specific index instead:

```typescript
const transition = {
	delayChildren: stagger(0.1, { from: "last" }),
};
```

<Demo demo={variants} height={400} />

<Callout type="note">

The older `staggerChildren` and `staggerDirection` options still work. `staggerChildren: 0.1, staggerDirection: -1` is the same as `delayChildren: stagger(0.1, { from: "last" })`.

</Callout>

### Path

#### path

By default, `x` and `y` animate in a straight line to their targets. `path` makes them travel along a curve instead. The `arc()` function creates a curved path:

```svelte
<script lang="ts">
	import { arc, motion } from "motion-sv";

	const path = arc();

	let isMoved = $state(false);
</script>

<motion.div
	animate={{ x: isMoved ? 200 : 0, y: isMoved ? 100 : 0 }}
	transition={{ duration: 0.8, path }}
	onclick={() => (isMoved = !isMoved)}
/>
```

`arc()` accepts these options:

- `strength`: how far the path bulges away from a straight line, relative to the distance travelled. Default `0.5`.
- `peak`: where along the path, from `0` to `1`, the curve is furthest from the straight line. Default `0.5`.
- `direction`: the side the path bulges towards, `"cw"` or `"ccw"` relative to the direction of travel. By default, Motion picks a stable side.
- `rotate`: rotates the element to follow the curve. `true` follows it fully, and a number between `0` and `1` follows it partially.

Layout animations follow `path` too. Create the path once, at the top level of the `<script>`, rather than inline in the markup: it remembers previous animations, which keeps interrupted animations continuous.
