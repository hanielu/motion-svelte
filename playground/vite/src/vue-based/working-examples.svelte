<script lang="ts">
	let count = $state(0);
	let isOn = $state(false);

	const container = {
		width: 100,
		height: 50,
		backgroundColor: 'var(--hue-3-transparent)',
		borderRadius: 50,
		cursor: 'pointer',
		display: 'flex',
		padding: 10,
	};

	const handle = {
		width: 50,
		height: 50,
		backgroundColor: '#9911ff',
		borderRadius: '50%',
	};

	const container2 = {
		display: 'flex',
		flexDirection: 'column',
		width: 100,
		height: 160,
		position: 'relative',
	};

	const box = {
		width: 100,
		height: 100,
		backgroundColor: '#0cdcf7',
		borderRadius: '10px',
	};

	const button = {
		backgroundColor: '#0cdcf7',
		borderRadius: '10px',
		padding: '10px 20px',
		color: '#0f1115',
		position: 'absolute',
		bottom: 0,
		left: 0,
		right: 0,
	};

	import { motion } from 'motion-sv';
	import { css, Previous } from 'runed';

	let isVisible = $state(true);
	const wasVisible = new Previous(() => isVisible);

	$effect(() => {
		// console.log('[haniel] wasVisible', wasVisible.current);
	});
</script>

<!-- <div style={styleToStr(container2)}>
  <AnimatePresence initial={false}>
    {#if isVisible}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1, backgroundColor: wasVisible.current ? "red" : "blue" }}
        exit={{ opacity: 0, scale: 0 }}
        style={box}
        whileHover={{ scale: 1.1 }}
        key="box"
      />
    {/if}
  </AnimatePresence>
  <motion.button style={button} onclick={() => (isVisible = !isVisible)} whileTap={{ y: 1 }}>
    {isVisible ? "Hide" : "Show"}
  </motion.button>
</div> -->

<motion.div
	id="test"
	style={{ width: 100, height: 100, backgroundColor: 'red', marginTop: 50 }}
	initial={{ rotate: 0 }}
	animate={{ rotate: 60 + count, x: count }}
	whileHover={{ scale: 1.1 }}
	whilePress={{ scale: 0.95 }}
	onHoverStart={() => console.log('hover started!')}
/>

<button onclick={() => (count += 50)}>Click me</button>

<!-- very odd scenario, but nested layout animation works -->
<!-- <motion.div onclick={() => (isOn = !isOn)}>
	<button
		style={css({
			...container,
			justifyContent: 'flex-' + (isOn ? 'start' : 'end'),
			marginTop: 50,
		})}
	>
		<motion.div
			style={handle}
			layout
			layoutDependency={isOn}
			transition={{
				type: 'spring',
				visualDuration: 0.2,
				bounce: 0.2,
			}}
		/>
	</button>
</motion.div> -->

<!-- nested layout animation works -->
<!-- <motion.button
  style={{ ...container, justifyContent: "flex-" + (isOn ? "start" : "end"), marginTop: 50 }}
  onclick={() => (isOn = !isOn)}
  layoutRoot
>
  <motion.div
    style={handle}
    layout
    layoutDependency={isOn}
    transition={{
      type: "spring",
      visualDuration: 0.2,
      bounce: 0.2,
    }}
  />
</motion.button> -->

<!-- nested layout animation does not work -->
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

<!-- <motion.div>Hello</motion.div>
<motion.div
  style="width: 100px; height: 100px; background-color: red"
  animate={{ rotate: 360 }}
  transition={{ duration: 1 }}
/> -->
