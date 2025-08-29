<script lang="ts">
	const container = {
		width: 100,
		height: 50,
		backgroundColor: "var(--hue-3-transparent)",
		borderRadius: 50,
		cursor: "pointer",
		display: "flex",
		padding: 10,
	};

	const handle = {
		width: 50,
		height: 50,
		backgroundColor: "#9911ff",
		borderRadius: "50%",
	};

	import { motion, createLayoutMotion } from "motion-sve";
	import { css } from "runed";

	let isOn = $state(false);

	const layout = createLayoutMotion(motion);
	const toggle = layout.update.with(() => (isOn = !isOn));
</script>

<!-- nested layout animation works -->
<!-- <motion.button
	style={{ ...container, justifyContent: "flex-" + (isOn ? "start" : "end"), marginTop: 50 }}
	onclick={toggle}
>
	<layout.div
		style={handle}
		layoutDependency={isOn}
		transition={{
			type: "spring",
			visualDuration: 0.2,
			bounce: 0.2,
		}}
	/>
</motion.button> -->

<!-- Using layoutId -->
<motion.button
	style={{ ...container, justifyContent: "flex-" + (isOn ? "start" : "end"), marginTop: 50 }}
	onclick={toggle}
>
	{#if isOn}
		<layout.div
			style={handle}
			layoutId="handle"
			transition={{
				type: "spring",
				visualDuration: 0.2,
				bounce: 0.2,
			}}
		/>
	{:else}
		<layout.div
			style={handle}
			layoutId="handle"
			transition={{
				type: "spring",
				visualDuration: 0.2,
				bounce: 0.2,
			}}
		/>
	{/if}
</motion.button>

<!-- nested layout animation does work as expected -->
<!-- <motion.div onclick={toggle}>
	<button
		style={css({
			...container,
			justifyContent: 'flex-' + (isOn ? 'start' : 'end'),
			marginTop: 50,
		})}
	>
		<layout.div
			style={handle}
			layoutDependency={isOn}
			transition={{
				type: 'spring',
				visualDuration: 0.2,
				bounce: 0.2,
			}}
		/>
	</button>
</motion.div> -->

<!-- nested layout animation does not work, as expected -->
<!-- <motion.ul
  style={{ ...container, justifyContent: "flex-" + (!isOn ? "start" : "end"), marginTop: 50 }}
  onclick={() => (isOn = !isOn)}
>
  <motion.li
    style={handle}
    layout
    layoutDependency={isOn}
    transition={{
      type: "spring",
      visualDuration: 0.2,
      bounce: 0.2,
    }}
  />
</motion.ul> -->
