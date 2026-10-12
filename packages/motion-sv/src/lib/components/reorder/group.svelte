<script module lang="ts">
	import type { AsTag } from "#lib/types/index.js";
	import type { Box } from "motion-utils";
	import type { ReorderAxis } from "./types.js";
	import { Motion, type MotionProps } from "../motion/index.js";
	import { ReorderContext } from "./context.js";
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

	const itemLayouts = new Map<V, Box>();
	let detectedAxis = $state<ReorderAxis>("y");
	const axis = $derived(axisOverride ?? detectedAxis);
	let isReordering = false;

	$effect(() => {
		invariant(Boolean(values), "Reorder.Group must be provided a values prop");
	});

	$effect.pre(() => {
		const valuesSet = new Set(values);
		itemLayouts.forEach((_, value) => {
			if (!valuesSet.has(value)) itemLayouts.delete(value);
		});
	});

	ReorderContext.set({
		get axis() {
			return axis;
		},
		groupRef: () => ref,
		registerItem: (value, layout) => {
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
		updateOrder: (item, offset, velocity) => {
			if (isReordering) return;

			const order = values.flatMap((value) => {
				const layout = itemLayouts.get(value);
				return layout ? [{ value, layout }] : [];
			});
			const direction = ref && getComputedStyle(ref).direction === "rtl" ? "rtl" : "ltr";
			const newOrder = checkReorder(order, item, offset, velocity, axis, direction);

			if (order !== newOrder) {
				isReordering = true;

				// Unmeasured items (e.g. exiting with AnimatePresence) keep their positions.
				const newValues = [...values];
				const measuredIndexes = order.map(({ value }) => values.indexOf(value));
				newOrder.forEach(({ value }, index) => {
					newValues[measuredIndexes[index]] = value;
				});
				values = newValues;
				onReorder?.(newValues);
			}
		},
	});

	// Only clear the guard once the new order has been rendered.
	$effect(() => {
		void values;
		isReordering = false;
	});

	const groupStyle = $derived({ overflowAnchor: "none", ...(rest.style as Record<string, any>) });
</script>

<Motion as={as as any} {...rest} style={groupStyle} bind:ref />
