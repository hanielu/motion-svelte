---
title: LayoutGroup
description: Group layout animations across components, and scope shared layout animations with an id.
---

<script>
	import Callout from "#lib/components/callout.svelte";
	import Demo from "#lib/components/demo.svelte";
	import sidebar from "#lib/demos/layout-group/sidebar.svelte?demo";
	import tabRows from "#lib/demos/layout-group/tab-rows.svelte?demo";
</script>

[Layout animations](/docs/layout-animations) run when a layout namespace measures its elements before a change. Elements in other components, rendered through namespaces of their own, aren't measured. When their layout changes as a side effect, they jump.

`LayoutGroup` groups components that don't render together, but affect each other's layout. It also namespaces `layoutId`s, so a component with a shared layout animation can be rendered more than once.

## Usage

### Import

```typescript
import { LayoutGroup } from "motion-sv";
```

### Group layout animations

Take this sidebar, which handles its own state. Its namespace animates it when it opens and closes:

```svelte
<!-- side-nav.svelte -->
<script lang="ts">
	import { createLayoutMotion } from "motion-sv";

	const links = ["Home", "Search", "Library"];

	let isOpen = $state(false);
	const layout = createLayoutMotion(() => isOpen);

	const toggle = () => (isOpen = !isOpen);
</script>

<layout.nav class={["side-nav", { open: isOpen }]}>
	<layout.button layout="position" onclick={toggle}>{isOpen ? "Close" : "Menu"}</layout.button>
	{#each links as link (link)}
		<layout.div layout="position">
			<span class="icon"></span>
			{#if isOpen}{link}{/if}
		</layout.div>
	{/each}
</layout.nav>
```

Next to it, the page's content takes up the remaining width. It renders its elements through a namespace too, but it has no state of its own, so nothing tells it a change is coming:

```svelte
<!-- content.svelte -->
<script lang="ts">
	import { createLayoutMotion } from "motion-sv";

	const layout = createLayoutMotion();
</script>

<layout.main class="content">
	<layout.div class="line" />
	<layout.div class="line" />
</layout.main>
```

When the sidebar opens, the content has no way of knowing, so it jumps to its new size. Wrap both in a `LayoutGroup`, and when the sidebar's namespace measures its elements, the content's elements are measured too:

```svelte
<script lang="ts">
	import { LayoutGroup } from "motion-sv";
	import Content from "./content.svelte";
	import SideNav from "./side-nav.svelte";
</script>

<LayoutGroup>
	<SideNav />
	<Content />
</LayoutGroup>
```

<Demo demo={sidebar} />

When any layout element in a `LayoutGroup` is measured before a change, every layout element in the group is. That covers elements rendered through a layout namespace, and elements with a `layoutId`.

<Callout type="tip">

When you control all the components involved, passing one namespace to all of them works too. See [sharing a namespace](/docs/layout-animations#sharing-a-namespace).

</Callout>

### Namespace `layoutId`

Elements with the same `layoutId` perform [shared layout animations](/docs/layout-animations#shared-layout-animations) with each other. `layoutId` is global across the page, so when a component that uses one is rendered more than once, its instances animate between each other.

For instance, each tab row here renders an underline with `layoutId="underline"`:

```svelte
<!-- tab-row.svelte -->
<script lang="ts">
	import { motion } from "motion-sv";

	let { tabs }: { tabs: string[] } = $props();

	let selected = $state(0);
</script>

<nav>
	{#each tabs as tab, index (tab)}
		<button onclick={() => (selected = index)}>
			{tab}
			{#if index === selected}
				<motion.div class="underline" layoutId="underline" />
			{/if}
		</button>
	{/each}
</nav>
```

With two tab rows on the page, selecting a tab in one row would animate the underline from the other row. Give each row's tabs a `LayoutGroup` with a unique `id`. It prefixes the `layoutId`s inside it, so each underline only animates within its own row:

```svelte
<!-- tab-row.svelte -->
<script lang="ts">
	import { LayoutGroup, motion } from "motion-sv";

	let { id, tabs }: { id: string; tabs: string[] } = $props();

	let selected = $state(0);
</script>

<LayoutGroup {id}>
	<nav>
		<!-- ... -->
	</nav>
</LayoutGroup>
```

```svelte
<TabRow id="fruit" tabs={["Apple", "Banana", "Cherry"]} />
<TabRow id="vegetables" tabs={["Carrot", "Leek", "Pea"]} />
```

<Demo demo={tabRows} height={200} />

### Nested groups

A `LayoutGroup` inside another one inherits from it by default: its `id` is added to the parent's, and its elements are measured together with the parent's. Set `inherit` to choose what it inherits:

```svelte
<LayoutGroup id="sidebar">
	<!-- layoutIds are prefixed with "sidebar" and "tabs", and measured on their own -->
	<LayoutGroup id="tabs" inherit="id">
		<!-- ... -->
	</LayoutGroup>
</LayoutGroup>
```

## Props

### `id`

A string that prefixes the `layoutId` of every element inside the group, so they only perform shared layout animations with each other.

### `inherit`

Default: `true`

What a nested `LayoutGroup` inherits from the `LayoutGroup` around it:

- `true`: the parent's `id`, which its own `id` is added to, and its measurement group.
- `"id"`: only the parent's `id`. Its elements are measured separately from the parent's.
- `"group"`: only the measurement group. Its `id` isn't combined with the parent's.
- `false`: nothing. It works like a top-level `LayoutGroup`.

<Callout type="note">

A `LayoutGroup` reads its props once, when it's created. To change its `id` or `inherit` later, create it again, for instance in a `{#key}` block.

</Callout>
