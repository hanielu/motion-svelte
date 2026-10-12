import { test } from "@playwright/test";

/**
 * AnimatePresence mode="wait" with concurrent state updates, with slow
 * renders that yield across frames.
 */
const modes = ["transition", "useTransition", "deferred"];

const unsupported =
	"unsupported: React concurrent rendering (startTransition, useTransition, useDeferredValue); Svelte applies state changes synchronously";

test.describe("Concurrent React: AnimatePresence mode=wait", () => {
	for (const mode of modes) {
		test(`swap (${mode}) exits A fully before B enters`, () => {
			test.skip(true, unsupported);
		});

		test(`rapid (${mode}) ends on the last child only`, () => {
			test.skip(true, unsupported);
		});

		test(`midExit (${mode}) switching again mid-exit ends on C`, () => {
			test.skip(true, unsupported);
		});

		test(`exitDuringTransition (${mode}) exit completes while the switch to C renders`, () => {
			test.skip(true, unsupported);
		});
	}
});
