import { expect, test, type Locator } from "@playwright/test";
import { should, trigger, visit, wait } from "../../harness/upstream.js";

test.describe("waapi", () => {
	const read = (box: Locator) =>
		box.evaluate((el) => ({
			opacity: getComputedStyle(el).opacity,
			width: el.getBoundingClientRect().width,
			text: (el as HTMLElement).innerText,
		}));

	test("Animations are correctly interrupted", async ({ page }) => {
		const box = page.locator("#box");
		await visit(page, "?test=waapi-interrupt");
		await wait(page, 500);
		await should(async () => {
			const { opacity, width } = await read(box);
			expect(opacity).not.toBe("1");
			expect(width).not.toBe(100);
		});
		await trigger(box, "click", 250, 250);
		await wait(page, 100);
		await should(async () => {
			const { opacity, width } = await read(box);
			expect(opacity).not.toBe("1");
			expect(Math.floor(width)).not.toBe(100);
		});
	});

	test("Default duration doesn't override duration: 0", async ({ page }) => {
		const box = page.locator("#box");
		await visit(page, "?test=waapi-zero-duration");
		await wait(page, 50);
		await should(async () => {
			const { opacity, width } = await read(box);
			expect(opacity).toBe("0");
			expect(width).toBe(200);
		});
		await trigger(box, "click", 250, 250);
		await wait(page, 200);
		await should(async () => {
			const { opacity, width } = await read(box);
			expect(opacity).toBe("1");
			expect(Math.floor(width)).toBe(100);
		});
	});

	test("Can stop before keyframes resolved", async ({ page }) => {
		await visit(page, "?test=waapi-immediate-stop");
		await wait(page, 100);
		await should(async () => expect((await read(page.locator("#box"))).text).not.toBe("Error"));
		await should(async () => expect(await page.locator("iframe").count()).toBe(0));
	});

	test("Interrupt animations with pre-generated keyframes correctly", async ({ page }) => {
		await visit(page, "?test=waapi-interrupt-pregenerated-keyframes");
		await wait(page, 100);
		await should(async () => expect(await page.locator("iframe").count()).toBe(0));
	});

	test("Pregenerates no-op keyframes without error", async ({ page }) => {
		await visit(page, "?test=waapi-pregenerate-noop");
		await wait(page, 100);
		await should(async () => expect(await page.locator("iframe").count()).toBe(0));
	});

	// Skipping in CI as it's flaky
	test.skip("Should match WAAPI and main thread startTimes, and allow explicitly setting startTime", async ({ page }) => {
		const html = (selector: string) => page.locator(selector).evaluateAll((els) => els.map((el) => el.innerHTML));

		await visit(page, "?test=waapi-sync");
		await wait(page, 2000);
		// Automatically recorded startTime should be the same between main thread and WAAPI
		await should(async () => {
			const [waapi, sync] = await html(".auto-timer");
			expect(waapi).toBe(sync);
		});
		// Explicitly defined startTime should be the same between main thread and WAAPI
		await should(async () => {
			const [waapi, sync] = await html(".explicit-timer");
			expect(sync).toBe("101");
			expect(waapi).toBe("101");
			expect(waapi).toBe(sync);
		});
		// Explicitly defined startTime should not be the same as automatically defined startTime
		await should(async () => {
			const [syncAuto, syncExplicit] = await html(".sync-timer");
			expect(syncAuto).not.toBe(syncExplicit);
		});
		await should(async () => {
			const [waapiAuto, waapiExplicit] = await html(".waapi-timer");
			expect(waapiAuto).not.toBe(waapiExplicit);
		});
	});
});
