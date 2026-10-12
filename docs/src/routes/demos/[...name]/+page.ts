import { error } from "@sveltejs/kit";
import type { Component } from "svelte";
import type { EntryGenerator, PageLoad } from "./$types";

// Each page's demos, not the components they're built from (in subfolders)
const demos = import.meta.glob<{ default: Component }>("/src/lib/demos/*/*.svelte");
const nameOf = (path: string) => path.slice("/src/lib/demos/".length, -".svelte".length);

export const entries: EntryGenerator = () => Object.keys(demos).map((path) => ({ name: nameOf(path) }));

export const load: PageLoad = async ({ params }) => {
	const demo = demos[`/src/lib/demos/${params.name}.svelte`];
	if (!demo) error(404, "No such demo");
	return { name: params.name, component: (await demo()).default };
};
