<script lang="ts" module>
	import type { ElementType } from "@/types/index.js";
	import type { Snippet } from "svelte";
	import { ReorderContext } from "./context.js";
	import { createLayoutMotion, motion, type MotionProps } from "../motion/index.js";
	import { invariant } from "hey-listen";
	import { useDefaultMotionValue } from "./utils.js";
	import { useTransform } from "@/value/index.js";
	import { watch } from "runed";

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
		invariant(Boolean(context), "Reorder.Item must be a child of Reorder.Group");
	}

	const { axis, registerItem, updateOrder } = context;

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

	$effect(() => warning());

	const layout = createLayoutMotion(motion);
	const Motion = layout.div;

	watch.pre(
		() => [restProps.custom],
		([current], [old]) => {
			console.log("due update", current, old);
			layout.update();
		},
		{ lazy: true }
	);
</script>

<layout.div
	{...restProps}
	{drag}
	dragSnapToOrigin
	onDrag={(event, gesturePoint) => {
		const { velocity } = gesturePoint;
		velocity[axis.current] && updateOrder(value, point[axis.current].get(), velocity[axis.current]);
		!isDragging && (isDragging = true);
		onDrag && onDrag(event, gesturePoint);
	}}
	onDragEnd={(event, gesturePoint) => {
		isDragging = false;
		onDragEnd && onDragEnd(event, gesturePoint);
	}}
	onLayoutMeasure={(measured) => {
		console.log("[measured]", measured);
		registerItem(value, measured);
	}}
	bind:ref
	layout
>
	{@render children(isDragging)}
</layout.div>
