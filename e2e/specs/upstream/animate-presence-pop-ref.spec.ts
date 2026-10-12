import { expect, test, type Page } from "@playwright/test";
import { should, trigger, visit, wait } from "../../harness/upstream.js";

/** `cy.stub(win.console, "error" | "warn")` from `onBeforeLoad`: collects console errors and warnings. */
function captureConsoleErrors(page: Page) {
	const consoleErrors: string[] = [];
	page.on("console", (msg) => {
		if (msg.type() === "error" || msg.type() === "warning") consoleErrors.push(msg.text());
	});
	return consoleErrors;
}

test.describe("AnimatePresence popLayout with refs", () => {
	test("does not trigger React 19 ref warning with forwardRef components using useImperativeHandle", async ({
		page,
	}) => {
		test.skip(
			true,
			"unsupported: React 19 element.ref warning from forwardRef + useImperativeHandle children; no React refs in Svelte (would pass trivially)"
		);
		// Capture console errors and warnings
		const consoleErrors = captureConsoleErrors(page);

		await visit(page, "?test=animate-presence-pop-ref");
		await wait(page, 200);
		// Verify at least the static element exists (always rendered)
		await should(async () => expect(await page.locator("#static").count()).toBeGreaterThan(0));
		// Click to trigger removal and popLayout behavior
		await trigger(page.locator("#static").locator(".."), "click", 60, 60);
		await wait(page, 200);
		// Verify no React 19 ref warning was logged
		const refWarning = consoleErrors.find(
			(msg) => msg.includes("element.ref") || msg.includes("Accessing element.ref")
		);
		expect(refWarning, "Should not have React 19 ref warning").toBeUndefined();
	});

	test("does not trigger React 19 ref warning with forwardRef components with direct ref", async ({ page }) => {
		test.skip(
			true,
			"unsupported: React 19 element.ref warning from forwardRef children; no React refs in Svelte (would pass trivially)"
		);
		// Capture console errors and warnings
		const consoleErrors = captureConsoleErrors(page);

		await visit(page, "?test=animate-presence-pop-ref&type=direct");
		await wait(page, 200);
		// Verify at least the static element exists (always rendered)
		await should(async () => expect(await page.locator("#static").count()).toBeGreaterThan(0));
		// Click to trigger removal
		await trigger(page.locator("#static").locator(".."), "click", 60, 60);
		await wait(page, 200);
		// Verify no React 19 ref warning was logged
		const refWarning = consoleErrors.find(
			(msg) => msg.includes("element.ref") || msg.includes("Accessing element.ref")
		);
		expect(refWarning, "Should not have React 19 ref warning").toBeUndefined();
	});
});
