import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	compilerOptions: { runes: true },

	kit: {
		// adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
		// See https://svelte.dev/docs/kit/adapters for more information about adapters.
		adapter: adapter(),

		alias: {
			'@': './src/lib',
			'framer-motion/dist/es': './src/lib/framer-motion/dist/es',
			// 'framer-motion/dist/es/render/store.mjs': './src/lib/framer-motion/dist/es/render/store.mjs',
			// 'framer-motion/dist/es/projection/node/HTMLProjectionNode.mjs':
			// 	'./src/lib/framer-motion/dist/es/projection/node/HTMLProjectionNode.mjs',
			// 'framer-motion/dist/es/projection/styles/scale-border-radius.mjs':
			// 	'./src/lib/framer-motion/dist/es/projection/styles/scale-border-radius.mjs',
			// 'framer-motion/dist/es/projection/styles/scale-box-shadow.mjs':
			// 	'./src/lib/framer-motion/dist/es/projection/styles/scale-box-shadow.mjs',
			// 'framer-motion/dist/es/projection/styles/scale-correction.mjs':
			// 	'./src/lib/framer-motion/dist/es/projection/styles/scale-correction.mjs',
			// 'framer-motion/dist/es/projection/node/state.mjs': 'node_modules/framer-motion/dist/es/projection/node/state.mjs',
			// 'framer-motion/dist/es/render/html/HTMLVisualElement.mjs':
			// 	'./src/lib/framer-motion/dist/es/render/html/HTMLVisualElement.mjs',
			// 'framer-motion/dist/es/render/svg/SVGVisualElement.mjs':
			// 	'./src/lib/framer-motion/dist/es/render/svg/SVGVisualElement.mjs',
			// 'framer-motion/dist/es/animation/interfaces/motion-value.mjs':
			// 	'./src/lib/framer-motion/dist/es/animation/interfaces/motion-value.mjs',
			// 'framer-motion/dist/es/render/utils/setters.mjs': './src/lib/framer-motion/dist/es/render/utils/setters.mjs',
			// 'framer-motion/dist/es/utils/reduced-motion/state.mjs':
			// 	'./src/lib/framer-motion/dist/es/utils/reduced-motion/state.mjs',
			// 'framer-motion/dist/es/utils/delay.mjs': './src/lib/framer-motion/dist/es/utils/delay.mjs',
		},
	},
};

export default config;
