import { expect, test, type Locator, type Page } from "@playwright/test";
import { bbox, nextFrame, should, visit, type BoundingBox } from "../../harness/upstream.js";

/**
 * Upstream's `pointer(el, type, x, y)`, at viewport coordinates. Events passed together are dispatched in one task,
 * like the consecutive `pointer` calls in one of upstream's `.then` callbacks, so they land within the same frame.
 */
function pointer(target: Locator, ...events: [type: string, x: number, y: number][]) {
	return target.first().evaluate((el, events) => {
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

const draggable = (page: Page) => page.locator("[data-testid='draggable']");

async function startDrag(page: Page) {
	await visit(page, "?test=drag-release-before-frame");
	/**
	 * Wait for React 19 StrictMode's post-paint remount, which would
	 * otherwise end a gesture started on the first frame.
	 */
	await nextFrame(page);
	await nextFrame(page);
	const start = await bbox(draggable(page));
	await pointer(
		draggable(page),
		["pointerdown", start.left + 5, start.top + 5],
		["pointermove", start.left + 15, start.top + 15]
	);
	await nextFrame(page);
	await nextFrame(page);
	const { left, top } = await bbox(draggable(page));
	expect(left - start.left, "x offset after first move").toBe(10);
	expect(top - start.top, "y offset after first move").toBe(10);

	return start;
}

async function expectRestingAt(page: Page, start: BoundingBox, x: number, y: number) {
	await nextFrame(page);
	await nextFrame(page);
	await should(async () => expect(await page.locator("#drag-end-offset").textContent()).toBe(`${x},${y}`));
	const { left, top } = await bbox(draggable(page));
	expect(left - start.left, "x offset at rest").toBe(x);
	expect(top - start.top, "y offset at rest").toBe(y);
}

test.describe("Drag release before the next frame", () => {
	test("Applies a pointermove followed by pointerup within the same frame", async ({ page }) => {
		const start = await startDrag(page);

		await pointer(
			draggable(page),
			["pointermove", start.left + 105, start.top + 105],
			["pointerup", start.left + 105, start.top + 105]
		);

		await expectRestingAt(page, start, 100, 100);
	});

	test("Applies a pointermove when a frame runs before pointerup", async ({ page }) => {
		const start = await startDrag(page);

		await pointer(draggable(page), ["pointermove", start.left + 105, start.top + 105]);
		await nextFrame(page);
		await pointer(draggable(page), ["pointerup", start.left + 105, start.top + 105]);

		await expectRestingAt(page, start, 100, 100);
	});
});
