import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import path from "path";
import UnoCSS from "unocss/vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
	plugins: [UnoCSS(), svelte()],
	build: {
		minify: mode === "development" ? false : true,
	},
	resolve: {
		alias: {
			$lib: path.resolve(__dirname, "./src/lib"),
			"@": path.resolve(__dirname, "src"),
			// "framer-motion/dist/es/animation/interfaces/visual-element.mjs": path.resolve(
			// 	__dirname,
			// 	"node_modules/framer-motion/dist/es/animation/interfaces/visual-element.mjs"
			// ),
			// "framer-motion/dist/es/animation/interfaces/visual-element-target.mjs": path.resolve(
			// 	__dirname,
			// 	"node_modules/framer-motion/dist/es/animation/interfaces/visual-element-target.mjs"
			// ),
			// "framer-motion/dist/es/animation/sequence/create.mjs": path.resolve(
			// 	__dirname,
			// 	"node_modules/framer-motion/dist/es/animation/sequence/create.mjs"
			// ),
			// "framer-motion/dist/es/animation/utils/default-transitions.mjs": path.resolve(
			// 	__dirname,
			// 	"node_modules/framer-motion/dist/es/animation/utils/default-transitions.mjs"
			// ),

			// //
			// "framer-motion/dist/es/render/store.mjs": path.resolve(
			// 	__dirname,
			// 	"node_modules/framer-motion/dist/es/render/store.mjs"
			// ),
			// "framer-motion/dist/es/projection/node/HTMLProjectionNode.mjs": path.resolve(
			// 	__dirname,
			// 	"node_modules/framer-motion/dist/es/projection/node/HTMLProjectionNode.mjs"
			// ),
			// "framer-motion/dist/es/projection/styles/scale-border-radius.mjs": path.resolve(
			// 	__dirname,
			// 	"node_modules/framer-motion/dist/es/projection/styles/scale-border-radius.mjs"
			// ),
			// "framer-motion/dist/es/projection/styles/scale-box-shadow.mjs": path.resolve(
			// 	__dirname,
			// 	"node_modules/framer-motion/dist/es/projection/styles/scale-box-shadow.mjs"
			// ),
			// "framer-motion/dist/es/projection/styles/scale-correction.mjs": path.resolve(
			// 	__dirname,
			// 	"node_modules/framer-motion/dist/es/projection/styles/scale-correction.mjs"
			// ),
			// "framer-motion/dist/es/projection/node/state.mjs": path.resolve(
			// 	__dirname,
			// 	"node_modules/framer-motion/dist/es/projection/node/state.mjs"
			// ),
			// "framer-motion/dist/es/render/html/HTMLVisualElement.mjs": path.resolve(
			// 	__dirname,
			// 	"node_modules/framer-motion/dist/es/render/html/HTMLVisualElement.mjs"
			// ),
			// "framer-motion/dist/es/render/svg/SVGVisualElement.mjs": path.resolve(
			// 	__dirname,
			// 	"node_modules/framer-motion/dist/es/render/svg/SVGVisualElement.mjs"
			// ),
			// "framer-motion/dist/es/animation/interfaces/motion-value.mjs": path.resolve(
			// 	__dirname,
			// 	"node_modules/framer-motion/dist/es/animation/interfaces/motion-value.mjs"
			// ),
			// "framer-motion/dist/es/render/utils/setters.mjs": path.resolve(
			// 	__dirname,
			// 	"node_modules/framer-motion/dist/es/render/utils/setters.mjs"
			// ),
			// "framer-motion/dist/es/utils/reduced-motion/state.mjs": path.resolve(
			// 	__dirname,
			// 	"node_modules/framer-motion/dist/es/utils/reduced-motion/state.mjs"
			// ),
			// "framer-motion/dist/es/utils/delay.mjs": path.resolve(
			// 	__dirname,
			// 	"node_modules/framer-motion/dist/es/utils/delay.mjs"
			// ),
		},
	},
}));
