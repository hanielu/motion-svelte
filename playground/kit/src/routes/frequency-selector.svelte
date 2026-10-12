<script lang="ts">
	import { createLayoutMotion, AnimatePresence, type Transition, useInView, type UseInViewOptions } from "motion-sv";
	import CodeBrackets from "~icons/codex/brackets";
	import CheckFilled from "~icons/bitcoin-icons/check-filled";

	const layout = createLayoutMotion();
	const spring: Transition = { type: "spring", stiffness: 250, damping: 20 };

	const PERIOD = ["Daily", "Weekly", "Monthly", "Yearly"];

	let showPeriod = $state(false);
	let selectedPeriod = $state("Daily");

	function handleShowPeriod() {
		layout.update();
		showPeriod = !showPeriod;
	}

	function updateSelectedPeriod(p: string) {
		layout.update();
		selectedPeriod = p;
	}

	let element: HTMLDivElement | null = $state(null);
	let view = useInView(
		() => element!,
		() => ({ once: true }) as any
	);

	$effect(() => {
		// use in here
		console.log(view.current);
	});
</script>

<div class="s-screen bg-#FEFEFE flex-s-center">
	<layout.div
		class={["bg-#F6F6F6 fw-medium w-370px text-#757575 rd-full p-2", showPeriod ? "flex-s-center" : "flex-s-end"]}
	>
		<div class={["flex", showPeriod && "justify-between gap-2 w-full"]}>
			<layout.div
				transition={spring}
				class={[
					"text-#2B2B2B bg-#FEFEFE overflow-hidden",
					showPeriod ? "rd-full flex-s-center p-1" : "rd-l-full py-2 pl-3 pr-1 flex-s-end",
				]}
			>
				<AnimatePresence mode="wait">
					{#if showPeriod}
						<!-- PERIOD SELECTOR -->
						<layout.div class="flex-s-center">
							{#each PERIOD as period}
								<button onclick={() => updateSelectedPeriod(period)} class="px-3 py-1 relative">
									<AnimatePresence>
										{#if selectedPeriod == period}
											<layout.div
												layoutId="period-indicator"
												transition={spring}
												class="abs inset-0 rd-full bg-#f6f6f6"
											/>
										{/if}

										<span class="relative z-2">
											{period}
										</span>
									</AnimatePresence>
								</button>
							{/each}
						</layout.div>
					{:else}
						<!-- DEFAULT SELECTED PERIOD -->
						<layout.div class="ml-a" exit={{ filter: "blur(2px)", transition: { duration: 5 } }}>Daily</layout.div>
					{/if}
				</AnimatePresence>
			</layout.div>

			<!-- EDIT BTN -->
			<button
				onclick={handleShowPeriod}
				class="text-#B8B8B8 {showPeriod ? 'bg-black rd-9999px' : 'bg-#FEFEFE rd-r-9999px'} shrink-0 px-2.5"
			>
				<AnimatePresence mode="wait" initial={false}>
					<div class="s-full flex-s-center">
						{#if !showPeriod}
							<CodeBrackets />
						{:else}
							<CheckFilled class="stroke-2 stroke-white" />
						{/if}
					</div>
				</AnimatePresence>
			</button>
		</div>
	</layout.div>
</div>
