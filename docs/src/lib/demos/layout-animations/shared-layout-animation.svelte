<script lang="ts">
	import { AnimatePresence, motion } from "motion-sv";

	const tabs = [
		{ icon: "🍅", label: "Tomato" },
		{ icon: "🥬", label: "Lettuce" },
		{ icon: "🧀", label: "Cheese" },
	];

	let selectedTab = $state(tabs[0]);
</script>

<div class="container">
	<nav class="nav">
		<ul class="tabs-container">
			{#each tabs as item (item.label)}
				<motion.li
					class="tab"
					initial={false}
					animate={{ backgroundColor: item.label === selectedTab.label ? "#eee" : "#eee0" }}
					onclick={() => (selectedTab = item)}
				>
					{`${item.icon} ${item.label}`}
					{#if item.label === selectedTab.label}
						<motion.div class="underline" layoutId="underline" />
					{/if}
				</motion.li>
			{/each}
		</ul>
	</nav>
	<div class="icon-container">
		<AnimatePresence mode="wait">
			{#key selectedTab.label}
				<motion.div
					class="icon"
					initial={{ y: 10, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					exit={{ y: -10, opacity: 0 }}
					transition={{ duration: 0.2 }}
				>
					{selectedTab.icon}
				</motion.div>
			{/key}
		</AnimatePresence>
	</div>
</div>

<style>
	.container {
		display: flex;
		flex-direction: column;
		width: 480px;
		height: 360px;
		max-width: calc(100% - 40px);
		max-height: calc(100% - 40px);
		border-radius: 10px;
		background: white;
		overflow: hidden;
		box-shadow:
			0 1px 1px hsl(0deg 0% 0% / 0.075),
			0 2px 2px hsl(0deg 0% 0% / 0.075),
			0 4px 4px hsl(0deg 0% 0% / 0.075),
			0 8px 8px hsl(0deg 0% 0% / 0.075),
			0 16px 16px hsl(0deg 0% 0% / 0.075),
			0 2px 2px hsl(0deg 0% 0% / 0.075),
			0 4px 4px hsl(0deg 0% 0% / 0.075),
			0 8px 8px hsl(0deg 0% 0% / 0.075),
			0 16px 16px hsl(0deg 0% 0% / 0.075);
	}

	.nav {
		height: 44px;
		padding: 5px 5px 0;
		border-bottom: 1px solid #eeeeee;
		border-radius: 10px 10px 0 0;
		background: #fdfdfd;
	}

	.tabs-container {
		display: flex;
		width: 100%;
		margin: 0;
		padding: 0;
		list-style: none;
		font-size: 14px;
		font-weight: 500;
	}

	.tabs-container :global(.tab) {
		position: relative;
		display: flex;
		flex: 1;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		min-width: 0;
		height: 24px;
		margin: 0;
		padding: 10px 15px;
		border-radius: 5px 5px 0 0;
		background: white;
		color: #0f1115;
		font-size: 14px;
		font-weight: 500;
		list-style: none;
		cursor: pointer;
		user-select: none;
	}

	.tabs-container :global(.underline) {
		position: absolute;
		right: 0;
		bottom: -2px;
		left: 0;
		height: 2px;
		background: #ff0088;
	}

	.icon-container {
		display: flex;
		flex: 1;
		justify-content: center;
		align-items: center;
	}

	.icon-container :global(.icon) {
		font-size: 128px;
	}
</style>
