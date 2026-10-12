import { test } from "@playwright/test";

/**
 * Shared layout (layoutId) and LayoutGroup with concurrent state updates:
 * startTransition, useTransition and useDeferredValue, with slow renders
 * that yield across frames.
 */
const modes = ["transition", "useTransition", "deferred"];

const unsupported =
	"unsupported: React concurrent rendering (startTransition, useTransition, useDeferredValue); Svelte applies state changes synchronously";

test.describe("Concurrent React: layoutId and LayoutGroup", () => {
	for (const mode of modes) {
		test(`basic (${mode}) underline animates between tabs`, () => {
			test.skip(true, unsupported);
		});

		test(`rapid (${mode}) underline retargets to the last tab`, () => {
			test.skip(true, unsupported);
		});

		test(`midAnimation (${mode}) underline reverses from its visual position`, () => {
			test.skip(true, unsupported);
		});

		test(`group (${mode}) LayoutGroup sibling animates without re-rendering`, () => {
			test.skip(true, unsupported);
		});
	}
});
