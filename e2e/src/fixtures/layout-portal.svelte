<script lang="ts">
	import { createLayoutMotion } from "motion-sv";

	let count = $state(0);

	const size = $derived(count === 0 ? 100 : 300);

	const layout = createLayoutMotion();

	// Stands in for React's createPortal(child, document.body).
	function portal(node: Element) {
		document.body.appendChild(node);
		return () => node.remove();
	}
</script>

<layout.div
	id="parent"
	style={{
		background: "red",
		width: size,
		height: size,
	}}
	onclick={layout.update.with(() => (count = count + 1))}
	transition={{ duration: 10, ease: () => 0.5 }}
>
	<layout.div
		{@attach portal}
		id="child"
		style={{ width: 100, height: 100, background: "blue" }}
		transition={{ duration: 10, ease: () => 0.5 }}
		data-framer-portal-id="parent"
	/>
</layout.div>
