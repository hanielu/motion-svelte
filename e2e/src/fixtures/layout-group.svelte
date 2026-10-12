<script lang="ts">
	import { createLayoutMotion, LayoutGroup, motion, MotionConfig, type Transition } from "motion-sv";

	const transition: Transition = {
		layout: {
			type: "tween",
			duration: 0.2,
		},
	};

	const uid = $props.id();

	// App
	let visible = $state(false);
	const appLayout = createLayoutMotion();

	// Expander (its own component upstream, so its state change only re-renders itself)
	let expanded = $state(false);
	const expanderLayout = createLayoutMotion();
	const expanderId = `${uid}-expander`;

	// Button
	const buttonId = `${uid}-button`;

	const toggleExpanded = expanderLayout.update.with(() => (expanded = !expanded));
	const toggleVisible = () => {
		visible = !visible;
		appLayout.update();
		expanderLayout.update();
	};
</script>

<!--
	Upstream's expected tops (104/204) were recorded in Cypress 4's Electron (Chrome 80), which doesn't support
	flex gap, so the column's gap: 10 is left out here (with it, Chromium renders 114/224, React and Svelte alike).
-->
<div style="display: flex; justify-content: center; height: 100vh">
	<div style="display: flex; flex-direction: column; align-items: center; height: 100vh; width: 500px">
		{#if visible}
			<div style="background-color: green; width: 100px; height: 100px"></div>
		{/if}
		<LayoutGroup>
			<MotionConfig {transition}>
				<motion.div id="expander-wrapper" layout="position">
					<!-- Expander. Upstream wraps it in motion.create(Fragment), which has no Svelte equivalent. -->
					<expanderLayout.div
						id="expander"
						layoutId={expanderId}
						onclick={toggleExpanded}
						style={{
							height: expanded ? 100 : 25,
							backgroundColor: "red",
							marginBottom: 4,
							cursor: "pointer",
						}}
						transition={{ type: "tween" }}
					>
						{expanded ? "collapse" : "expand"} me
					</expanderLayout.div>
				</motion.div>
				<motion.div
					id="text-wrapper"
					layout="position"
					style={{
						display: "flex",
						gap: 4,
						alignItems: "center",
					}}
				>
					some text
					<LayoutGroup inherit="id">
						<!-- Button -->
						<appLayout.div
							id="button"
							layoutId={buttonId}
							style={{
								background: "blue",
								color: "white",
								borderRadius: 8,
								padding: 10,
								cursor: "pointer",
							}}
							onclick={toggleVisible}
						>
							Add child
						</appLayout.div>
					</LayoutGroup>
				</motion.div>
			</MotionConfig>
		</LayoutGroup>
	</div>
</div>
