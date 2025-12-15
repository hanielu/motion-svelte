<script module>
	import type { AsTag } from "@/types/index.js";
	import type { ItemData } from "./types.js";
	import { Motion, type MotionProps } from "../motion/index.js";
	import { ReorderContext } from "./context.js";
	import { invariant } from "hey-listen";
	import { checkReorder, compareMin, getValue } from "./utils.js";

	export interface GroupProps<T extends AsTag, K, V> extends MotionProps<T, K> {
		/**
		 * The axis to reorder along. By default, items will be draggable on this axis.
		 * To make draggable on both axes, set `<Reorder.Item drag />`
		 *
		 * @public
		 */
		axis?: "x" | "y";
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
		axis: axisProp = $bindable("y"),
		values = $bindable(),
		onReorder,
		ref = $bindable(),
		...rest
	}: GroupProps<AsTag, K, V> = $props();

	const axis = {
		get current() {
			return axisProp;
		},
		set current(value) {
			axisProp = value;
		},
	};

	let order: ItemData<any>[] = [];
	let isReordering = false;

	function warning() {
		invariant(Boolean(values), "Reorder.Group must be provided a values prop");
	}

	// TODO: (haniel) need to figure out what triggers this
	$effect.pre(() => {
		void values;
		console.log("[reorder.group.values]", JSON.stringify($state.snapshot(values), null, 4));
		isReordering = false;
		order = [];

		return () => {
			// TODO: (haniel) this might work better in a function returned to the pre effect
		};
	});

	ReorderContext.set({
		axis,
		registerItem: (value, layout) => {
			// If the entry was already added, update it rather than adding it again
			const idx = order.findIndex((entry) => value === entry.value);
			if (idx !== -1) {
				order[idx].layout = layout[axis.current];
			} else {
				order.push({ value, layout: layout[axis.current] });
			}
			order.sort(compareMin);
		},
		updateOrder: (item: any, offset: number, velocity: number) => {
			if (isReordering) return;

			const newOrder = checkReorder(order, item, offset, velocity);
			if (order !== newOrder) {
				isReordering = true;
				values = newOrder.map(getValue).filter((value) => values.includes(value));
				console.log("[newOrder]", JSON.stringify($state.snapshot(values)));
				onReorder?.(values);
			}
		},
	});

	// (haniel) might put this in the template effect, who knows
	$effect(() => warning());
</script>

<Motion as={as as any} {...rest} bind:ref />
