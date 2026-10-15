---
"motion-sv": patch
---

`useScroll` takes its options as a getter, like the other hooks: `useScroll(() => ({ target: element }))`. It's read again once bound elements exist and whenever state it reads changes. A plain object still works.
