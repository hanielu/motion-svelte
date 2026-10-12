<script lang="ts" module>
	import type { ElementType } from "#lib/types/index.js";
	import type { Snippet } from "svelte";
	import { ReorderContext } from "./context.js";
	import { createLayoutMotion, motion, type MotionProps } from "../motion/index.js";
	import { invariant } from "hey-listen";
	import { useDefaultMotionValue } from "./utils.js";
	import { autoScrollIfNeeded, resetAutoScrollState } from "./auto-scroll.js";
	import { useTransform } from "#lib/value/index.js";
	import { watch } from "#lib/vendor/runed/index.js";

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
		drag: dragProp,
		onDrag,
		onDragEnd,
		children,
		initial = undefined,
		animate = undefined,
		whileHover = undefined,
		whileInView = undefined,
		layoutId = undefined,
		layoutScroll = false,
		layoutRoot = false,
		dragListener = true,
		dragElastic = 0.5,
		dragMomentum = true,
		whileDrag = undefined,
		crossfade = true,
		ref = $bindable(),
		...rest
	}: GroupItemProps<ElementType> & {
		children: Snippet<[isDragging: boolean]>;
	} = $props();

	const context = ReorderContext.getOr(null);
	const point = {
		x: useDefaultMotionValue(style?.x),
		y: useDefaultMotionValue(style?.y),
	};

	const zIndex = useTransform([point.x, point.y], ([latestX, latestY]) => (latestX || latestY ? 1 : "unset"));
	function warning() {
		invariant(Boolean(context), "Reorder.Item must be a descendant of Reorder.Group");
	}

	// Call immediately to fail during setup, not render
	warning();

	const { axis, registerItem, updateOrder, groupRef } = context!;

	const restProps = $derived({
		...rest,
		initial,
		animate,
		whileHover,
		whileInView,
		layoutId,
		layoutScroll,
		layoutRoot,
		dragListener,
		dragElastic,
		dragMomentum,
		whileDrag,
		crossfade,
		style: {
			...style,
			x: point.x,
			y: point.y,
			zIndex,
		},
	});

	const drag = $derived.by(() => {
		if (dragProp) {
			return dragProp;
		}
		return axis.current;
	});
	let isDragging = $state(false);

	const layout = createLayoutMotion(motion);
	const Motion = layout.div;

	watch.pre(
		() => [restProps.custom],
		() => {
			layout.update();
		},
		{ lazy: true }
	);

	// Track drag position for auto-scroll
	function handleDrag(event: PointerEvent, gesturePoint: any) {
		const { velocity, point: pointerPoint } = gesturePoint;
		const offset = point[axis.current].get();

		// Always attempt to update order - checkReorder handles the logic
		updateOrder(value, offset, velocity[axis.current]);

		autoScrollIfNeeded(groupRef() ?? null, pointerPoint[axis.current], axis.current, velocity[axis.current]);
		if (!isDragging) isDragging = true;
		onDrag?.(event, gesturePoint);
	}

	function handleDragEnd(event: PointerEvent, gesturePoint: any) {
		isDragging = false;
		resetAutoScrollState();
		onDragEnd?.(event, gesturePoint);
	}
</script>

<layout.div
	{...restProps}
	{drag}
	dragSnapToOrigin
	onDrag={handleDrag}
	onDragEnd={handleDragEnd}
	onLayoutMeasure={(measured) => {
		registerItem(value, measured);
	}}
	bind:ref
	layout
>
	{@render children(isDragging)}
</layout.div>
