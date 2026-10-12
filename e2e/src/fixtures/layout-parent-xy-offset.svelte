<script lang="ts">
	import { createLayoutMotion, motion } from "motion-sv";

	const items = ["a", "b", "c", "d", "e"];

	// Per-instance state of upstream's <Tabs /> component.
	class Tabs {
		selectedIndex = $state(0);
		uuid: string;
		constructor(uuid: string) {
			this.uuid = uuid;
		}
	}

	const uid = $props.id();
	const tabs = [new Tabs(`${uid}-0`), new Tabs(`${uid}-1`)];

	const layout = createLayoutMotion();
</script>

{#snippet tabsView(tabs: Tabs)}
	<div style="display: flex; gap: 10px; height: 64px; width: 500px; margin-bottom: 12px">
		{#each items as item, index (item)}
			<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
			<div
				onclick={layout.update.with(() => (tabs.selectedIndex = index))}
				style="flex: 1; border-radius: 8px; position: relative; display: flex; align-items: center; justify-content: center; background: #eee"
			>
				<div style="position: relative; z-index: 1; color: white">
					{item}
				</div>
				{#if tabs.selectedIndex === index}
					<layout.div
						layoutId={"selected-" + tabs.uuid}
						class="indicator"
						style={{
							position: "absolute",
							top: 4,
							left: 4,
							right: 4,
							bottom: 4,
							background: "#444ccc",
							borderRadius: 8,
						}}
					/>
				{/if}
			</div>
		{/each}
	</div>
{/snippet}

<div style="padding: 12px">
	<motion.div id="motion-parent" style={{ x: 50, y: 50 }}>
		<div style="margin-bottom: 12px">Motion (x: 50, y: 50)</div>
		{@render tabsView(tabs[0])}
	</motion.div>
	<div style="transform: translate3d(50px, 50px, 0)">
		<div style="margin-bottom: 12px">Transform</div>
		{@render tabsView(tabs[1])}
	</div>
	<div id="result"></div>
</div>
