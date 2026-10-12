<script lang="ts">
	import { useAnimate } from "motion-sv";

	// Scoping test (selector-based, like Motion docs):
	// - Bind `scope` to a container
	// - Call `animate('.scoped-target', ...)`
	// - Only descendants inside the scope should be affected
	const [scope, animate] = useAnimate<HTMLDivElement>();

	let scopedStatus = $state<"idle" | "running" | "pass" | "fail" | "error">("idle");
	let scopedTargetEl = $state<HTMLDivElement | null>(null);
	let outsideTargetEl = $state<HTMLDivElement | null>(null);

	let scopedOpacityAfter = $state<number | null>(null);
	let outsideOpacityAfter = $state<number | null>(null);
	let currentAnimation = $state<any>(null);

	function resetStyles() {
		if (scopedTargetEl) scopedTargetEl.style.opacity = "1";
		if (outsideTargetEl) outsideTargetEl.style.opacity = "1";
	}

	async function runScopedTest() {
		if (!scope.current || !scopedTargetEl || !outsideTargetEl) return;

		if (currentAnimation) currentAnimation.stop();

		scopedStatus = "running";
		scopedOpacityAfter = null;
		outsideOpacityAfter = null;
		resetStyles();

		// Selector scoping: '.scoped-target' should resolve relative to `scope.current`.
		const animation = animate(".scoped-target", { opacity: 0.2 }, { duration: 0.4 });

		currentAnimation = animation;

		try {
			await animation.finished;
			new Promise((resolve) => setTimeout(resolve, 0)).then(() => {
				const insideOpacity = parseFloat(getComputedStyle(scopedTargetEl).opacity);
				console.log("insideOpacity", insideOpacity);
				const outsideOpacity = parseFloat(getComputedStyle(outsideTargetEl).opacity);
				console.log("outsideOpacity", outsideOpacity);

				scopedOpacityAfter = Number.isFinite(insideOpacity) ? insideOpacity : null;
				outsideOpacityAfter = Number.isFinite(outsideOpacity) ? outsideOpacity : null;

				// Pass criteria:
				// - inside changes (towards 0.2)
				// - outside stays ~1
				const insideChanged = insideOpacity !== 1 && Math.abs(insideOpacity - 0.2) < 0.15;
				const outsideUntouched = Math.abs(outsideOpacity - 1) < 0.05;

				scopedStatus = insideChanged && outsideUntouched ? "pass" : "fail";
			});
		} catch {
			scopedStatus = "error";
		} finally {
			currentAnimation = null;
		}
	}
</script>

<div class="min-h-screen bg-neutral-950 text-neutral-100 p-6">
	<div class="mx-auto max-w-2xl space-y-5">
		<div>
			<h1 class="text-2xl font-bold">`useAnimate` scoping test</h1>
			<p class="mt-2 text-neutral-400">
				Runs a <code>animate('.scoped-target', ...)</code> selector inside the scope. The “Outside” element uses the same
				selector class and should remain unchanged.
			</p>
		</div>

		<div class="rounded-xl border border-neutral-800 bg-neutral-900/40 p-4">
			<div class="relative h-64 overflow-hidden rounded-lg border border-neutral-800 bg-neutral-950">
				<div
					bind:this={scope.current}
					class="absolute left-6 top-1/2 -translate-y-1/2 w-[260px] h-[140px] rounded-xl bg-indigo-500/20 border border-indigo-500/30 p-6"
				>
					<div
						bind:this={scopedTargetEl}
						class="scoped-target h-20 w-20 rounded-xl bg-indigo-500/90 shadow-lg flex items-center justify-center font-semibold text-neutral-950"
						style="opacity: 1;"
					>
						Scoped
					</div>
				</div>

				<div
					bind:this={outsideTargetEl}
					class="scoped-target absolute right-6 top-1/2 h-20 w-20 -translate-y-1/2 rounded-xl bg-neutral-100/10 shadow-lg flex items-center justify-center font-semibold text-neutral-100 scoped-target"
					style="opacity: 1;"
				>
					Outside
				</div>
			</div>

			<div class="mt-4 flex flex-col gap-3">
				<div class="flex flex-wrap items-center gap-3">
					<button
						class="rounded-lg bg-indigo-600 px-4 py-2 font-medium text-neutral-50 hover:bg-indigo-500 disabled:opacity-60 disabled:pointer-events-none"
						onclick={() => runScopedTest()}
						disabled={scopedStatus === "running"}
					>
						Run scoped selector animation
					</button>
				</div>

				<div class="text-sm text-neutral-300">
					Scoped result: <span class="ml-2 font-mono text-neutral-100">{scopedStatus}</span>
				</div>

				{#if scopedOpacityAfter !== null}
					<div class="text-sm text-neutral-300">
						Scoped opacity after:
						<span class="ml-2 font-mono text-neutral-100">{scopedOpacityAfter}</span>
					</div>
				{/if}

				{#if outsideOpacityAfter !== null}
					<div class="text-sm text-neutral-300">
						Outside opacity after:
						<span class="ml-2 font-mono text-neutral-100">{outsideOpacityAfter}</span>
					</div>
				{/if}
			</div>
		</div>
	</div>
</div>
