import { expect, test, type Locator } from "@playwright/test";
import { bbox, nextFrame, should, visit, type BoundingBox } from "../../harness/upstream.js";

/** Dispatches each `[type, x, y]` pointer event on the element in one task, like upstream's `.then` callbacks. */
function pointer(target: Locator, ...events: [type: string, x: number, y: number][]) {
	return target.evaluate((el, events) => {
		for (const [type, x, y] of events) {
			el.dispatchEvent(
				new PointerEvent(type, {
					clientX: x,
					clientY: y,
					isPrimary: true,
					bubbles: true,
					pointerId: 1,
					button: 0,
					pointerType: "mouse",
				})
			);
		}
	}, events);
}

/** `expect(actual).to.be.closeTo(expected, delta)` */
function expectCloseTo(actual: number, expected: number, delta: number) {
	expect(Math.abs(actual - expected)).toBeLessThanOrEqual(delta);
}

test.describe("Reorder release before the next frame", () => {
	test("Reorders when the final move arrives in the same frame as pointerup", async ({ page }) => {
		const tomatoEl = page.locator("#Tomato");
		const cucumberEl = page.locator("#Cucumber");

		await visit(page, "?test=drag-to-reorder");
		const cucumber: BoundingBox = await bbox(cucumberEl);
		await nextFrame(page);
		await nextFrame(page);
		const tomato: BoundingBox = await bbox(tomatoEl);
		const x = tomato.left + 10;
		await pointer(tomatoEl, ["pointerdown", x, tomato.top + 10], ["pointermove", x, tomato.top + 15]);
		await nextFrame(page);
		await pointer(tomatoEl, ["pointermove", tomato.left + 10, tomato.top + 35]);
		await nextFrame(page);
		// 55px down: past Cucumber's centre, released within the frame
		const y = tomato.top + 65;
		await pointer(tomatoEl, ["pointermove", tomato.left + 10, y], ["pointerup", tomato.left + 10, y]);
		await should(async () => {
			const ids = await tomatoEl.evaluate((el) =>
				[...el.parentElement!.children].map((child) => child.id).filter(Boolean)
			);
			expect(ids.slice(0, 2)).toEqual(["Cucumber", "Tomato"]);
			expectCloseTo((await bbox(tomatoEl)).top, cucumber.top, 2);
		});
		await should(async () => {
			expectCloseTo((await bbox(cucumberEl)).top, tomato.top, 2);
		});
	});
});
