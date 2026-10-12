import { test } from "@playwright/test";

const unsupported =
	"unsupported: React concurrent rendering (startTransition, useTransition); a Svelte state change renders and commits synchronously, so an exit can't complete between a transition's render and its commit";

test.describe("AnimatePresence: exit completes during a transition render", () => {
	for (const mode of ["sync", "popLayout"]) {
		for (const transition of ["start", "use"]) {
			test(`renders the child added by the transition (${mode}, ${transition})`, () => {
				test.skip(true, unsupported);
			});
		}
	}
});
