import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

// Serves the ported upstream fixtures: http://localhost:5198/?test=<fixture-name>
export default defineConfig({
	plugins: [svelte()],
	server: {
		// Pages must never reload mid-test. New and changed fixtures are still picked up on the next page load.
		hmr: false,
		watch: { ignored: ["**/playwright-report/**", "**/test-results/**"] },
	},
	optimizeDeps: {
		// Pre-bundle exactly motion-sv's dependencies at startup. Discovering them on first use makes Vite reload the
		// page, and the automatic scan fails on motion-sv's dist (reorder/group.svelte ships TS in a non-TS script).
		noDiscovery: true,
		include: ["motion-sv > framer-motion/dom", "motion-sv > motion-dom", "motion-sv > motion-utils", "motion-sv > hey-listen"],
	},
});
