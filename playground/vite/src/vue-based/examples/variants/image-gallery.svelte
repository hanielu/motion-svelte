<script lang="ts">
	import { motion, AnimatePresence, wrap } from "motion-sv";

	const images = [
		"https://d33wubrfki0l68.cloudfront.net/dd23708ebc4053551bb33e18b7174e73b6e1710b/dea24/static/images/wallpapers/shared-colors@2x.png",
		"https://d33wubrfki0l68.cloudfront.net/49de349d12db851952c5556f3c637ca772745316/cfc56/static/images/wallpapers/bridge-02@2x.png",
		"https://d33wubrfki0l68.cloudfront.net/594de66469079c21fc54c14db0591305a1198dd6/3f4b1/static/images/wallpapers/bridge-01@2x.png",
	];

	const variants = {
		enter: (direction: number) => {
			return {
				x: direction > 0 ? 1000 : -1000,
				opacity: 0,
			};
		},
		center: {
			zIndex: 1,
			x: 0,
			opacity: 1,
		},
		exit: (direction: number) => {
			return {
				zIndex: 0,
				x: direction < 0 ? 1000 : -1000,
				opacity: 0,
			};
		},
	};

	/**
	 * Experimenting with distilling swipe offset and velocity into a single variable, so the
	 * less distance a user has swiped, the more velocity they need to register as a swipe.
	 * Should accomodate longer swipes and short flicks without having binary checks on
	 * just distance thresholds and velocity > 0.
	 */
	const swipeConfidenceThreshold = 10000;
	const swipePower = (offset: number, velocity: number) => {
		return Math.abs(offset) * velocity;
	};

	let page = $state(0);
	let direction = $state(0);

	// We only have 3 images, but we paginate them absolutely (ie 1, 2, 3, 4, 5...) and
	// then wrap that within 0-2 to find our image ID in the array below. By passing an
	// absolute page index as the `motion` component's `key` prop, `AnimatePresence` will
	// detect it as an entirely new image. So you can infinitely paginate as few as 1 images.
	const imageIndex = $derived(wrap(0, images.length, page));

	const paginate = (newDirection: number) => {
		page = page + newDirection;
		direction = newDirection;
	};
</script>

<AnimatePresence initial={false} custom={direction}>
	{#key page}
		<motion.img
			src={images[imageIndex]}
			draggable="false"
			custom={direction}
			{variants}
			initial="enter"
			animate="center"
			exit="exit"
			transition={{
				x: { type: "spring", stiffness: 300, damping: 30 },
				opacity: { duration: 0.2 },
			}}
			drag="x"
			dragConstraints={{ left: 0, right: 0 }}
			dragElastic={1}
			onDragEnd={(e, { offset, velocity }) => {
				const swipe = swipePower(offset.x, velocity.x);

				if (swipe < -swipeConfidenceThreshold) {
					paginate(1);
				} else if (swipe > swipeConfidenceThreshold) {
					paginate(-1);
				}
			}}
		/>
	{/key}
</AnimatePresence>
<button class="next" onclick={() => paginate(1)}>
	{"‣"}
</button>
<button class="prev" onclick={() => paginate(-1)}>
	{"‣"}
</button>

<style>
	:global {
		body {
			width: 100vw;
			height: 100vh;
			background: #151515;
			overflow: hidden;
			padding: 0;
			margin: 0;
			display: flex;
			justify-content: center;
			align-items: center;
		}

		.example-container {
			width: 100vw;
			height: 100vh;
			position: relative;
			display: flex;
			justify-content: center;
			align-items: center;
		}

		.next,
		.prev {
			top: calc(50% - 20px);
			position: absolute;
			background: white;
			border-radius: 30px;
			width: 40px;
			height: 40px;
			display: flex;
			justify-content: center;
			align-items: center;
			user-select: none;
			cursor: pointer;
			font-weight: bold;
			font-size: 18px;
			z-index: 2;
		}

		.next {
			right: 10px;
		}

		.prev {
			left: 10px;
			transform: scale(-1);
		}

		img {
			position: absolute;
			max-width: 100vw;
		}

		.refresh {
			padding: 10px;
			position: absolute;
			background: rgba(0, 0, 0, 0.4);
			border-radius: 10px;
			width: 20px;
			height: 20px;
			top: 10px;
			right: 10px;
			display: flex;
			justify-content: center;
			align-items: center;
			cursor: pointer;
		}
	}
</style>
