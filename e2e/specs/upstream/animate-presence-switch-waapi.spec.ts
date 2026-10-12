import { expect, test } from "@playwright/test";
import { should, trigger, visit, wait } from "../../harness/upstream.js";

test.describe("AnimatePresence with WAAPI animations", () => {
	// Is a differing number in StrictMode even a bug here?
	test("Correct number of animations trigger", async ({ page }) => {
		await visit(page, "?test=animate-presence-switch-waapi");
		await wait(page, 100);
		await trigger(page.locator("#switch"), "click", 10, 10);
		await wait(page, 400);
		await should(async () => {
			// Strict Mode works differently in 18/19, React 19 may fire more
			expect(await page.locator("#count").textContent()).toMatch(/^[234]$/);
		});
	});

	test("Interrupting exiting animation doesn't break exit", async ({ page }) => {
		const items = page.locator(".item");
		await visit(page, "?test=animate-presence-switch-waapi");
		await wait(page, 100);
		await should(async () => {
			const texts = await items.allTextContents();
			expect(texts.length).toBe(1);
			expect(texts[0]).toBe("0");
		});
		await trigger(page.locator("#switch"), "click", 10, 10);
		await wait(page, 100);
		await should(async () => {
			const texts = await items.allTextContents();
			expect(texts.length).toBe(2);
			expect(texts[0]).toBe("0");
			expect(texts[1]).toBe("1");
		});
		await wait(page, 300);
		await should(async () => {
			const texts = await items.allTextContents();
			expect(texts.length).toBe(1);
			expect(texts[0]).toBe("1");
		});
		await trigger(page.locator("#switch"), "click", 10, 10);
		await wait(page, 50);
		await trigger(page.locator("#switch"), "click", 10, 10);
		await wait(page, 50);
		await trigger(page.locator("#switch"), "click", 10, 10);
		await wait(page, 400);
		await should(async () => {
			const texts = await items.allTextContents();
			expect(texts.length).toBe(1);
			expect(texts[0]).toBe("0");
		});
	});

	test("Interrupting exiting animation fire more animations than expected", async ({ page }) => {
		await visit(page, "?test=animate-presence-switch-waapi");
		await wait(page, 100);
		await should(async () => {
			const texts = await page.locator(".item").allTextContents();
			expect(texts.length).toBe(1);
			expect(texts[0]).toBe("0");
		});
		await trigger(page.locator("#switch"), "click", 10, 10);
		await wait(page, 50);
		await trigger(page.locator("#switch"), "click", 10, 10);
		await wait(page, 400);
		await should(async () => {
			// Strict Mode works differently in 18/19, React 19 may fire more
			expect(await page.locator("#count").textContent()).toMatch(/^[4567]$/);
		});
	});
});
