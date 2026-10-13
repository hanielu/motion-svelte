---
"motion-sv": minor
---

Upgrade to Motion 14.1, with layout animations, AnimatePresence and Reorder that behave like Motion for React.

**Breaking changes**

- Requires Svelte 5.40 or newer.
- Built on framer-motion, motion-dom and motion-utils 14.1, all pinned to the same version. Behaviour follows upstream: `whileInView` and `whilePress` labels reach variant children, `backgroundColor` animates with WAAPI in sRGB, and drag release, inertia and nested layout timing changed.
- `ReorderItem` renders an `li` by default. It used to ignore `as` and always render a `div`.
- Removed `MotionConfig`'s unused `reduceMotion` type (use `reducedMotion`), the unimplemented `asChild` prop, and the `onFocus`/`onBlur` gesture types (use the DOM events).

**Layout animations**

- `createLayoutMotion(() => state)` animates layout whenever the state the getter reads changes, without calling `update()`. `update()` and `update.with()` still work.
- `layoutId` handoffs animate without `createLayoutMotion`.
- `AnimatePresence` measures its children around an exit, so the elements around it animate into the freed space without `update()`. A `LayoutGroup` extends this to elements outside it.
- `ReorderGroup` animates its items when `values` changes outside a drag, e.g. when an item is added.
- Layout passes finish before paint, and `popLayout` sizes and anchors exiting elements like upstream.

**Reorder**

- Ported from Motion 14.1: the axis is detected from the layout, `axis="xy"` reorders wrapped and grid layouts (RTL-aware), auto-scroll works with page scrolling, and `onReorder` receives the full list. A drag can move an item more than one slot.

**Fixes**

- `AnimatePresence` exits match React: they start right after the update, elements leave as soon as their exit completes, the first exit of children present at mount animates, and exit-less `layoutId` elements stay for their crossfade.
- Gestures that fire as an element mounts, like `whileFocus` on an autofocused input, now animate.
- `inherit={false}`, `MotionConfig`'s `skipAnimations` and nested `transition`s with `inherit: true` behave as in React, and `onViewportLeave` receives the leave entry.
- Fixes to `usePageInView`, `useInView`, `useAnimate` and `LazyMotion` from an audit of the package's reactivity.
- `useSpring` accepts values with units, and `as`, `ReorderGroup`/`ReorderItem` HTML attributes and `useAnimate` scopes are typed.
