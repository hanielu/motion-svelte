<script lang="ts">
	import { LazyMotion, m } from "motion-sv";

	// Fetched after the first render, in a separate chunk
	const loadFeatures = () => import("./async/features.js").then((mod) => mod.default);
</script>

<LazyMotion features={loadFeatures}>
	<m.div
		class="ball"
		style={{ width: 80, height: 80, borderRadius: "50%", background: "#9911ff", cursor: "grab" }}
		initial={{ scale: 0 }}
		animate={{ scale: 1 }}
		drag
		dragSnapToOrigin
		whileDrag={{ scale: 1.2 }}
	/>
</LazyMotion>
