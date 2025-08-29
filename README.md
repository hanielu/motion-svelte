# Motion For Svelte

This is an attempt to bring a Motion (formerly known as Framer Motion) to Svelte.

## Quick Start

```bash
npm install motion-sve
```

Then import the `motion` component:

```svelte
<script lang="ts">
	import { motion } from "motion-sve";
</script>

<motion.div animate={{ x: 100 }}>Hello</motion.div>
```

Here’s a streamlined rewrite. It cuts repetition, tightens explanations, and emphasizes what a user needs to know to _use_ the port, not just understand internals:

## Key Differences from Framer Motion

Some Framer Motion features cannot be reproduced in Svelte with the same APIs.

### Layout Animations

React uses `getSnapshotBeforeUpdate` and Vue uses `onBeforeUpdate`.  
Svelte has no equivalent, so layout animations require a helper.

Enable them by wrapping `motion` with `createLayoutMotion`:

```ts
import { motion, createLayoutMotion } from "motion-sve";

const layout = createLayoutMotion(motion);
```

`createLayoutMotion` provides:

- `layout.update()` — mark a layout change after state updates.
- `layout.update.with(fn)` — wrap a state update so layout changes are tracked automatically.

Usage:

```svelte
<script lang="ts">
	import { motion, createLayoutMotion } from "motion-sve";

	let isOn = $state(false);
	const layout = createLayoutMotion(motion);

	const toggle = layout.update.with(() => (isOn = !isOn));
	// or:
	// function toggle() {
	//   isOn = !isOn;
	//   layout.update();
	// }
</script>

<motion.button style={{ ...container, justifyContent: "flex-" + (isOn ? "start" : "end") }} onclick={toggle}>
	<layout.div
		style={handle}
		layoutDependency={isOn}
		transition={{ type: "spring", visualDuration: 0.2, bounce: 0.2 }}
	/>
</motion.button>
```

> Use `layoutDependency` if the element is not being remounted. This gives motion a reactive trigger for the update.

---

### Layout Animations with `layoutId`

Alternatively, use `layoutId` to link elements across renders:

```svelte
<motion.button style={{ ...container, justifyContent: "flex-" + (isOn ? "start" : "end") }} onclick={toggle}>
	{#if isOn}
		<layout.div style={handle} layoutId="handle" transition={{ type: "spring", visualDuration: 0.2, bounce: 0.2 }} />
	{:else}
		<layout.div style={handle} layoutId="handle" transition={{ type: "spring", visualDuration: 0.2, bounce: 0.2 }} />
	{/if}
</motion.button>
```

---

### Animate Presence (Enter/Exit)

- **React**: implemented with child diffing.
- **Vue**: uses `Transition` / `TransitionGroup`.
- **Svelte**: has no equivalent ([issue #8547](https://github.com/sveltejs/svelte/issues/8547)).

Limitations in this port:

- Variants with `AnimatePresence` (e.g. `when`) may not work.
- Rapid toggling can cause flickers instead of smooth reversal.
