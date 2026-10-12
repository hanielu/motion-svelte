<script lang="ts">
	import { createLayoutMotion } from "motion-sv";

	const layout = createLayoutMotion();
</script>

<layout.main class="content" style={{ borderRadius: 16 }}>
	<layout.div class="line" style={{ width: "70%", borderRadius: 6 }} />
	<layout.div class="line" style={{ width: "90%", borderRadius: 6 }} />
	<layout.div class="line" style={{ width: "55%", borderRadius: 6 }} />
</layout.main>
