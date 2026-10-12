<script lang="ts" module>
	import type { ElementType } from "#lib/types/index.js";
	import type { Snippet } from "svelte";
	import { getReorderContext } from "./context.js";
	import type { MotionProps } from "../motion/index.js";
	import { useDefaultMotionValue } from "./utils.js";
	import { autoScrollIfNeeded, resetAutoScrollState } from "./auto-scroll.js";
	import { useTransform } from "#lib/value/index.js";
	import type { PanInfo } from "motion-dom";

	export interface GroupItemProps<T extends ElementType = "li", K = unknown, V = unknown> extends MotionProps<T, K> {
		/**
		 * The value in the list that this component represents.
		 *
		 * @public
		 */
		value: V;
		/**
		 * A subset of layout options primarily used to disable layout="size"
		 *
		 * @public
		 * @default true
		 */
		layout?: true | "position";
	}
</script>

<script lang="ts" generics="T extends ElementType = 'li', K = unknown, V = unknown">
	let {
		as = "li",
		style,
		value,
		drag,
		layout = true,
		onDrag,
		onDragEnd,
		children,
		ref = $bindable(),
		...rest
	}: GroupItemProps<ElementType> & {
		children: Snippet<[isDragging: boolean]>;
	} = $props();

	const context = getReorderContext();
	const { registerItem, updateOrder, groupRef, layoutMotion } = context;

	// svelte-ignore state_referenced_locally - the drag motion values are created once, like React's hooks
	const point = {
		x: useDefaultMotionValue(style?.x),
		y: useDefaultMotionValue(style?.y),
	};
	const zIndex = useTransform([point.x, point.y], ([latestX, latestY]) => (latestX || latestY ? 1 : "unset"));

	let isDragging = $state(false);

	// svelte-ignore state_referenced_locally - the element type is fixed per item, as in React
	const Item = layoutMotion[as as "li"];

	function handleDrag(event: PointerEvent, gesturePoint: PanInfo) {
		const { velocity, point: pointerPoint } = gesturePoint;
		const { axis } = context;

		updateOrder(value, { x: point.x.get(), y: point.y.get() }, velocity);

		const scrollAxis = axis === "xy" ? (Math.abs(velocity.x) > Math.abs(velocity.y) ? "x" : "y") : axis;
		autoScrollIfNeeded(groupRef() ?? null, pointerPoint[scrollAxis], scrollAxis, velocity[scrollAxis]);

		isDragging = true;
		onDrag?.(event, gesturePoint);
	}

	function handleDragEnd(event: PointerEvent, gesturePoint: PanInfo) {
		isDragging = false;
		resetAutoScrollState();
		onDragEnd?.(event, gesturePoint);
	}
</script>

<Item
	drag={drag ?? (context.axis === "xy" ? true : context.axis)}
	{...rest}
	dragSnapToOrigin
	style={{ ...style, x: point.x, y: point.y, zIndex }}
	{layout}
	onDrag={handleDrag}
	onDragEnd={handleDragEnd}
	onLayoutMeasure={(measured) => registerItem(value, measured)}
	bind:ref
>
	{@render children?.(isDragging)}
</Item>
