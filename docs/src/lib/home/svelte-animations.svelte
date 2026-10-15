<script lang="ts">
	import {
		AnimatePresence,
		animate,
		motion,
		useCurrentMotionValue,
		useInView,
		useMotionValue,
		useTransform,
	} from "motion-sv";
	import IconArrowUpRight from "~icons/lucide/arrow-up-right";

	// Teasers named after components in the collection, built here with motion-sv

	// Number Ticker: counts up to the collection's size once the banner is in view
	let banner = $state<HTMLElement>();
	const inView = useInView(
		() => banner,
		() => ({ once: true, amount: 0.5 })
	);
	const count = useMotionValue(0);
	const shown = useCurrentMotionValue(useTransform(count, Math.round));

	$effect(() => {
		if (!inView.current) return;
		const counting = animate(count, 90, { duration: 2, ease: "easeOut" });
		return () => counting.stop();
	});

	// Text Rotate: cycles through words
	const words = ["animate", "shimmer", "orbit", "delight"];
	let word = $state(0);

	$effect(() => {
		const timer = setInterval(() => (word = (word + 1) % words.length), 1800);
		return () => clearInterval(timer);
	});
</script>

<a
	class="banner"
	href="https://sv-animations.vercel.app"
	target="_blank"
	rel="noopener"
	bind:this={banner}
	aria-label="Svelte Animations: browse 90+ free animated components built with motion-sv"
>
	<div class="intro">
		<span class="eyebrow">Built with <span class="nowrap">motion-sv</span></span>
		<h2>Svelte Animations</h2>
		<p>
			90+ free, open-source animated components from Magic UI, Spell UI and Fancy Components, rebuilt for Svelte with
			<span class="nowrap">motion-sv</span>. Drop them into your app and make it move.
		</p>
		<span class="cta">Browse components <IconArrowUpRight /></span>
	</div>

	<div class="teasers" aria-hidden="true">
		<div class="teaser">
			<span class="ticker">{shown.current}+</span>
			<span class="label">Number Ticker</span>
		</div>

		<div class="teaser">
			<span class="sentence">
				Make it
				<span class="word">
					<AnimatePresence mode="wait" initial={false}>
						{#key word}
							<motion.span
								initial={{ y: "100%", opacity: 0 }}
								animate={{ y: 0, opacity: 1 }}
								exit={{ y: "-100%", opacity: 0 }}
								transition={{ type: "spring", visualDuration: 0.3, bounce: 0.25 }}
							>
								{words[word]}
							</motion.span>
						{/key}
					</AnimatePresence>
				</span>
			</span>
			<span class="label">Text Rotate</span>
		</div>

		<div class="teaser">
			<div class="orbit">
				<span class="core"></span>
				<motion.div
					class="path"
					animate={{ rotate: 360 }}
					transition={{ duration: 6, ease: "linear", repeat: Infinity }}
				>
					<span class="planet" style:--angle="0deg" style:--color="#ff3e00"></span>
					<span class="planet" style:--angle="120deg" style:--color="#0cdcf7"></span>
					<span class="planet" style:--angle="240deg" style:--color="#8df0cc"></span>
				</motion.div>
			</div>
			<span class="label">Orbiting Circles</span>
		</div>
	</div>
</a>

<style>
	.banner {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 1.25fr);
		align-items: center;
		gap: 2rem;
		margin-top: 1rem;
		padding: 2rem;
		border: 1px solid var(--border);
		border-radius: 1rem;
		background:
			radial-gradient(60rem 20rem at 100% 0%, rgb(153 17 255 / 0.12), transparent 60%),
			radial-gradient(40rem 20rem at 0% 100%, rgb(255 62 0 / 0.1), transparent 60%), var(--bg-subtle);
		text-decoration: none;
		transition: border-color 0.2s;
	}

	.banner:hover {
		border-color: color-mix(in srgb, var(--accent) 55%, var(--border));
	}

	.eyebrow {
		color: var(--accent);
		font-size: 0.8125rem;
		font-weight: 600;
		letter-spacing: 0.02em;
	}

	h2 {
		margin: 0.25rem 0 0.5rem;
		font-size: 1.75rem;
		letter-spacing: -0.03em;
	}

	p {
		margin: 0 0 1.25rem;
		color: var(--text-muted);
	}

	.cta {
		display: inline-flex;
		align-items: center;
		gap: 0.375rem;
		height: 2.5rem;
		padding: 0 1rem;
		border-radius: 0.625rem;
		background: var(--text);
		color: var(--bg);
		font-weight: 500;
	}

	.cta :global(svg) {
		transition: transform 0.2s;
	}

	.banner:hover .cta :global(svg) {
		transform: translate(2px, -2px);
	}

	.teasers {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 0.75rem;
	}

	.teaser {
		position: relative;
		display: grid;
		place-items: center;
		height: 10rem;
		padding-bottom: 1.5rem;
		border: 1px solid var(--border);
		border-radius: 0.75rem;
		background: var(--bg);
		overflow: hidden;
	}

	.label {
		position: absolute;
		bottom: 0.625rem;
		color: var(--text-muted);
		font-size: 0.75rem;
	}

	.ticker {
		font-size: 2.5rem;
		font-weight: 700;
		letter-spacing: -0.04em;
		font-variant-numeric: tabular-nums;
	}

	.sentence {
		display: flex;
		flex-direction: column;
		align-items: center;
		font-size: 1.125rem;
		font-weight: 600;
	}

	.word {
		display: grid;
		height: 1.6em;
		overflow: hidden;
		color: #9911ff;
	}

	.orbit {
		position: relative;
		width: 5.5rem;
		height: 5.5rem;
	}

	.core {
		position: absolute;
		inset: 35%;
		border-radius: 50%;
		background: #9911ff;
	}

	.orbit :global(.path) {
		position: absolute;
		inset: 0;
		border: 1px dashed var(--border);
		border-radius: 50%;
	}

	.planet {
		position: absolute;
		top: 50%;
		left: 50%;
		width: 0.875rem;
		height: 0.875rem;
		margin: -0.4375rem;
		border-radius: 50%;
		background: var(--color);
		transform: rotate(var(--angle)) translateY(-2.75rem);
	}

	.nowrap {
		white-space: nowrap;
	}

	@media (max-width: 52rem) {
		.orbit {
			scale: 0.75;
		}

		.banner {
			grid-template-columns: 1fr;
			padding: 1.5rem;
		}

		.teasers {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}

		.teaser {
			height: 8rem;
		}
	}
</style>
