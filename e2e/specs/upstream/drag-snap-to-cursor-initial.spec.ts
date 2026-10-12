import { expect, test, type Page } from "@playwright/test";
import { bbox, nextFrame, should, trigger, triggerInView, visit, wait } from "../../harness/upstream.js";

async function expectBoxCenteredAt(page: Page, x: number, y: number) {
	const { left, top, width, height } = await bbox(page.locator("#box"));
	expect(Math.abs(left + width / 2 - x)).toBeLessThanOrEqual(1);
	expect(Math.abs(top + height / 2 - y)).toBeLessThanOrEqual(1);
}

async function snapAndDrag(page: Page) {
	const trig = page.locator("#trigger");
	await triggerInView(trig, "pointerdown", 50, 50);
	await nextFrame(page);
	await wait(page, 50);
	await expectBoxCenteredAt(page, 50, 50);

	await trigger(trig, "pointermove", 60, 60);
	await nextFrame(page);
	await wait(page, 50);
	await trigger(trig, "pointermove", 200, 100);
	await nextFrame(page);
	await wait(page, 50);
	await expectBoxCenteredAt(page, 200, 100);

	await trigger(trig, "pointerup", 200, 100);
	await wait(page, 50);
	await expectBoxCenteredAt(page, 200, 100);
}

test.describe("snapToCursor with initial coordinates", () => {
	test("centres the element under the pointer on every drag start", async ({ page }) => {
		await visit(page, "?test=drag-snap-to-cursor-initial");
		await wait(page, 200);
		await nextFrame(page);
		await nextFrame(page);
		await expectBoxCenteredAt(page, 650, 90);

		await snapAndDrag(page);
		await snapAndDrag(page);
		await snapAndDrag(page);
	});

	test("centres the element under the pointer after re-renders", async ({ page }) => {
		const trig = page.locator("#trigger");
		await visit(page, "?test=drag-snap-to-cursor-initial&rerender=true");
		await wait(page, 200);
		await nextFrame(page);
		await nextFrame(page);
		await expectBoxCenteredAt(page, 650, 90);

		await snapAndDrag(page);
		await should(async () => expect(await trig.getAttribute("data-drag-count")).toBe("1"));
		await snapAndDrag(page);
		await should(async () => expect(await trig.getAttribute("data-drag-count")).toBe("2"));
		await snapAndDrag(page);
	});
});
