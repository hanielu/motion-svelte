/** @type {import("@sveltejs/vite-plugin-svelte").SvelteConfig} */
export default {
	compilerOptions: {
		// Force runes mode, except for third-party libraries. Can be removed in Svelte 6.
		runes: ({ filename }) => (filename.split(/[/\\]/).includes("node_modules") ? undefined : true),
	},
};
