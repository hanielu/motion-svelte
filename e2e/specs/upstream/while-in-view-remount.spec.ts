import { expect, test, type Locator } from "@playwright/test";
import { should, visit, wait } from "../../harness/upstream.js";

const opacity = (locator: Locator) => locator.first().evaluate((el) => parseFloat(getComputedStyle(el).opacity));

test.describe("whileInView remount (#3079)", () => {
	test("Triggers whileInView on initial mount", async ({ page }) => {
		await visit(page, "?test=while-in-view-remount");
		await wait(page, 100);
		await page.locator("#go-projects").click();
		await wait(page, 200);
		await should(async () => {
			// Element should be visible (opacity 1) after mount
			expect(await opacity(page.locator("#card1"))).toBe(1);
		});
	});

	test("Triggers whileInView after remount (soft navigation)", async ({ page }) => {
		// Start on projects page
		await visit(page, "?test=while-in-view-remount");
		await wait(page, 100);
		await page.locator("#go-projects").click();
		await wait(page, 200);
		await should(async () => {
			expect(await opacity(page.locator("#card1"))).toBe(1);
		});

		// Navigate away (unmount)
		await page.locator("#go-home").click();
		await wait(page, 100);

		// Navigate back (remount - simulates soft navigation)
		await page.locator("#go-projects").click();
		await wait(page, 200);

		// Cards should animate again
		await should(async () => {
			expect(await opacity(page.locator("#card1"))).toBe(1);
		});
		await should(async () => {
			expect(await opacity(page.locator("#card2"))).toBe(1);
		});
	});

	test("Fires onViewportEnter after remount", async ({ page }) => {
		const inView = () =>
			page
				.locator("#card1")
				.first()
				.evaluate((el) => (el as HTMLElement).dataset.inView);

		// Start on projects page
		await visit(page, "?test=while-in-view-remount");
		await wait(page, 100);
		await page.locator("#go-projects").click();
		await wait(page, 200);
		await should(async () => {
			expect(await inView()).toBe("true");
		});

		// Navigate away
		await page.locator("#go-home").click();
		await wait(page, 100);

		// Navigate back (remount)
		await page.locator("#go-projects").click();
		await wait(page, 200);

		// onViewportEnter should fire again
		await should(async () => {
			expect(await inView()).toBe("true");
		});
	});
});
