<script lang="ts">
	import { createLayoutMotion, LayoutGroup, motion, MotionConfig, type Transition } from "motion-sv";

	/**
	 * #button is in its own LayoutGroup, so toggling #expander re-measures
	 * #text-wrapper but not #button, which must follow its parent via its
	 * relative target. Clicking #button also moves it right within
	 * #text-wrapper, so its own animation has a relative component.
	 */
	const transition: Transition = {
		layout: { type: "tween", ease: "linear", duration: 10 },
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
	// App's re-render re-renders Expander too
	const toggleVisible = () => {
		visible = !visible;
		appLayout.update();
		expanderLayout.update();
	};
</script>

<div style="display: flex; flex-direction: column; gap: 10px; align-items: center">
	{#if visible}
		<div style="background: green; width: 100px; height: 100px"></div>
	{/if}
	<LayoutGroup>
		<MotionConfig {transition}>
			<motion.div layout="position">
				<!-- Expander -->
				<expanderLayout.div
					id="expander"
					layoutId={expanderId}
					onclick={toggleExpanded}
					style={{
						width: 100,
						height: expanded ? 100 : 25,
						background: "red",
					}}
				/>
			</motion.div>
			<motion.div id="text-wrapper" layout="position" style={{ display: "flex", gap: 4 }}>
				{visible ? "some longer text" : "some text"}
				<LayoutGroup inherit="id">
					<!-- Button -->
					<appLayout.div
						id="button"
						layoutId={buttonId}
						onclick={toggleVisible}
						style={{ background: "blue", padding: 10 }}
					>
						Add child
					</appLayout.div>
				</LayoutGroup>
			</motion.div>
		</MotionConfig>
	</LayoutGroup>
</div>
