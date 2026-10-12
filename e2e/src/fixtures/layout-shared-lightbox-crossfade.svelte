<script lang="ts">
	import { AnimatePresence, createLayoutMotion, motion, type Transition } from "motion-sv";

	/**
	 * This demonstrates children with layoutId animating
	 * back to their origin components
	 */

	const params = new URLSearchParams(window.location.search);
	const instant = params.get("instant") || false;
	const partialEase = params.get("partial-ease") || false;
	const type = params.get("type") || "crossfade";
	let transition: Transition = instant ? { type: false } : { duration: 0.01 };
	if (partialEase) {
		transition = {
			duration: 0.6,
			ease: () => 0.1,
		};
	}

	let openColor = $state<false | string>(false);

	// motion-sv: layout animations need createLayoutMotion + an explicit update around the state change.
	// Nested motion.divs register with their layout.* parent's scope.
	const layout = createLayoutMotion();
	const setOpen = layout.update.with((value: false | string) => (openColor = value));

	// Runs on every render in React.
	$effect.pre(() => {
		if (partialEase) {
			if (`hsl(0, 100%, 50%)` === openColor) {
				transition.ease = () => 0.1;
			} else {
				transition.ease = (t: number) => (t === 1 ? 1 : 0.9);
			}
		}
	});

	const numColors = 3; // 4 * 4
	const makeColor = (hue: number) => `hsl(${hue}, 100%, 50%)`;
	const colors = Array.from(Array(numColors)).map((_, i) => makeColor(Math.round((360 / numColors) * i)));

	const background =
		"position: fixed; top: 0; left: 0; bottom: 0; right: 0; display: flex; justify-content: center; align-items: center; background: #ccc";

	const container =
		"background-color: #eeeeee; border-radius: 25px; width: 600px; height: 600px; margin: 0; padding: 0 20px 20px 0; display: flex; flex-wrap: wrap; justify-content: space-between; align-items: space-between; list-style: none";

	const item = {
		padding: "20px",
		cursor: "pointer",
		margin: "20px 0 0 20px",
		flex: "1 1 90px",
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
	};

	const overlay = {
		background: "rgba(0,0,0,0.6)",
		position: "fixed",
		top: "0",
		left: "0",
		bottom: "0",
		right: "0",
	};

	const singleImageContainer =
		"position: absolute; top: 0; left: 0; bottom: 0; right: 0; display: flex; justify-content: center; align-items: center; pointer-events: none";

	const singleImage = {
		width: "500px",
		height: "300px",
		padding: 50,
	};

	const child = {
		width: 50,
		height: 50,
		borderRadius: 25,
		backgroundColor: "white",
		opacity: 0.5,
	};
</script>

{#snippet Gallery(items: string[], setOpen: (value: false | string) => void)}
	<ul style={container}>
		{#each items as color, i (color)}
			<layout.li
				onclick={() => setOpen(color)}
				style={{ ...item, backgroundColor: color, borderRadius: 0 }}
				layoutId={color}
				{transition}
				id={i === 0 ? `item-parent` : undefined}
			>
				<motion.div style={child} id={i === 0 ? `item-child` : undefined} layoutId={`child-${color}`} {transition} />
			</layout.li>
		{/each}
	</ul>
{/snippet}

{#snippet SingleImage(color: string, setOpen: (value: false | string) => void)}
	<!-- motion-sv has no useIsPresent: isPresent is always true while rendered. -->
	{@const isPresent = true}
	<motion.div
		initial={{ opacity: 0 }}
		animate={{ opacity: 1 }}
		exit={{ opacity: 0 }}
		style={{
			...overlay,
			pointerEvents: isPresent ? "auto" : "none",
		}}
		id="overlay"
		{transition}
		onclick={() => setOpen(false)}
	/>
	<div style={singleImageContainer}>
		<layout.div
			id="parent"
			layoutId={color}
			style={{
				...singleImage,
				backgroundColor: "#fff",
				borderRadius: 50,
			}}
			{transition}
		>
			<motion.div style={{ ...child, backgroundColor: "black" }} id="child" layoutId={`child-${color}`} {transition} />
		</layout.div>
	</div>
{/snippet}

<div style={background}>
	{@render Gallery(colors, setOpen)}
	<AnimatePresence>
		{#if openColor !== false}
			{#key openColor}
				{@render SingleImage(openColor, setOpen)}
			{/key}
		{/if}
	</AnimatePresence>
</div>
