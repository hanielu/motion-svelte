<script lang="ts">
	import { motion, type Variants } from "motion-sv";

	let count = $state(0);
	let complete = $state(false);

	// replace with your real work
	const doWork = () => new Promise((r) => setTimeout(r, 12000));
	const atLeast = (p: Promise<unknown>, ms: number) => Promise.allSettled([p, new Promise((r) => setTimeout(r, ms))]);

	$effect(() => {
		count;
		complete = false;
		atLeast(doWork(), 10_000).then(() => (complete = true));
	});

	const root: Variants = {
		hidden: { opacity: 0 },
		show: { opacity: 1, transition: { staggerChildren: 0.4 } },
	};

	const textV: Variants = {
		hidden: { opacity: 0, y: 12 },
		show: { opacity: 1, y: 0, transition: { duration: 0.45 } },
	};

	// track reveal from center: left and right inset animate 50% -> 0%
	const shellV: Variants = {
		hidden: { "--t": "50%", opacity: 0 },
		show: {
			"--t": "0%",
			opacity: 1,
			transition: { duration: 0.6, ease: "easeOut", when: "beforeChildren" },
		},
	};

	// progress after reveal: 0% -> 90% over 10s, then 100% on complete
	const progressV: Variants = {
		hidden: { "--p": "0%" },
		show: { "--p": "90%", transition: { duration: 10, ease: "linear" } },
		done: { "--p": "100%", transition: { duration: 0.35, ease: "easeOut" } },
	};
</script>

<div class="h-screen flex items-center justify-center">
	<div class="flex flex-col gap-8">
		<div class="flex justify-center">
			<button class="bg-gray-200 px-2 cursor-pointer" onclick={() => count++}>replay</button>
		</div>

		{#key count}
			<motion.div variants={root} initial="hidden" animate="show" class="flex flex-col gap-4">
				<motion.p variants={textV} class="text-center">Generating prompts</motion.p>

				<div class="relative mx-auto w-[200px] h-5">
					<motion.div class="absolute inset-0 bg-pink-300 rounded-full overflow-hidden track" variants={shellV}>
						<motion.div
							class="absolute inset-0 bg-red-800 rounded-full progress"
							variants={progressV}
							initial="hidden"
							animate={complete ? "done" : "show"}
						/>
					</motion.div>
				</div>
			</motion.div>
		{/key}
	</div>
</div>

<style>
	:global {
		/* Track reveal from center */
		.track {
			clip-path: inset(0 var(--t, 50%) 0 var(--t, 50%) round 9999px);
			will-change: clip-path;
		}
		/* Progress fill from left */
		.progress {
			clip-path: inset(0 calc(100% - var(--p, 0%)) 0 0 round 9999px);
			will-change: clip-path;
		}
	}
</style>
