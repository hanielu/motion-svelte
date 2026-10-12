<script lang="ts">
	import { animate, AnimatePresence, createLayoutMotion } from "motion-sv";
	import { mount, unmount } from "svelte";
	// Upstream renders <AppContent> with a second React root inside the shadow root; this fixture mounts itself there.
	import Self from "./animate-presence-pop-shadow-root.svelte";

	let { root }: { root?: ShadowRoot } = $props();

	const boxStyle = {
		width: "100px",
		height: "100px",
		backgroundColor: "red",
	};

	let state = $state(true);
	const params = new URLSearchParams(window.location.search);
	const position = params.get("position") || "static";
	const itemStyle = position === "relative" ? { ...boxStyle, position, top: 100, left: 100 } : boxStyle;
	const itemCss = `width: 100px; height: 100px; ${position === "relative" ? `position: ${position}; top: 100px; left: 100px;` : ""}`;

	let ref = $state<HTMLDivElement>();

	$effect(() => {
		if (!ref) return;

		animate(ref, { opacity: [0, 1] }, { duration: 1 });
		animate(ref, { opacity: [1, 0.5] }, { duration: 1 });
	});

	// <App>: attach a shadow root and render the content into it.
	let host = $state<HTMLDivElement>();

	$effect(() => {
		if (!host) return;

		const shadowRoot = host.shadowRoot ?? host.attachShadow({ mode: "open" });
		const app = mount(Self, { target: shadowRoot, props: { root: shadowRoot } });
		return () => {
			unmount(app);
		};
	});

	// motion-sv: layout animations need createLayoutMotion + an explicit update around the state change.
	const layout = createLayoutMotion();
</script>

{#if root}
	<section
		style="position: relative; display: flex; flex-direction: column; padding: 100px"
		onclick={layout.update.with(() => (state = !state))}
		role="presentation"
	>
		<!-- motion-sv: AnimatePresence has no `root` prop (upstream passes root={root}), so pop styles go to document.head. -->
		<AnimatePresence mode="popLayout">
			<layout.div id="a" transition={{ ease: () => 1 }} style={{ ...itemStyle }} />
			{#if state}
				<layout.div
					id="b"
					animate={{
						opacity: 1,
						transition: { duration: 0.001 },
					}}
					exit={{ opacity: 0, transition: { duration: 10 } }}
					style={{ ...itemStyle, backgroundColor: "green" }}
				/>
			{/if}
			<layout.div id="c" transition={{ ease: () => 1 }} style={{ ...itemStyle, backgroundColor: "blue" }} />
		</AnimatePresence>
		<div bind:this={ref} style="{itemCss} background-color: purple;"></div>
	</section>
{:else}
	<div id="shadow" bind:this={host}></div>
{/if}
