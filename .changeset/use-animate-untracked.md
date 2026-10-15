---
"motion-sv": patch
---

`animate` from `useAnimate` no longer makes the effect that calls it depend on the state it reads itself (the scope's element, `MotionConfig` and the reduced motion preference), so it doesn't need wrapping in `untrack`.
