<script lang="ts">
	import { motion, useAnimate, useMotionValue, arc } from "motion-sv";

	/**
	 * ==============   Constants   ================
	 */
	const PRODUCT_SIZE = 160;
	const BASKET_BOX = 56;
	const FLY_SCALE = BASKET_BOX / PRODUCT_SIZE;

	type Direction = "auto" | "cw" | "ccw";

	interface AddToBasketProps {
		strength?: number;
		peak?: number;
		rotate?: number;
		duration?: number;
		basketVelocityFactor?: number;
		direction?: Direction;
	}

	// Svelte 5 $props rune with default values
	let {
		strength = 0.5,
		peak = 0.15,
		rotate = 0.9,
		duration = 0.45,
		basketVelocityFactor = 0.05,
		direction = "cw",
	}: AddToBasketProps = $props();

	/**
	 * ==============   State & Logic   ================
	 */
	// Svelte 5 $state rune (replaces useState/ref)
	let isFlying = $state(false);

	const [scope, animate] = useAnimate();

	let productRef = $state<HTMLDivElement | null>(null);
	let basketRef = $state<HTMLElement | null>(null);
	let ringRef = $state<HTMLDivElement | null>(null);

	const productX = useMotionValue(0);
	const productY = useMotionValue(0);

	const addToBasket = async () => {
		const product = productRef;
		const basket = basketRef;
		const ring = ringRef;

		if (!product || !basket || !ring || isFlying) return;
		isFlying = true;

		const from = product.getBoundingClientRect();
		const to = basket.getBoundingClientRect();
		const dx = to.left + to.width / 2 - (from.left + from.width / 2);
		const dy = to.top + to.height / 2 - (from.top + from.height / 2);

		// Fly into the basket, shrinking to its size, then clip it away
		await animate(
			product,
			{
				x: dx,
				y: dy,
				scale: FLY_SCALE,
				opacity: [1, 1, 0],
			},
			{
				duration,
				path: arc({
					strength,
					peak,
					rotate,
					direction: direction === "auto" ? undefined : direction,
				}),
				ease: [0.74, 0.18, 0.93, 0.69],
				opacity: { inherit: true, times: [0, 0.95, 1] },
			}
		);

		// Knock the basket up and to the right
		animate(
			basket,
			{ x: 0, y: 0 },
			{
				type: "spring",
				stiffness: 500,
				damping: 12,
				x: {
					inherit: true,
					velocity: productX.getVelocity() * basketVelocityFactor,
				},
				y: {
					inherit: true,
					velocity: productY.getVelocity() * basketVelocityFactor,
				},
			}
		);

		// Ripple an outline out from the basket
		animate(ring, { scale: [1, 2.2], opacity: [0.8, 0] }, { duration: 0.5, ease: "easeOut" });

		// Snap the now-invisible product back to its resting spot
		animate(
			product,
			{
				x: 0,
				y: 0,
				scale: 0.9,
				rotate: 0,
				opacity: 0,
				clipPath: "inset(0%)",
			},
			{ duration: 0 }
		);

		// Bring a fresh product back into view
		await animate(
			product,
			{ opacity: 1, scale: 1 },
			{
				scale: { type: "spring", visualDuration: 0.4, bounce: 0.35 },
				opacity: { duration: 0.25, ease: "easeOut" },
			}
		);

		isFlying = false;
	};
</script>

<div bind:this={scope.current} class="stage">
	<div bind:this={basketRef} class="basket">
		<motion.div bind:ref={ringRef} class="ring" />
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="26"
			height="26"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
		>
			<path d="m15 11-1 9" />
			<path d="m19 11-4-7" />
			<path d="M2 11h20" />
			<path d="m3.5 11 1.6 7.4a2 2 0 0 0 2 1.6h9.8a2 2 0 0 0 2-1.6l1.7-7.4" />
			<path d="M4.5 15.5h15" />
			<path d="m5 11 4-7" />
			<path d="m9 11 1 9" />
		</svg>
	</div>

	<div class="center">
		<motion.div bind:ref={productRef} class="product" style={{ x: productX, y: productY }}>
			<span class="glyph">👟</span>
		</motion.div>

		<div class="meta">
			<span class="name">Campus 00s</span>
			<span class="price">£128</span>
		</div>

		<motion.button
			type="button"
			onclick={addToBasket}
			disabled={isFlying}
			whileHover={{ scale: 1.03 }}
			whilePress={{ scale: 0.97 }}
			class="button"
			style={{
				opacity: isFlying ? 0.55 : 1,
				pointerEvents: isFlying ? "none" : "auto",
			}}
		>
			Add to basket
		</motion.button>
	</div>
</div>

<style>
	:global {
		/**
   * ==============   Styles   ================
   */
		.stage {
			position: absolute;
			inset: 0;
			display: flex;
			align-items: center;
			justify-content: center;
			overflow: hidden;
			font-family: var(--font-mono);
			color: var(--foreground);
		}

		.basket {
			position: absolute;
			top: 80px;
			right: 80px;
			width: 56px;
			height: 56px;
			display: flex;
			align-items: center;
			justify-content: center;
			background: var(--layer);
			border: 1px solid var(--border);
			color: var(--accent);
			will-change: transform;
		}

		.ring {
			position: absolute;
			inset: -1px;
			border: 1px solid var(--accent);
			opacity: 0;
			pointer-events: none;
			will-change: transform, opacity;
		}

		.center {
			display: flex;
			flex-direction: column;
			align-items: center;
			gap: 18px;
		}

		.product {
			width: 160px;
			height: 160px;
			display: flex;
			align-items: center;
			justify-content: center;
			background: var(--layer);
			border: 1px solid var(--border);
			will-change: transform, opacity, clip-path;
		}

		.glyph {
			font-size: 84px;
			line-height: 1;
			user-select: none;
		}

		.meta {
			display: flex;
			align-items: baseline;
			gap: 12px;
			font-family: var(--font-mono);
			font-size: 13px;
			letter-spacing: 0.04em;
		}

		.name {
			color: var(--foreground);
		}

		.price {
			color: var(--accent);
		}

		.button {
			margin-top: 4px;
			padding: 13px 26px;
			border: none;
			background: var(--accent);
			color: var(--background);
			font-family: var(--font-mono);
			font-size: 12px;
			letter-spacing: 0.12em;
			text-transform: uppercase;
			cursor: pointer;
		}
	}
</style>
