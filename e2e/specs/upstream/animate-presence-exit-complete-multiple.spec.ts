import { expect, test } from "@playwright/test";
import { should, trigger, visit, wait } from "../../harness/upstream.js";

/**
 * Regression test for issue #3233:
 * AnimatePresence onExitComplete should fire exactly once per exit,
 * even with shared layoutId cycling through multiple AnimatePresence instances.
 */
test.describe("AnimatePresence onExitComplete", () => {
	test("Only fires once when layoutId child exits and re-enters", async ({ page }) => {
		test.fail(
			true,
			"motion-sv: done-count stays 0, expected 1; AnimatePresence onExitComplete never fires for an exiting child without an `exit` prop (layoutId-only), and the layoutId hop made right after mount doesn't animate (snapshots skipped until a frame after mount), so the chain stalls at index 1"
		);
		const doneCount = page.locator("#done-count");
		await visit(page, "?test=animate-presence-exit-complete-multiple");
		await wait(page, 2000); // Wait for initial layout animations to settle
		await should(async () => expect(await doneCount.textContent()).toBe("0"));
		await trigger(page.locator("#start-1"), "click", 10, 10);
		await wait(page, 3000); // Wait for all layout animations to complete
		await should(async () => expect(await doneCount.textContent()).toBe("1"));
	});
});
