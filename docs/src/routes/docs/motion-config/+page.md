---
title: MotionConfig
description: Set default options, like a transition or a reduced motion policy, for every motion component inside it.
---

<script>
	import Callout from "#lib/components/callout.svelte";
	import Demo from "#lib/components/demo.svelte";
	import transition from "#lib/demos/motion-config/transition.svelte?demo";
	import reducedMotion from "#lib/demos/motion-config/reduced-motion.svelte?demo";
</script>

The `MotionConfig` component sets configuration options for all the [`motion` components](/docs/motion-component) inside it.

```svelte
<script lang="ts">
	import { MotionConfig, motion } from "motion-sv";
</script>

<MotionConfig transition={{ duration: 1 }}>
	<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} />
</MotionConfig>
```

## Props

### transition

A default [transition](/docs/transitions) for every `motion` component inside. A component's own `transition` prop, or a `transition` set on an animation target, takes precedence over it.

```svelte
<MotionConfig transition={{ type: "spring", visualDuration: 0.6, bounce: 0.4 }}>
	<motion.div animate={{ x }} />
	<motion.div animate={{ x, rotate }} />

	<!-- Uses its own transition instead -->
	<motion.div animate={{ x }} transition={{ duration: 0.6, ease: "linear" }} />
</MotionConfig>
```

<Demo demo={transition} height={300} />

### reducedMotion

Default: `"never"`

A site-wide policy for [reduced motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion):

- `"user"`: respect the user's device setting.
- `"always"`: always reduce motion, which is useful for testing.
- `"never"`: don't reduce motion.

When motion is reduced, transform and layout animations are disabled, and those values change instantly. Other animations, like `opacity` and `backgroundColor`, still run.

Each component reads the policy when it mounts, so a change to `reducedMotion` applies to the components that mount after it.

```svelte
<MotionConfig reducedMotion="user">
	<!-- Your app -->
</MotionConfig>
```

<Demo demo={reducedMotion} height={300} />

<Callout type="tip">

To adapt an animation to the user's setting yourself, for instance to replace a movement with a fade, read it with [`useReducedMotion`](/docs/use-reduced-motion).

</Callout>

### skipAnimations

Default: `false`

If `true`, every animation inside is skipped, and values are set to their targets instantly. This is useful for end-to-end and visual regression tests.

```svelte
<MotionConfig skipAnimations={isTesting}>
	<!-- Your app -->
</MotionConfig>
```

### nonce

If you use a [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/style-src#unsafe_inline_styles) with a `nonce`, pass the same `nonce` to `MotionConfig`. Motion adds it to the `<style>` element that [`AnimatePresence`](/docs/animate-presence) creates for `mode="popLayout"`, so it complies with the policy.

```svelte
<MotionConfig {nonce}>
	<!-- Your app -->
</MotionConfig>
```

### inViewOptions

Default [`inViewOptions`](/docs/motion-component#inviewoptions) for every component inside that uses `whileInView`, `onViewportEnter` or `onViewportLeave`. A component's own `inViewOptions` replaces them as a whole, rather than being merged with them.

```svelte
<MotionConfig inViewOptions={{ once: true, amount: 0.5 }}>
	<motion.section initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} />
</MotionConfig>
```

## Nesting

`MotionConfig` components can be nested. A nested config inherits every option it doesn't set from its parent, and overrides the ones it does:

```svelte
<MotionConfig transition={{ duration: 0.5 }} reducedMotion="user">
	<!-- Uses the parent's reducedMotion, with a spring -->
	<MotionConfig transition={{ type: "spring", bounce: 0.3 }}>
		<motion.div animate={{ x: 100 }} />
	</MotionConfig>
</MotionConfig>
```

An option that is set replaces the parent's value entirely, so the inner `transition` above doesn't keep the outer `duration`. To merge a `transition` with the parent's instead, set [`inherit: true`](/docs/transitions#inheriting-transitions). Its own options win:

```svelte
<MotionConfig transition={{ duration: 0.5, ease: "easeOut" }}>
	<!-- Animates for 0.2 seconds, with easeOut -->
	<MotionConfig transition={{ inherit: true, duration: 0.2 }}>
		<motion.div animate={{ x: 100 }} />
	</MotionConfig>
</MotionConfig>
```

## useMotionConfig

`useMotionConfig()` returns a getter for the configuration from the closest `MotionConfig`, or the defaults when there isn't one. Call it at the top level of a component's `<script>`, and the getter wherever you need the current value:

```svelte
<script lang="ts">
	import { useMotionConfig } from "motion-sv";

	const config = useMotionConfig();

	const reducedMotion = $derived(config().reducedMotion);
</script>
```

The getter is reactive, so code that reads it, like the `$derived` above, updates when the config changes.
