import { expect, test } from "@playwright/test";
import { should, trigger, visit, wait } from "../../harness/upstream.js";

test.describe("Cancelled Animation", () => {
	test("Allows the animation to be marked complete", async ({ page }) => {
		test.skip(true, "unsupported: motion-sv has no useInstantLayoutTransition() hook");
		const cancellable = page.locator("[data-testid='cancellable']");
		await visit(page, "?test=layout-cancelled-finishes");
		await trigger(cancellable, "click");
		await wait(page, 200);
		await should(async () => expect(await cancellable.count()).toBe(0));
	});
});
