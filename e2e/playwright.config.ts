import { defineConfig } from "@playwright/test";

const PLAYGROUND_PORT = 5199;
const FIXTURES_PORT = 5198;

export default defineConfig({
	fullyParallel: true,
	forbidOnly: true,
	globalSetup: "./harness/warm-up.ts",
	reporter: [["list"], ["html", { open: "never" }], ["./harness/parity-reporter.ts"]],
	use: { browserName: "chromium" },
	projects: [
		{
			// Frame-by-frame traces of every playground example, compared against committed baselines.
			// Runs on virtual time, so it is deterministic: no retries.
			name: "playground",
			testDir: "./specs/playground",
			retries: 0,
			use: {
				baseURL: `http://localhost:${PLAYGROUND_PORT}`,
				viewport: { width: 1280, height: 800 },
				contextOptions: { reducedMotion: "no-preference" },
			},
		},
		{
			// motion's own Cypress suite (packages/framer-motion/cypress/integration) ported to Svelte fixtures.
			// Real time, like upstream, with upstream's retry count and Cypress' viewport and command timeout.
			name: "upstream",
			testDir: "./specs/upstream",
			retries: 2,
			use: {
				baseURL: `http://localhost:${FIXTURES_PORT}`,
				viewport: { width: 1000, height: 660 },
				actionTimeout: 4000,
				trace: "retain-on-failure",
			},
		},
	],
	webServer: [
		{
			command: `bunx vite --port ${PLAYGROUND_PORT} --strictPort`,
			cwd: "../playground/vite",
			url: `http://localhost:${PLAYGROUND_PORT}`,
			reuseExistingServer: true,
		},
		{
			command: `bunx vite --port ${FIXTURES_PORT} --strictPort`,
			url: `http://localhost:${FIXTURES_PORT}`,
			reuseExistingServer: true,
		},
	],
});
