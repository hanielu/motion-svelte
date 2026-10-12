import { test } from "@playwright/test";

/**
 * Reorder with onReorder in startTransition / useTransition, or values from
 * useDeferredValue, with ~300ms item renders. The drag itself runs on motion
 * values, so the item must stay under the pointer however late the order
 * commits.
 */
const modes = ["transition", "useTransition", "deferred"];

const unsupported =
	"unsupported: React concurrent rendering (startTransition, useTransition, useDeferredValue); Svelte applies state changes synchronously";

test.describe("Concurrent React: Reorder", () => {
	for (const mode of modes) {
		test(`drag (${mode}) keeps the item under the pointer and settles stacked`, () => {
			test.skip(true, unsupported);
		});

		test(`drag (${mode}) drops the item in the slot under the pointer`, () => {
			test.skip(true, unsupported);
		});

		test(`drag (${mode}) calls onReorder once per new order`, () => {
			test.skip(true, unsupported);
		});
	}
});
