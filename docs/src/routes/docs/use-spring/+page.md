---
title: useSpring
description: Creates a motion value that animates to its latest target with a spring.
---

<script>
	import Callout from "#lib/components/callout.svelte";
	import Demo from "#lib/components/demo.svelte";
	import followPointerWithSpring from "#lib/demos/use-spring/follow-pointer-with-spring.svelte?demo";
	import setAndJump from "#lib/demos/use-spring/set-and-jump.svelte?demo";
	import followValue from "#lib/demos/use-spring/follow-value.svelte?demo";
</script>

`useSpring` creates a [motion value](/docs/motion-value) that animates to its latest target with a spring animation.

You can set the target yourself with `set()`, or have it follow another motion value. Here, the ball springs towards motion values that track the pointer:

```svelte
<script lang="ts">
	import { motion, useMotionValue, useSpring } from "motion-sv";

	const spring = { damping: 3, stiffness: 50, restDelta: 0.001 };

	const xPoint = useMotionValue(0);
	const yPoint = useMotionValue(0);
	const x = useSpring(xPoint, spring);
	const y = useSpring(yPoint, spring);
</script>

<motion.div style={{ x, y }} />
```

<Demo demo={followPointerWithSpring} height={400} />

## Usage

Import `useSpring` from `motion-sv`:

```typescript
import { useSpring } from "motion-sv";
```

Like other hooks, call `useSpring` during component setup, at the top level of the `<script>`.

### Direct control

Create a spring with a number:

```typescript
const x = useSpring(0);
```

Now whenever you update it with `set()`, it animates to its new target with a spring:

```typescript
x.set(100);
```

To update it immediately, without a spring, use [the `jump()` method](/docs/motion-value#jump):

```typescript
x.jump(50);
```

<Demo demo={setAndJump} />

It also accepts a value with a unit, like `"100vh"`:

```typescript
const y = useSpring("100vh");

y.set("50vh");
```

### Track another motion value

A spring can follow the latest state of another motion value:

```typescript
const x = useMotionValue(0);
const y = useSpring(x);
```

The source motion value must hold a number, or a string with a unit, like `"10px"`.

This is a handy way to smooth out values that change abruptly, like [scroll progress](/docs/use-scroll#page-scroll):

```typescript
const { scrollYProgress } = useScroll();
const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
```

### Transition

Configure the spring with the usual [spring transition options](/docs/transitions#spring), like `stiffness`, `damping` and `mass`, or `visualDuration` and `bounce`:

```typescript
useSpring(0, { stiffness: 300 });
useSpring(0, { visualDuration: 0.4, bounce: 0.25 });
```

<Callout type="warning">

Springs and followers currently read the `duration` and `delay` options in milliseconds, unlike the rest of Motion, which uses seconds. Prefer `visualDuration`, which is in seconds, to set how long a spring takes.

</Callout>

### Changing the transition

To change the spring's options over time, pass a getter instead of an object. When the Svelte state it reads changes, the spring's next animation uses the new options:

```svelte
<script lang="ts">
	import { useMotionValue, useSpring } from "motion-sv";

	let isBouncy = $state(false);

	const source = useMotionValue(0);
	const x = useSpring(source, () => ({ stiffness: 300, damping: isBouncy ? 10 : 40 }));
</script>
```

## useFollowValue

`useFollowValue` works like `useSpring`, but it can follow its target with other types of transition too, like a tween. Without a `type`, it uses a spring.

```typescript
import { useFollowValue } from "motion-sv";

const x = useMotionValue(0);
const tween = useFollowValue(x, { type: "tween", ease: "easeOut" });
```

<Demo demo={followValue} />

Its source can be a number, a string with a unit, or another motion value. Its options are the same as a [transition](/docs/transitions)'s, without the repeat and lifecycle options, and like `useSpring`'s, they can be a getter.

### `skipInitialAnimation`

**Default:** `false`

When `true`, the first change from the source motion value jumps straight to the new value instead of animating to it. Later changes animate as usual.

This prevents an unwanted animation when the source starts somewhere other than its initial value, like a scroll position that's restored when the page loads:

```typescript
const { scrollY } = useScroll();
const y = useFollowValue(scrollY, { skipInitialAnimation: true });
```

## API

```typescript
useSpring(source, config?)
useFollowValue(source, options?)
```

### `source`

The initial value, as a number or a string with a unit, like `"10px"`, or a motion value to follow.

### `config` / `options`

The animation's options, as an object, or a getter that returns them. `useSpring` accepts [spring options](/docs/transitions#spring). `useFollowValue` accepts any transition options, and `skipInitialAnimation`.

### Returns

A motion value that animates to its latest target.
