import { test } from "@playwright/test";

/**
 * Layout animations whose state updates are concurrent: startTransition,
 * useTransition and useDeferredValue. Slow renders make the concurrent render
 * yield across frames.
 */
const modes = ["transition", "useTransition", "deferred"];

const unsupported =
	"unsupported: React concurrent rendering (startTransition, useTransition, useDeferredValue); Svelte applies state changes synchronously";

test.describe("Concurrent React: layout", () => {
	for (const mode of modes) {
		test(`basic (${mode}) animates from the committed position`, () => {
			test.skip(true, unsupported);
		});

		test(`rapid (${mode}) batched updates retarget to the final state`, () => {
			test.skip(true, unsupported);
		});

		test(`interrupt (${mode}) urgent update mid-render animates both`, () => {
			test.skip(true, unsupported);
		});

		test(`midAnimation (${mode}) reverses from the current visual position`, () => {
			test.skip(true, unsupported);
		});

		test(`reverseBeforeCommit (${mode}) settles back without jumping`, () => {
			test.skip(true, unsupported);
		});
	}
});
