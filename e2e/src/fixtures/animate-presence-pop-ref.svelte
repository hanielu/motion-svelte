<script lang="ts">
	import { AnimatePresence, createLayoutMotion } from "motion-sv";

	const containerStyles = "position: relative; display: flex; flex-direction: column; padding: 100px;";

	const boxStyles = {
		width: "100px",
		height: "100px",
		backgroundColor: "red",
	};

	let state = $state(true);
	const params = new URLSearchParams(window.location.search);
	const testType = params.get("type") || "imperative";

	/**
	 * Upstream's <Box>: forwardRef + useImperativeHandle exposing `flash()` over the element ref.
	 * Svelte has no forwardRef/useImperativeHandle; the handle is a plain object over a bound element.
	 */
	let elementRef = $state<HTMLElement | SVGElement | null>(null);
	const boxRef = {
		flash: () => {
			if (elementRef) {
				elementRef.style.opacity = "0.5";
				setTimeout(() => {
					if (elementRef) {
						elementRef.style.opacity = "1";
					}
				}, 100);
			}
		},
	};

	// Upstream's <BoxWithDirectRef>: forwardRef straight to the motion element.
	let directRef = $state<HTMLElement | SVGElement | null>(null);

	// motion-sv: layout animations need createLayoutMotion + an explicit update around the state change.
	const layout = createLayoutMotion();
</script>

<div style={containerStyles} onclick={layout.update.with(() => (state = !state))} role="presentation">
	<AnimatePresence mode="popLayout">
		<layout.div id="static" style={{ ...boxStyles, backgroundColor: "gray" }} />
		{#if state}
			{#if testType === "imperative"}
				<layout.div
					bind:ref={elementRef}
					id="box"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1, transition: { duration: 0.001 } }}
					exit={{ opacity: 0, transition: { duration: 10 } }}
					style={{ ...boxStyles, backgroundColor: "green" }}
				/>
			{:else}
				<layout.div
					bind:ref={directRef}
					id="box"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1, transition: { duration: 0.001 } }}
					exit={{ opacity: 0, transition: { duration: 10 } }}
					style={{ ...boxStyles, backgroundColor: "blue" }}
				/>
			{/if}
		{/if}
	</AnimatePresence>
	<div id="result" data-state={state ? "shown" : "hidden"}></div>
</div>
