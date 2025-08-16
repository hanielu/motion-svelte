# Framer Motion → SolidJS Port Todo

## Framework-Agnostic (Reusable as-is) ✅

- [x] `motion-utils` package - Pure utilities, math, easing
- [x] `motion-dom` package - Core animation engine, WAAPI, MotionValue
- [ ] Core animation logic in `packages/framer-motion/src/animation/`
- [ ] Layout projection system in `packages/framer-motion/src/projection/`
- [ ] VisualElement abstraction (`packages/framer-motion/src/render/VisualElement.ts`)

## Core Component System 🔴 HIGH PRIORITY

### Component Creation & Proxy System

- [x] Port `createMotionComponent()` from `packages/framer-motion/src/motion/index.tsx`
- [x] Adapt motion proxy system (`packages/framer-motion/src/render/components/create-proxy.ts`)
- [x] Create Svelte version of motion factory (`motion.div`, `motion.span`, etc.)
- [x] Port component symbol system (`packages/framer-motion/src/motion/utils/symbol.ts`)
- [x] Implement `isMotionComponent()` and `unwrapMotionComponent()` utils

### Rendering Integration

- [ ] Port `useRender()` from `packages/framer-motion/src/render/dom/use-render.ts`
- [ ] Adapt HTML props handling (`packages/framer-motion/src/render/html/use-props.ts`)
- [ ] Adapt SVG props handling (`packages/framer-motion/src/render/svg/use-props.ts`)
- [ ] Port props filtering (`packages/framer-motion/src/render/dom/utils/filter-props.ts`)
- [ ] Integrate with SolidJS JSX rendering

### Visual Element Integration

- [ ] Port `useVisualElement()` from `packages/framer-motion/src/motion/utils/use-visual-element.ts`
- [ ] Adapt visual state management (`packages/framer-motion/src/motion/utils/use-visual-state.ts`)
- [ ] Port HTML visual state (`packages/framer-motion/src/render/html/use-html-visual-state.ts`)
- [ ] Port SVG visual state (`packages/framer-motion/src/render/svg/use-svg-visual-state.ts`)

## Hooks & Reactivity 🟡 MEDIUM PRIORITY

### Motion Value Hooks

- [ ] `useMotionValue()` → SolidJS signal integration
- [ ] `useTransform()` → derived signals
- [ ] `useSpring()` → spring animations
- [ ] `useVelocity()` → velocity tracking
- [ ] `useMotionTemplate()` → template strings
- [ ] `useWillChange()` → CSS will-change optimization

### Animation Control Hooks

- [ ] `useAnimation()` / `useAnimationControls()` → animation control
- [ ] `useAnimate()` → imperative animations
- [ ] `useAnimateMini()` → lightweight animations

### Scroll & View Hooks

- [ ] `useScroll()` → scroll progress tracking
- [ ] `useElementScroll()` / `useViewportScroll()` → scroll utilities
- [ ] `useInView()` → intersection observer
- [ ] `usePageInView()` → page visibility

### Gesture Hooks

- [ ] `useDragControls()` → drag state management
- [ ] Gesture event integration → SolidJS event system

### Utility Hooks

- [ ] `usePresence()` / `useIsPresent()` → presence detection
- [ ] `useCycle()` → state cycling
- [ ] `useTime()` → time-based animations
- [ ] `useReducedMotion()` → accessibility
- [ ] `useForceUpdate()` → force re-renders (if needed)
- [ ] `useConstant()` → once-only initialization
- [ ] `useIsomorphicLayoutEffect()` → SSR-safe effects

## Context System 🟡 MEDIUM PRIORITY

### Core Contexts

- [x] `MotionConfigContext` → global motion configuration
- [x] `MotionContext` → motion component state
- [x] `PresenceContext` → AnimatePresence state
- [x] `LazyContext` → lazy loading state
- [x] `LayoutGroupContext` → layout animation groups
- [x] `SwitchLayoutGroupContext` → layout transitions

### Context Utilities

- [x] `useCreateMotionContext()` → context creation
- [ ] Context providers and consumers

## React Components 🟠 LOW PRIORITY

### Core Components

- [ ] `AnimatePresence` → exit/enter animations
- [ ] `LazyMotion` → code splitting and lazy loading
- [ ] `MotionConfig` → global configuration
- [ ] `LayoutGroup` → layout animation coordination

### Utility Components

- [ ] `Reorder` components → drag-to-reorder lists
- [ ] `AnimateSharedLayout` (deprecated) → shared layout animations

## Advanced Features 🔵 FUTURE

### Layout Animations

- [ ] Layout projection system integration
- [ ] `useInstantLayoutTransition()`
- [ ] `useResetProjection()`
- [ ] Shared layout animations

### Optimizations

- [ ] `optimizedAppearDataAttribute` → appear optimizations
- [ ] `startOptimizedAppearAnimation()` → optimized initial animations
- [ ] Bundle size optimizations (`m` vs `motion`)

### Gesture System Integration

- [ ] Drag gesture (`packages/framer-motion/src/gestures/drag/`)
- [ ] Pan gesture (`packages/framer-motion/src/gestures/pan/`)
- [ ] Hover/focus/press (`packages/framer-motion/src/gestures/`)
- [ ] Event handling integration

## Testing & Development 🔧

### Test Infrastructure

- [ ] Port test utilities and setup
- [ ] Create SolidJS-specific test examples
- [ ] Performance benchmarks vs React version

### Development Tools

- [ ] Development warnings and errors
- [ ] Debug utilities
- [ ] TypeScript definitions

## Notes

**Start Here:** Focus on Core Component System first - this gives you basic `motion.div` functionality.

**Dependencies:**

- Keep `motion-utils` and `motion-dom` as-is
- SolidJS reactivity primitives (signals, effects, etc.)
- SolidJS JSX rendering

**Key Differences:**

- Replace React hooks with SolidJS primitives
- Replace React Context with SolidJS Context
- Replace `useEffect`/`useLayoutEffect` with SolidJS effects
- Replace `useState` with SolidJS signals
- Replace `useMemo`/`useCallback` with SolidJS memos/derived signals
