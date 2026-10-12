---
title: usePageInView
description: Tracks whether the page is visible, so you can pause work while the user is on another tab.
---

<script>
	import Callout from "#lib/components/callout.svelte";
	import Demo from "#lib/components/demo.svelte";
	import progress from "#lib/demos/use-page-in-view/progress.svelte?demo";
</script>

`usePageInView` tracks whether the page is visible to the user. Its `current` property is `false` while the page's tab is in the background or its window is minimised.

```typescript
const pageInView = usePageInView();
```

Use it to pause videos, animations and other ongoing work while nobody can see them, and resume when the user comes back.

<Demo demo={progress} height={200} />

## Usage

Import `usePageInView` from `motion-sv`:

```typescript
import { usePageInView } from "motion-sv";
```

Call it at the top level of your component's `<script>`. It returns an object whose `current` property is `true` while the page is visible:

```svelte
<script lang="ts">
	import { usePageInView } from "motion-sv";

	const pageInView = usePageInView();
</script>

<p>{pageInView.current ? "Visible" : "Hidden"}</p>
```

`current` is reactive, so an `$effect` that reads it re-runs whenever the page is shown or hidden. For instance, to pause a video while the user is on another tab:

```svelte
<script lang="ts">
	import { usePageInView } from "motion-sv";

	const pageInView = usePageInView();
	let video = $state<HTMLVideoElement>();

	$effect(() => {
		if (!video) return;

		if (pageInView.current) video.play();
		else video.pause();
	});
</script>

<video bind:this={video} src="/intro.mp4" muted loop></video>
```

### Pausing animations

Browsers stop running animation frames in background tabs, but an animation's clock keeps running. When the user comes back, it has jumped ahead, and they've missed part of it.

To pick up where they left off, pause animations while the page is hidden. With [`useAnimate`](/docs/use-animate), use the animation's playback controls:

```svelte
<script lang="ts">
	import { useAnimate, usePageInView, type AnimationPlaybackControls } from "motion-sv";
	import { untrack } from "svelte";

	const pageInView = usePageInView();
	const [scope, animate] = useAnimate<HTMLDivElement>();

	let progress: AnimationPlaybackControls | undefined;

	$effect(() => {
		progress = untrack(() => animate(".fill", { scaleX: [0, 1] }, { duration: 5, repeat: Infinity }));
	});

	$effect(() => {
		if (pageInView.current) progress?.play();
		else progress?.pause();
	});
</script>
```

<Callout type="note">

`usePageInView` tracks the page's visibility, not whether an element is scrolled into view. For that, use [`useInView`](/docs/use-in-view).

</Callout>
