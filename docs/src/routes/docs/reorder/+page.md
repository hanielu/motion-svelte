---
title: Reorder
description: Drag-to-reorder lists, tabs and grids.
---

<script>
	import Demo from "#lib/components/demo.svelte";
	import basic from "#lib/demos/reorder/basic.svelte?demo";
	import reorderGrid from "#lib/demos/reorder/reorder-grid.svelte?demo";
	import dragging from "#lib/demos/reorder/dragging.svelte?demo";
	import addRemove from "#lib/demos/reorder/add-remove.svelte?demo";
	import dragHandle from "#lib/demos/reorder/drag-handle.svelte?demo";
	import todoList from "#lib/demos/reorder/todo-list.svelte?demo";
</script>

The `ReorderGroup` and `ReorderItem` components create drag-to-reorder layouts, like reorderable tabs, to-do lists or grids.

```svelte
<script lang="ts">
	import { ReorderGroup, ReorderItem } from "motion-sv";

	let items = $state(["Tomato", "Cucumber", "Cheese", "Lettuce"]);
</script>

<ReorderGroup bind:values={items}>
	{#each items as item (item)}
		<ReorderItem value={item}>{item}</ReorderItem>
	{/each}
</ReorderGroup>
```

<Demo demo={basic} height={320} />

## Usage

### Import

```typescript
import { ReorderGroup, ReorderItem } from "motion-sv";
```

### Groups and items

Every reorderable layout is wrapped in a `ReorderGroup`. It renders a `<ul>` by default, which you can change with the `as` prop:

```svelte
<ReorderGroup as="ol" bind:values={items}>
```

Pass the group the array of values in the layout with `values`. When an item is dragged over the middle of its neighbour, the group puts the values in their new order. Bind them with `bind:values`, and your state stays in sync:

```svelte
<script lang="ts">
	let items = $state([0, 1, 2, 3]);
</script>

<ReorderGroup bind:values={items}>
	<!-- ... -->
</ReorderGroup>
```

Or pass `values` and an `onReorder` callback, which receives the new order, to update your state yourself:

```svelte
<ReorderGroup values={items} onReorder={(newOrder) => (items = newOrder)}>
	<!-- ... -->
</ReorderGroup>
```

Render each item with a `ReorderItem`, passing it the value it represents with `value`. Each `value` must be an entry of the group's `values`. Render the items in a keyed `{#each}` block, so each element moves along with its value:

```svelte
<ReorderGroup bind:values={items}>
	{#each items as item (item)}
		<ReorderItem value={item}>{item}</ReorderItem>
	{/each}
</ReorderGroup>
```

### Drag axis

`ReorderGroup` detects whether its items are laid out horizontally, vertically or across both directions, and sets the axis of reordering to match: `"x"` for rows, `"y"` for columns and `"xy"` for grids and wrapping lists. Set the `axis` prop to override it:

```svelte
<ReorderGroup axis="xy" bind:values={items} class="grid">
	{#each items as item (item)}
		<ReorderItem value={item}>{item}</ReorderItem>
	{/each}
</ReorderGroup>
```

<Demo demo={reorderGrid} height={500} />

When the axis is `"x"` or `"y"`, items only move along that axis. To let them move in both directions, while still reordering along the axis, pass `drag` to the items:

```svelte
<ReorderItem value={item} drag>{item}</ReorderItem>
```

### Dragging state

`ReorderItem`'s children are a snippet that receives whether the item is being dragged:

```svelte
<ReorderItem value={item}>
	{#snippet children(isDragging)}
		{item}
		{#if isDragging}<span class="badge">Dragging</span>{/if}
	{/snippet}
</ReorderItem>
```

`ReorderItem` is a `motion` component, so it also supports `whileDrag` and the drag callbacks, like `onDragStart` and `onDragEnd`:

```svelte
<ReorderItem
	value={item}
	style={{ boxShadow: "0 0 0 rgb(0 0 0 / 0)" }}
	whileDrag={{ scale: 1.04, boxShadow: "0 8px 24px rgb(0 0 0 / 0.25)" }}
>
	<!-- ... -->
</ReorderItem>
```

<Demo demo={dragging} height={300} />

### z-index

`ReorderItem` sets a `z-index` on the dragged item, so it appears above the others. `z-index` only affects elements whose `position` isn't `static`, so give the items `position: relative` (or `absolute`).

### Layout animations

Items animate their layout: when the group reorders them, they slide into their new places. They animate their size as well. To only animate their position, set `layout` to `"position"`:

```svelte
<ReorderItem value={item} layout="position">{item}</ReorderItem>
```

### Adding and removing items

Wrap the items in an [`AnimatePresence`](/docs/animate-presence) to animate them as they're added and removed. Removed items play their `exit` animation, and the items around them move into place:

```svelte
<ReorderGroup bind:values={items}>
	<AnimatePresence>
		{#each items as item (item)}
			<ReorderItem
				value={item}
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
			>
				{item}
			</ReorderItem>
		{/each}
	</AnimatePresence>
</ReorderGroup>
```

The group measures its items whenever `values` changes, so when an item is added, the others move into place too.

Elements outside the group that move with the list, like a button below it, are [layout animations](/docs/layout-animations) of your own. Render them through a layout namespace, and wrap them and the group in a [`LayoutGroup`](/docs/layout-group), so they're measured along with the items:

```svelte
<script lang="ts">
	import { AnimatePresence, LayoutGroup, ReorderGroup, ReorderItem, createLayoutMotion } from "motion-sv";

	const layout = createLayoutMotion();

	let nextId = 4;
	let items = $state([1, 2, 3]);
</script>

<LayoutGroup>
	<ReorderGroup bind:values={items}>
		<AnimatePresence initial={false}>
			{#each items as id (id)}
				<ReorderItem value={id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
					Item {id}
					<button onclick={() => (items = items.filter((item) => item !== id))}>Remove</button>
				</ReorderItem>
			{/each}
		</AnimatePresence>
	</ReorderGroup>
	<layout.button onclick={() => (items = [nextId++, ...items])}>Add item</layout.button>
</LayoutGroup>
```

<Demo demo={addRemove} height={420} />

### Drag handles

By default, pressing anywhere on a `ReorderItem` starts a drag. To drag it from a handle instead, start the drag with [`useDragControls`](/docs/use-drag-controls), and set `dragListener` to `false` so the rest of the item doesn't start one.

Each item needs its own drag controls, so make the item a component:

```svelte
<!-- item.svelte -->
<script lang="ts">
	import { ReorderItem, useDragControls } from "motion-sv";

	let { item }: { item: string } = $props();

	const controls = useDragControls();
</script>

<ReorderItem value={item} dragListener={false} dragControls={controls}>
	{item}
	<div class="handle" onpointerdown={(event) => controls.start(event)}></div>
</ReorderItem>

<style>
	.handle {
		cursor: grab;
		touch-action: none;
	}
</style>
```

```svelte
<ReorderGroup bind:values={items}>
	{#each items as item (item)}
		<Item {item} />
	{/each}
</ReorderGroup>
```

<Demo demo={dragHandle} />

Give the handle `touch-action: none`, so touch devices don't scroll the page instead of dragging.

### Scrollable lists

When the group is inside a scrollable element, dragging an item close to one of that element's edges scrolls it. The closer the pointer is to the edge, the faster it scrolls. When no element around the group scrolls, the page does.

```svelte
<div style="height: 280px; overflow: auto">
	<ReorderGroup bind:values={items}>
		<!-- ... -->
	</ReorderGroup>
</div>
```

In this to-do list, ticking a task also moves it to the end, which the group animates like any other change to `values`:

<Demo demo={todoList} height={400} />

## API

### `ReorderGroup`

`ReorderGroup` accepts all [`motion` component props](/docs/motion-component), in addition to the following.

#### `as`

Default: `"ul"`

The element `ReorderGroup` renders.

```svelte
<ReorderGroup as="div" bind:values={items}>
```

#### `axis`

Default: detected from the layout

The axis of reordering: `"x"`, `"y"` or `"xy"`. By default, it's detected from the layout of the items: `"x"` for rows, `"y"` for columns and `"xy"` for grids and wrapping lists.

#### `values`

The array of values to reorder. Each `ReorderItem`'s `value` must be an entry of this array. Use `bind:values` to update your state with the new order.

#### `onReorder`

A callback that fires with the new order of `values` whenever the items reorder.

```svelte
<ReorderGroup values={items} onReorder={(newOrder) => (items = newOrder)}>
```

### `ReorderItem`

`ReorderItem` accepts all [`motion` component props](/docs/motion-component), in addition to the following.

#### `as`

Default: `"li"`

The element `ReorderItem` renders.

#### `value`

The value this item represents. When the items reorder, it takes the item's new place in the group's `values`.

#### `layout`

Default: `true`

Whether the item animates its size and position (`true`), or only its position (`"position"`).

#### `children`

The item's content: a snippet that receives whether the item is being dragged.

```svelte
<ReorderItem value={item}>
	{#snippet children(isDragging)}
		{item}{isDragging ? " (dragging)" : ""}
	{/snippet}
</ReorderItem>
```
