import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	compilerOptions: { runes: true },

	kit: {
		alias: {
			"@": "./src/lib",
			runed: "./src/lib/vendor/runed/index.js",
			"test-utils": "./src/lib/shared/test-utils.js",
		},
	},
};

export default config;
