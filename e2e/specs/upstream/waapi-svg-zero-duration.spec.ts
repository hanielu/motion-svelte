import { expect, test, type Locator } from "@playwright/test";
import { nextFrame, visit } from "../../harness/upstream.js";

/**
 * A zero-duration animation reports completion before the frame that
 * applies its value, so wait for that frame instead.
 */
const computed = (target: Locator, property: "opacity" | "clipPath" | "filter") =>
	target.evaluate((el, property) => getComputedStyle(el)[property], property);

const inlineTransform = (target: Locator) => target.evaluate((el) => (el as SVGElement).style.transform);

/** `.get(selector)`: waits for a matching element like Cypress' default 4s command timeout. */
async function get(target: Locator) {
	await expect(target).toBeAttached({ timeout: 4000 });
	return target;
}

test.describe("waapi-svg-zero-duration", () => {
	test("Restores SVG opacity with a zero-duration animation", async ({ page }) => {
		await visit(page, "?test=waapi-svg-zero-duration");
		await page.locator("#toggle").click();
		const hidden = await get(page.locator('#chip[data-complete="hidden"]'));
		expect(await computed(hidden, "opacity")).toBe("0");
		await page.locator("#toggle").click();
		await nextFrame(page);
		expect(await computed(page.locator("#chip"), "opacity")).toBe("1");
	});

	test("Restores SVG transform with a zero-duration animation", async ({ page }) => {
		await visit(page, "?test=waapi-svg-zero-duration");
		await page.locator("#toggle").click();
		const hidden = await get(page.locator('#transform-target[data-complete="hidden"]'));
		expect(await inlineTransform(hidden)).toBe("translateX(50px)");
		await page.locator("#toggle").click();
		await nextFrame(page);
		expect(await inlineTransform(page.locator("#transform-target"))).toBe("translateX(0px)");
	});

	test("Restores SVG clipPath with a zero-duration animation", async ({ page }) => {
		await visit(page, "?test=waapi-svg-zero-duration");
		await page.locator("#toggle").click();
		const hidden = await get(page.locator('#clip-path-target[data-complete="hidden"]'));
		expect(await computed(hidden, "clipPath")).toContain("circle(0%");
		await page.locator("#toggle").click();
		await nextFrame(page);
		expect(await computed(page.locator("#clip-path-target"), "clipPath")).toContain("circle(50%");
	});

	test("Restores SVG filter with a zero-duration animation", async ({ page }) => {
		await visit(page, "?test=waapi-svg-zero-duration");
		await page.locator("#toggle").click();
		const hidden = await get(page.locator('#filter-target[data-complete="hidden"]'));
		expect(await computed(hidden, "filter")).toBe("blur(5px)");
		await page.locator("#toggle").click();
		await nextFrame(page);
		expect(await computed(page.locator("#filter-target"), "filter")).toBe("blur(0px)");
	});
});
