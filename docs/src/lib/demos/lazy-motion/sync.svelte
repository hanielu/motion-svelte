<script lang="ts">
	import { LazyMotion, domAnimation, m } from "motion-sv";
</script>

<LazyMotion features={domAnimation}>
	<m.div
		style={{ width: 100, height: 100, borderRadius: 20, background: "#ff3e00" }}
		initial={{ opacity: 0, scale: 0.5 }}
		animate={{ opacity: 1, scale: 1 }}
		whileHover={{ rotate: 90 }}
		whilePress={{ scale: 0.9 }}
	/>
</LazyMotion>
