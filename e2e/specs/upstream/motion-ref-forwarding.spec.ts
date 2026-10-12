import { expect, test } from "@playwright/test";
import { should, visit, wait } from "../../harness/upstream.js";

test.describe("Motion ref forwarding", () => {
	test("RefObject receives the DOM element", async ({ page }) => {
		await visit(page, "?test=motion-ref-forwarding");
		await wait(page, 100);
		await expect(page.locator("#ref-object-target")).toBeAttached();
		await page.locator("#check-ref").click();
		await wait(page, 50);
		await should(async () => expect(await page.locator("#ref-object-value").getAttribute("data-value")).toBe("DIV"));
	});

	test("Callback ref is called with element on mount", async ({ page }) => {
		await visit(page, "?test=motion-ref-forwarding");
		await wait(page, 100);
		await should(async () =>
			expect(await page.locator("#callback-mount-called").getAttribute("data-value")).toBe("true")
		);
		await should(async () =>
			expect(await page.locator("#callback-mount-value").getAttribute("data-value")).toBe("DIV")
		);
	});

	test("Callback ref cleanup is handled on unmount", async ({ page }) => {
		await visit(page, "?test=motion-ref-forwarding");
		await wait(page, 100);
		// Unmount the components
		await page.locator("#toggle").click();
		await wait(page, 100);
		// Either cleanup function is called (React 19 pattern)
		// OR callback ref is called with null (React 18 pattern)
		const unmountCalled = (await page.locator("#callback-unmount-called").getAttribute("data-value")) === "true";
		const cleanupCalled = (await page.locator("#cleanup-called").getAttribute("data-value")) === "true";
		// Either unmount or cleanup should be called
		expect(unmountCalled || cleanupCalled).toBe(true);
	});
});
