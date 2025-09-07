<script lang="ts">
	import { m, LazyMotion } from "motion-sv";

	const loadFeatures = import("./features").then((m) => m.default);
</script>

<LazyMotion features={loadFeatures}>
	<m.div class="w-10 h-10 bg-red-500" whileHover={{ scale: 2 }}>Hello</m.div>
</LazyMotion>
