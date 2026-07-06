import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig, type PluginOption } from "vite";
import inlineSveltePlugin from "@hvniel/vite-plugin-svelte-inline-component/plugin";

export default defineConfig(({ mode }) => ({
	plugins: [
		sveltekit(),
		mode === "test" &&
			// The inline-component plugin is typed against an older vite major; the runtime hooks are compatible.
			(inlineSveltePlugin({
				fenceStart: "// svelte:defs",
				fenceEnd: "// sd",
			}) as unknown as PluginOption),
	],
	test: {
		expect: { requireAssertions: true },
		projects: [
			{
				extends: "./vite.config.ts",
				test: {
					name: "client",
					environment: "browser",
					browser: {
						enabled: true,
						provider: "playwright",
						instances: [{ browser: "chromium" }],
					},
					include: ["src/**/*.svelte.{test,spec}.{js,ts}"],
					exclude: ["src/lib/server/**"],
					setupFiles: ["./vitest-setup-client.ts"],
				},
			},
			{
				extends: "./vite.config.ts",
				test: {
					name: "server",
					environment: "node",
					include: ["src/**/*.{test,spec}.{js,ts}"],
					exclude: ["src/**/*.svelte.{test,spec}.{js,ts}"],
				},
			},
		],
	},
}));
