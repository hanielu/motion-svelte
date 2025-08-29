<script lang="ts">
	import { MotionConfig, motion, createLayoutMotion, STOP_UPDATE } from "motion-sve";

	const TABS = ["Saved Sites", "Collections", "48 Following", "32 Followers"];

	let activeTab = $state(TABS[0]);
	let direction = $state<"horizontal" | "vertical">("horizontal");

	const layout = createLayoutMotion(motion);
	const setTab = layout.update.with((tab: string) => {
		if (tab === activeTab) return STOP_UPDATE;
		activeTab = tab;
	});
	const setDirection = layout.update.with(() => (direction = direction === "vertical" ? "horizontal" : "vertical"));
</script>

<div class="h-40 flex items-center relative w-[600px] h-64 mx-auto">
	<MotionConfig transition={{ type: "spring", bounce: 0, duration: 0.4 }}>
		<layout.ul
			class={[
				"mx-auto flex w-fit gap-2",
				direction === "horizontal" ? "flex-row justify-center" : "flex-col items-start",
			]}
		>
			{#each TABS as tab (tab)}
				<layout.li
					class={[
						"relative cursor-pointer px-2 py-1 text-sm outline-none transition-colors",
						activeTab === tab ? "text-gray-800" : "text-gray-700",
					]}
					tabindex={0}
					onfocus={() => setTab(tab)}
					onmouseenter={() => setTab(tab)}
					onmouseleave={() => setTab(tab)}
				>
					{#if activeTab === tab}
						<layout.div layoutId="tab-indicator" class="absolute inset-0 rounded-lg bg-black/5" />
					{/if}
					<span class="relative text-inherit">{tab}</span>
				</layout.li>
			{/each}
		</layout.ul>

		<button
			onclick={setDirection}
			aria-label={`Change direction to ${direction === "vertical" ? "horizontal" : "vertical"}`}
			class="absolute bottom-2 right-2 flex h-8 w-8 items-center justify-center rounded-lg text-black opacity-50 hover:bg-black/10 hover:opacity-100 focus-visible:opacity-100 dark:hover:bg-black/10 transition-all"
		>
			<motion.svg
				initial={false}
				animate={{ rotate: direction === "vertical" ? 0 : 90 }}
				className="size-3"
				viewBox="0 0 19 16"
				fill="none"
			>
				<path
					fill-rule="evenodd"
					clip-rule="evenodd"
					d="M11 0.482178L18.5178 7.9999L11 15.5177L9.2322 13.7499L13.7322 9.2499H0V6.7499H13.7322L9.2322 2.24995L11 0.482178Z"
					fill="currentColor"
				/>
			</motion.svg>
		</button>
	</MotionConfig>
</div>
