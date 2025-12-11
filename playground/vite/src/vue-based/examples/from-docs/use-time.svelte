<script lang="ts">
	import { motion, useTime, useTransform } from "motion-sv";
	import { css } from "runed";

	const time = useTime();
	const rotate = useTransform(
		time,
		[0, 4000], // time in milliseconds
		[0, 360], // rotation in degrees
		{ clamp: false }
	);

	const tinyBox = {
		width: "40px",
		height: "40px",
		backgroundColor: "#9911ff",
		borderRadius: "5px",
		rotate: useTransform(() => rotate.get() * 2), // 2x speed
	};

	const smallBox = {
		width: "80px",
		height: "80px",
		backgroundColor: "#dd00ee",
		borderRadius: "5px",
		rotate: useTransform(() => rotate.get() * 1.5), // 1.5x speed
	};

	const box = {
		width: "100px",
		height: "100px",
		backgroundColor: "#ff0088",
		borderRadius: "5px",
		rotate,
	};

	const layer = {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		gap: "20px",
	};

	const boxContainer = {
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		gap: "50px",
		flexWrap: "wrap",
	};
</script>

<div class="relative h-500px">
	<div style={css({ ...layer, filter: "blur(4px)" })}>
		<div style={css({ ...boxContainer, width: "500px", gap: "80px" })}>
			<motion.div style={tinyBox} />
			<motion.div style={tinyBox} />
			<motion.div style={tinyBox} />
			<motion.div style={tinyBox} />
			<motion.div style={tinyBox} />
			<motion.div style={tinyBox} />
			<motion.div style={tinyBox} />
			<motion.div style={tinyBox} />
			<motion.div style={tinyBox} />
			<motion.div style={tinyBox} />
			<motion.div style={tinyBox} />
			<motion.div style={tinyBox} />
			<motion.div style={tinyBox} />
			<motion.div style={tinyBox} />
			<motion.div style={tinyBox} />
			<motion.div style={tinyBox} />
		</div>
	</div>
	<div style={css({ ...layer, filter: "blur(2px)" })}>
		<div style={css({ ...boxContainer, width: "300px" })}>
			<motion.div style={smallBox} />
			<motion.div style={smallBox} />
			<motion.div style={smallBox} />
			<motion.div style={smallBox} />
		</div>
	</div>
	<div style={css(layer)}>
		<div style={css(boxContainer)}>
			<motion.div style={box} />
		</div>
	</div>
</div>
