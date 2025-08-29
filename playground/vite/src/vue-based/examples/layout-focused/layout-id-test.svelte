<script lang="ts">
	import { motion, createLayoutMotion, AnimatePresence } from "motion-sv";

	const allIngredients = [
		{ icon: "🍅", label: "Tomato" },
		{ icon: "🥬", label: "Lettuce" },
		{ icon: "🧀", label: "Cheese" },
		{ icon: "🥕", label: "Carrot" },
		{ icon: "🍌", label: "Banana" },
		{ icon: "🫐", label: "Blueberries" },
		{ icon: "🥂", label: "Champers?" },
	];

	const [tomato, lettuce, cheese, carrot] = allIngredients;
	const tabs = [tomato, lettuce, cheese, carrot];

	let selectedTab = $state(tabs[0]);

	const layout = createLayoutMotion(motion);
</script>

<div class="l-container">
	<nav class="nav">
		<layout.ul class="tabs-container">
			{#each tabs as item (item.label)}
				<layout.li
					class="tab"
					animate={{ backgroundColor: item.label === selectedTab.label ? "#eee" : "#eee0" }}
					onfocus={layout.update.with(() => (selectedTab = item))}
					onmouseover={layout.update.with(() => (selectedTab = item))}
					onmouseleave={layout.update.with(() => (selectedTab = item))}
					tabindex={0}
				>
					{`${item.icon} ${item.label}`}
					{#if item.label === selectedTab.label}
						<layout.div class="underline" layoutId="underline" />
					{/if}
				</layout.li>
			{/each}
		</layout.ul>
	</nav>
	<main class="icon-container">
		<AnimatePresence mode="wait">
			{#key selectedTab.label}
				<motion.div
					initial={{ y: 10, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					exit={{ y: -10, opacity: 0 }}
					transition={{ duration: 0.2 }}
					class="icon"
				>
					{selectedTab ? selectedTab.icon : "😋"}
				</motion.div>
			{/key}
		</AnimatePresence>
	</main>
</div>

<style>
	.l-container {
		width: 480px;
		height: 60vh;
		max-height: 360px;
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
		display: flex;
		flex-direction: column;
	}

	.nav {
		background: #fdfdfd;
		padding: 5px 5px 0;
		border-radius: 10px;
		border-bottom-left-radius: 0;
		border-bottom-right-radius: 0;
		border-bottom: 1px solid #eeeeee;
		height: 44px;
	}

	:global {
		.tabs-container {
			list-style: none;
			padding: 0;
			margin: 0;
			font-weight: 500;
			font-size: 14px;
			display: flex;
			width: 100%;
		}

		.tab {
			list-style: none;
			padding: 0;
			margin: 0;
			font-weight: 500;
			font-size: 14px;
			border-radius: 5px;
			border-bottom-left-radius: 0;
			border-bottom-right-radius: 0;
			width: 100%;
			padding: 10px 15px;
			position: relative;
			background: white;
			cursor: pointer;
			height: 24px;
			display: flex;
			justify-content: space-between;
			align-items: center;
			flex: 1;
			min-width: 0;
			user-select: none;
			color: #0f1115;
		}

		.underline {
			position: absolute;
			bottom: -2px;
			left: 0;
			right: 0;
			height: 2px;
			background: #83e6f7;
		}

		.icon-container {
			display: flex;
			justify-content: center;
			align-items: center;
			flex: 1;
		}

		.icon {
			font-size: 128px;
		}
	}
</style>
