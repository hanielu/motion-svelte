import { expect, test, type Locator, type Page } from "@playwright/test";
import { bbox, should, trigger, visit, wait, type BoundingBox } from "../../harness/upstream.js";

/** Upstream's local `expectBbox`: plain assertions, retried by the enclosing `should`. */
async function expectBbox(target: Locator, expectedBbox: BoundingBox) {
	expect(await bbox(target)).toEqual(expectedBbox);
}

function computed(target: Locator, property: "borderRadius" | "opacity") {
	return target.first().evaluate((el, property) => window.getComputedStyle(el)[property], property);
}

async function runScriptCrossfade(page: Page, args: string) {
	await visit(page, `?test=layout-shared-lightbox-crossfade${args}`);
	await wait(page, 50);
	await should(async () => {
		await expectBbox(page.locator("#item-parent"), { top: 40, left: 210, width: 180, height: 580 });
	});
	await should(async () => {
		await expectBbox(page.locator("#item-child"), { top: 305, left: 275, width: 50, height: 50 });
	});
	// Open lightbox
	await trigger(page.locator("#item-child"), "click");
	await wait(page, 50);
	await should(async () => {
		const $box = page.locator("#item-parent");
		expect(await computed($box, "borderRadius")).toBe("8.33333% / 12.5%");
		expect(await computed($box, "opacity")).toBe("0");
		await expectBbox($box, { top: 130, left: 200, width: 600, height: 400 });
	});
	await should(async () => {
		const $box = page.locator("#item-child");
		expect(await computed($box, "borderRadius")).toBe("50%");
		expect(await computed($box, "opacity")).toBe("0");
		await expectBbox($box, { top: 180, left: 250, width: 50, height: 50 });
	});
	await should(async () => {
		const $box = page.locator("#parent");
		expect(await computed($box, "borderRadius")).toBe("50px");
		expect(await computed($box, "opacity")).toBe("1");
		await expectBbox($box, { top: 130, left: 200, width: 600, height: 400 });
	});
	await should(async () => {
		const $box = page.locator("#child");
		expect(await computed($box, "borderRadius")).toBe("25px");
		expect(await computed($box, "opacity")).toBe("0.5");
		await expectBbox($box, { top: 180, left: 250, width: 50, height: 50 });
	});
	// Close lightbox
	await trigger(page.locator("#overlay"), "click");
	await wait(page, 50);
	await should(async () => {
		const $box = page.locator("#item-parent");
		expect(await computed($box, "borderRadius")).toBe("0px");
		expect(await computed($box, "opacity")).toBe("1");
		await expectBbox($box, { top: 40, left: 210, width: 180, height: 580 });
	});
	await should(async () => {
		const $box = page.locator("#item-child");
		expect(await computed($box, "borderRadius")).toBe("25px");
		expect(await computed($box, "opacity")).toBe("0.5");
		await expectBbox($box, { top: 305, left: 275, width: 50, height: 50 });
	});
}

test.describe("Shared layout lightbox example, crossfade", () => {
	test("Correctly animates between items and lightbox with instant transition", async ({ page }) => {
		await runScriptCrossfade(page, "&instant=true");
	});
	test("Correctly animates between items and lightbox with very fast transition", async ({ page }) => {
		await runScriptCrossfade(page, "");
	});
});

// runScriptSwitch and "Shared layout lightbox example, switch" are commented out upstream.
