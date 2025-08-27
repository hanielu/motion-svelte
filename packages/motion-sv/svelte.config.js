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
			// THE order of these is important, else there will be errors with the framer-motion imports
			"framer-motion/dist/es": "./src/lib/vendor/framer-motion/dist/es",
			"framer-motion/dom": "./src/lib/vendor/framer-motion/dist/es/dom.mjs",
			"framer-motion/types": "./src/lib/vendor/framer-motion/dist/es/index.d.ts",
			"framer-motion": "./src/lib/vendor/framer-motion/dist/es/index.mjs",
			runed: "./src/lib/vendor/runed/index.js",
			"test-utils": "./src/lib/shared/test-utils.js",
		},
	},
};

export default config;
