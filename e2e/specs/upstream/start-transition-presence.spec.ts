import { test } from "@playwright/test";

/**
 * AnimatePresence (sync / popLayout) with concurrent state updates, with slow
 * renders that yield across frames. mode="wait" is in
 * start-transition-presence-wait.spec.ts.
 */
const modes = ["transition", "useTransition"];

const unsupported =
	"unsupported: React concurrent rendering (startTransition, useTransition, useDeferredValue); Svelte applies state changes synchronously";

test.describe("Concurrent React: AnimatePresence", () => {
	for (const presence of ["sync", "popLayout"]) {
		for (const mode of [...modes, "deferred"]) {
			test(`remove (${presence}, ${mode}) exits and siblings animate`, () => {
				test.skip(true, unsupported);
			});
		}

		for (const mode of modes) {
			test(`toggleBeforeCommit (${presence}, ${mode}) ends where it started`, () => {
				test.skip(true, unsupported);
			});

			test(`reenterMidExit (${presence}, ${mode}) B re-enters once`, () => {
				test.skip(true, unsupported);
			});

			test(`exitDuringTransition (${presence}, ${mode}) exit completes while a transition renders`, () => {
				test.skip(true, unsupported);
			});
		}
	}
});
