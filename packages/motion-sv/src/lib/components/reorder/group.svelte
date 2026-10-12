<script module lang="ts">
	import type { AsTag } from "#lib/types/index.js";
	import type { Box, Point } from "motion-utils";
	import type { ReorderAxis } from "./types.js";
	import { createLayoutMotion, motion, type MotionProps } from "../motion/index.js";
	import { setReorderContext } from "./context.js";
	import { watch } from "#lib/vendor/runed/index.js";
	import { invariant } from "hey-listen";
	import { checkReorder, detectAxis } from "./utils.js";

	export interface GroupProps<T extends AsTag, K, V> extends MotionProps<T, K> {
		/**
		 * The axis to reorder along. By default, this is detected from the item
		 * layout. Use `"xy"` to explicitly enable wrapped layout reordering.
		 *
		 * @public
		 */
		axis?: ReorderAxis;
		/**
		 * A callback to fire with the new value order. For instance, if the values
		 * are provided as a state from `useState`, this could be the set state function.
		 *
		 * @public
		 */
		onReorder?: (newOrder: V[]) => void;
		/**
		 * The latest values state.
		 *
		 * ```jsx
		 * function Component() {
		 *   const [items, setItems] = useState([0, 1, 2])
		 *
		 *   return (
		 *     <Reorder.Group values={items} onReorder={setItems}>
		 *         {items.map((item) => <Reorder.Item key={item} value={item} />)}
		 *     </Reorder.Group>
		 *   )
		 * }
		 * ```
		 *
		 * @public
		 */
		values: V[];
	}
</script>

<script lang="ts" generics="T extends AsTag, K, V">
	let {
		as = "ul",
		axis: axisOverride,
		values = $bindable(),
		onReorder,
		ref = $bindable(),
		...rest
	}: GroupProps<AsTag, K, V> = $props();

	// svelte-ignore state_referenced_locally - a programming error, checked once
	invariant(Boolean(values), "Reorder.Group must be provided a values prop");

	// svelte-ignore state_referenced_locally - the element type is fixed per group, as in React
	const Group = motion[as as "ul"];

	const itemLayouts = new Map<V, Box>();
	let detectedAxis = $state<ReorderAxis>("y");
	const axis = $derived(axisOverride ?? detectedAxis);
	/** Set while a new order is waiting to render, so a drag reorders once per render. */
	let isReordering = false;
	const layoutMotion = createLayoutMotion();

	setReorderContext({
		get axis() {
			return axis;
		},
		groupRef: () => ref,
		layoutMotion,
		registerItem(value: V, layout: Box) {
			itemLayouts.set(value, layout);

			if (!axisOverride) {
				detectedAxis = detectAxis(
					values.flatMap((itemValue) => {
						const itemLayout = itemLayouts.get(itemValue);
						return itemLayout ? [itemLayout] : [];
					})
				);
			}
		},
		updateOrder(item: V, offset: Point, velocity: Point) {
			if (isReordering) return;

			const order = values.flatMap((value) => {
				const layout = itemLayouts.get(value);
				return layout ? [{ value, layout }] : [];
			});
			const direction = ref && getComputedStyle(ref).direction === "rtl" ? "rtl" : "ltr";
			const newOrder = checkReorder(order, item, offset, velocity, axis, direction);
			if (order === newOrder) return;

			isReordering = true;

			// Unmeasured items (e.g. exiting with AnimatePresence) keep their positions.
			const newValues = [...values];
			const measuredIndexes = order.map(({ value }) => values.indexOf(value));
			newOrder.forEach(({ value }, index) => {
				newValues[measuredIndexes[index]] = value;
			});
			values = newValues;
			onReorder?.(newValues);
			// Snapshot the items before the new order renders, as a React re-render does.
			layoutMotion.update();
		},
	});

	// Once new values have rendered: allow the next reorder, and forget the layouts of removed items.
	watch(
		() => values,
		(current) => {
			isReordering = false;
			const valuesSet = new Set(current);
			for (const value of itemLayouts.keys()) {
				if (!valuesSet.has(value)) itemLayouts.delete(value);
			}
		}
	);

	// Scroll anchoring would move the page as items reorder, throwing off the drag.
	const groupStyle = $derived({ overflowAnchor: "none", ...rest.style });
</script>

<Group {...rest} style={groupStyle} bind:ref />
