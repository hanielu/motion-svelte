---
title: useMotionTemplate
description: Creates a motion value from a string template containing other motion values.
---

<script>
	import Callout from "#lib/components/callout.svelte";
	import Demo from "#lib/components/demo.svelte";
	import dropShadow from "#lib/demos/use-motion-template/drop-shadow.svelte?demo";
</script>

`useMotionTemplate` creates a new [motion value](/docs/motion-value) from a [string template](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals) containing other motion values.

```typescript
const x = useMotionValue(100);
const transform = useMotionTemplate`translateX(${x}px)`;
```

Whenever a motion value in the template changes, the returned motion value updates with its latest value.

## Usage

Import `useMotionTemplate` from `motion-sv`:

```typescript
import { useMotionTemplate } from "motion-sv";
```

`useMotionTemplate` is a "tagged template" function, so rather than calling it with parentheses, you write a template literal straight after it:

```typescript
useMotionTemplate``;
```

The template can combine text and motion values:

```svelte
<script lang="ts">
	import { motion, useMotionTemplate, useMotionValue } from "motion-sv";

	const blur = useMotionValue(10);
	const saturate = useMotionValue(50);
	const filter = useMotionTemplate`blur(${blur}px) saturate(${saturate}%)`;
</script>

<motion.div style={{ filter }} />
```

The returned motion value's latest state is the template, with each motion value replaced by its latest state. Because it's a motion value too, you can pass it to `style` like any other.

Motion values from any hook work, like [`useSpring`](/docs/use-spring) or [`useTransform`](/docs/use-transform):

```svelte
<script lang="ts">
	import { motion, useMotionTemplate, useMotionValue, useSpring } from "motion-sv";

	const shadowX = useSpring(0);
	const shadowY = useMotionValue(0);
	const filter = useMotionTemplate`drop-shadow(${shadowX}px ${shadowY}px 20px rgba(0,0,0,0.3))`;
</script>

<motion.div style={{ filter }} />
```

Here, `useTransform` turns the element's drag position into a shadow offset, so the shadow falls away from the center as you drag:

<Demo demo={dropShadow} />

Like other hooks, call `useMotionTemplate` during component setup, at the top level of the `<script>`.

<Callout type="tip">

The template reads its motion values whenever they change, but everything else in it is fixed when it's created. To build a string from Svelte state that changes too, use [`useTransform` with a function](/docs/use-transform#transform-function), which recomputes when either changes:

```typescript
const filter = useTransform(() => `blur(${blur.get()}px) hue-rotate(${hue}deg)`);
```

</Callout>
