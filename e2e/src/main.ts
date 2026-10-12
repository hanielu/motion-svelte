import { mount, type Component } from "svelte";
// Upstream's dev/react/src/index.css, so fixture geometry matches the React originals.
import "./index.css";

// Ported from motion's dev/react/src/tests. Loaded lazily so one broken fixture can't break the others.
const fixtures = import.meta.glob<{ default: Component }>("./fixtures/*.svelte");
const nameOf = (path: string) => path.slice("./fixtures/".length, -".svelte".length);

const target = document.getElementById("root")!;
const test = new URLSearchParams(location.search).get("test");

if (test) {
	const load = fixtures[`./fixtures/${test}.svelte`];
	if (!load) throw new Error(`Unknown fixture "${test}"`);
	const { default: Fixture } = await load();
	mount(Fixture, { target });
	document.documentElement.dataset.fixture = "mounted";
} else {
	target.innerHTML = `<ul>${Object.keys(fixtures)
		.map(nameOf)
		.map((name) => `<li><a href="?test=${name}">${name}</a></li>`)
		.join("")}</ul>`;
}
