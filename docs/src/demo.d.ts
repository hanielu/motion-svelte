// `import demo from "./basic.svelte?demo"`, served by the `docs-demos` Vite plugin.
declare module "*?demo" {
	import type { Component } from "svelte";

	const demo: { component: Component; code: string };
	export default demo;
}
