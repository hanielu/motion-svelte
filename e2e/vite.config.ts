import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

// Serves the ported upstream fixtures: http://localhost:5198/?test=<fixture-name>
export default defineConfig({
	plugins: [svelte()],
	server: {
		// Pages must never reload mid-test. Changed fixtures are picked up on the next page load; new ones only once the
		// server restarts (the fixture glob in src/main.ts isn't re-evaluated without HMR).
		hmr: false,
		watch: { ignored: ["**/playwright-report/**", "**/test-results/**"] },
	},
	optimizeDeps: {
		// Pre-bundle exactly motion-sv's dependencies at startup. Any dependency Vite discovers on first use instead
		// makes it reload the page mid-test.
		noDiscovery: true,
		include: [
			"motion-sv > framer-motion/dom",
			"motion-sv > motion-dom",
			"motion-sv > motion-utils",
			"motion-sv > hey-listen",
		],
	},
});
