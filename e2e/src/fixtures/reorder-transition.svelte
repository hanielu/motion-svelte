<script lang="ts">
	import { ReorderGroup, ReorderItem } from "motion-sv";

	/**
	 * Reorder whose order update doesn't commit straight away:
	 *
	 * ?mode=useTransition  onReorder sets state inside startTransition
	 * ?mode=deferred       values come from useDeferredValue
	 *
	 * Items render slowly so the pending order is still rendering when the
	 * next pointermove arrives. Meanwhile an urgent commit happens (the
	 * isPending render, or the stale render in front of the deferred value).
	 * That commit must not let Reorder call onReorder again with the same order.
	 *
	 * motion-sv: Svelte has no startTransition or useDeferredValue (every update commits on the next microtask), and a
	 * keyed each moves its items instead of re-rendering them, so neither mode nor the slow item render can be
	 * expressed: both modes set the order straight away.
	 */
	const itemHeight = 60;
	const initialItems = ["0", "1", "2", "3", "4", "5"];

	const win = window as Window & { reorderCalls: string[]; dragDone: boolean };
	win.reorderCalls = [];
	win.dragDone = false;

	function dispatch(type: string, target: EventTarget, x: number, y: number) {
		target.dispatchEvent(
			new PointerEvent(type, {
				clientX: x,
				clientY: y,
				pointerId: 1,
				pointerType: "mouse",
				isPrimary: true,
				button: 0,
				buttons: type === "pointerup" ? 0 : 1,
				bubbles: true,
				cancelable: true,
			})
		);
	}

	/**
	 * Drag the first item 3.5 rows down with a pointermove every 16ms.
	 */
	function drag() {
		const el = document.getElementById("item-0")!;
		const { left, top } = el.getBoundingClientRect();
		const x = left + 20;
		const startY = top + 20;
		const moves = 40;
		const distance = itemHeight * 3.5;

		dispatch("pointerdown", el, x, startY);
		for (let i = 1; i <= moves; i++) {
			setTimeout(() => dispatch("pointermove", window, x, startY + (distance * i) / moves), i * 16);
		}
		setTimeout(
			() => {
				dispatch("pointerup", window, x, startY + distance);
				setTimeout(() => (win.dragDone = true), 500);
			},
			moves * 16 + 300
		);
	}

	let items = $state(initialItems);
</script>

<div style="padding: 20px">
	<button id="drag" onclick={drag}>drag</button>
	<ReorderGroup
		axis="y"
		values={items}
		onReorder={(next) => {
			win.reorderCalls.push(next.join(""));
			items = next;
		}}
		style={{ listStyle: "none", padding: 0, margin: 0, width: 200 }}
	>
		{#each items as item (item)}
			<ReorderItem
				value={item}
				id={`item-${item}`}
				transition={{ duration: 0.2 }}
				style={{
					height: itemHeight,
					background: "#eee",
					borderBottom: "1px solid #999",
					boxSizing: "border-box",
				}}
			>
				{item}
			</ReorderItem>
		{/each}
	</ReorderGroup>
</div>
