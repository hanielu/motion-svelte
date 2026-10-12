import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
import UnoCSS from "unocss/vite";
import Icons from "unplugin-icons/vite";

export default defineConfig(({ mode }) => {
	return {
		plugins: [UnoCSS(), Icons({ compiler: "svelte" }), sveltekit()],
		build: {
			// don't minify for debug/dev builds
			minify: mode === "development" ? false : true,
		},
	};
});
