import { test } from "@playwright/test";

/**
 * Suspense with a `layout` parent whose size depends on suspended content.
 */
const unsupported =
	"unsupported: React <Suspense> and concurrent rendering (startTransition, useTransition, useDeferredValue); Svelte has neither";

test.describe("Concurrent React: Suspense", () => {
	for (const mode of ["sync", "transition", "useTransition", "deferred"]) {
		test(`swap (${mode}) visible boundary suspends: card animates to revealed content`, () => {
			test.skip(true, unsupported);
		});

		test(`expand (${mode}) new boundary suspends: card animates to revealed content`, () => {
			test.skip(true, unsupported);
		});
	}

	for (const mode of ["sync", "transition"]) {
		test(`expandGroup (${mode}) LayoutGroup + layout fallback animates the reveal`, () => {
			test.skip(true, unsupported);
		});
	}
});
