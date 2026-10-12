import adapter from "@sveltejs/adapter-static";
import { sveltekit } from "@sveltejs/kit/vite";
import { mdsx } from "mdsx";
import { readFile } from "node:fs/promises";
import Icons from "unplugin-icons/vite";
import { defineConfig, type Plugin } from "vite";
import { mdsxConfig } from "./mdsx.config.js";
import { highlight } from "./src/lib/markdown/highlight.js";

/**
 * `import demo from "./basic.svelte?demo"` gives `{ component, code }`: the live component and its highlighted
 * source, for `<Demo {demo} />`.
 */
function demos(): Plugin {
	// The `.js` suffix keeps vite-plugin-svelte from compiling the generated module as a component.
	const prefix = "\0demo:";
	const suffix = ".js";
	return {
		name: "docs-demos",
		enforce: "pre",
		async resolveId(id, importer) {
			if (!id.endsWith("?demo")) return;
			const resolved = await this.resolve(id.slice(0, -"?demo".length), importer, { skipSelf: true });
			return resolved && prefix + resolved.id + suffix;
		},
		async load(id) {
			if (!id.startsWith(prefix)) return;
			const file = id.slice(prefix.length, -suffix.length);
			this.addWatchFile(file);
			const code = await highlight(await readFile(file, "utf8"), "svelte");
			return `import component from ${JSON.stringify(file)};\nexport default { component, code: ${JSON.stringify(code)} };`;
		},
	};
}

export default defineConfig({
	plugins: [
		Icons({ compiler: "svelte" }),
		demos(),
		sveltekit({
			adapter: adapter({ fallback: "404.html" }),
			extensions: [".svelte", ".md"],
			preprocess: [mdsx(mdsxConfig)],
			// mdsx puts highlighted code in a page's own template, inside the blueprint's <pre> component rather than a
			// <pre> element, so Svelte would collapse its line breaks and indentation.
			dynamicCompileOptions: ({ filename }) => (filename.endsWith(".md") ? { preserveWhitespace: true } : undefined),
			compilerOptions: {
				// Force runes mode, except for dependencies
				runes: ({ filename }) => (filename.split(/[/\\]/).includes("node_modules") ? undefined : true),
			},
			prerender: { handleMissingId: "warn" },
		}),
	],
});
