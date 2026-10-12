import { expect, test, type Locator } from "@playwright/test";
import { bbox, nextFrame, should, trigger, visit, wait, type BoundingBox } from "../../harness/upstream.js";

/** This spec's own `expectBbox` (not the harness' exact one): ±2px, retried like `.should`. */
function expectBbox(element: Locator, expectedBbox: BoundingBox) {
	return should(async () => {
		const box = await bbox(element);
		/**
		 * Using within as this test is measuring differently on different Mac screens
		 */
		expect(box.left).toBeGreaterThanOrEqual(expectedBbox.left - 2);
		expect(box.left).toBeLessThanOrEqual(expectedBbox.left + 2);
		expect(box.top).toBeGreaterThanOrEqual(expectedBbox.top - 2);
		expect(box.top).toBeLessThanOrEqual(expectedBbox.top + 2);
		expect(box.width).toBeGreaterThanOrEqual(expectedBbox.width - 2);
		expect(box.width).toBeLessThanOrEqual(expectedBbox.width + 2);
		expect(box.height).toBeGreaterThanOrEqual(expectedBbox.height - 2);
		expect(box.height).toBeLessThanOrEqual(expectedBbox.height + 2);
	});
}

test.describe("Drag to reorder", () => {
	test("Y axis", async ({ page }) => {
		const tomato = page.locator("#Tomato");
		const cucumber = page.locator("#Cucumber");
		await visit(page, "?test=drag-to-reorder");
		await wait(page, 50);
		await expectBbox(tomato, {
			height: 68,
			left: 350,
			top: 174,
			width: 340,
		});
		await expectBbox(cucumber, {
			height: 68,
			left: 350,
			top: 253,
			width: 340,
		});
		await nextFrame(page);
		await nextFrame(page);
		await trigger(tomato, "pointerdown", 360, 175);
		await wait(page, 50);
		await trigger(tomato, "pointermove", 360, 180);
		await nextFrame(page);
		await wait(page, 50);
		await trigger(tomato, "pointermove", 360, 200);
		await nextFrame(page);
		await wait(page, 50);
		await trigger(tomato, "pointermove", 360, 220);
		await nextFrame(page);
		await wait(page, 100);
		await expectBbox(tomato, {
			height: 68,
			left: 350,
			top: 249,
			width: 340,
		});
		await expectBbox(cucumber, {
			height: 68,
			left: 350,
			top: 174,
			width: 340,
		});
		await trigger(tomato, "pointerup", 360, 220);
		await wait(page, 100);
		await expectBbox(tomato, {
			height: 68,
			left: 350,
			top: 252,
			width: 340,
		});
		await trigger(cucumber, "pointerdown", 360, 175);
		await wait(page, 50);
		await trigger(cucumber, "pointermove", 360, 180);
		await nextFrame(page);
		await wait(page, 50);
		await trigger(cucumber, "pointermove", 360, 200);
		await nextFrame(page);
		await wait(page, 50);
		await trigger(cucumber, "pointermove", 360, 220);
		await nextFrame(page);
		await wait(page, 100);
		await expectBbox(cucumber, {
			height: 68,
			left: 350,
			top: 249,
			width: 340,
		});
		await trigger(cucumber, "pointerup", 360, 220);
		await expectBbox(tomato, {
			height: 68,
			left: 350,
			top: 175,
			width: 340,
		});
		await trigger(tomato, "pointerdown", 360, 0);
		await wait(page, 100);
		await trigger(tomato, "pointermove", 360, -100);
		await nextFrame(page);
		await wait(page, 100);
		await trigger(tomato, "pointerup", 360, -100);
		await wait(page, 20);
		await trigger(tomato, "pointerdown", 360, -100);
		await wait(page, 50);
		await trigger(tomato, "pointerup", 360, -100);
		await wait(page, 100);
		await expectBbox(tomato, {
			height: 68,
			left: 350,
			top: 176,
			width: 340,
		});
	});

	test("X axis", async ({ page }) => {
		const tomato = page.locator("#Tomato");
		const cucumber = page.locator("#Cucumber");
		await visit(page, "?test=drag-to-reorder&axis=x");
		await wait(page, 50);
		await expectBbox(tomato, {
			height: 68,
			left: 350,
			top: 291,
			width: 340,
		});
		await expectBbox(cucumber, {
			height: 68,
			left: 690,
			top: 291,
			width: 340,
		});
		await nextFrame(page);
		await nextFrame(page);
		await trigger(tomato, "pointerdown", 360, 175);
		await wait(page, 50);
		await trigger(tomato, "pointermove", 365, 175);
		await nextFrame(page);
		await wait(page, 50);
		await trigger(tomato, "pointermove", 425, 175);
		await nextFrame(page);
		await wait(page, 50);
		await trigger(tomato, "pointermove", 475, 175);
		await nextFrame(page);
		await wait(page, 100);
		await expectBbox(tomato, {
			height: 68,
			left: 535,
			top: 291,
			width: 340,
		});
		await expectBbox(cucumber, {
			height: 68,
			left: 350,
			top: 291,
			width: 340,
		});
	});

	test("Move around", async ({ page }) => {
		const tomato = page.locator("#Tomato");

		const checkBox = () =>
			expectBbox(tomato, {
				height: 68,
				left: 350,
				top: 174,
				width: 340,
			});

		const moveAround = async (steps: number[]) => {
			const baseY = 175;
			const delta = 20;
			await nextFrame(page);
			await nextFrame(page);
			await trigger(tomato, "pointerdown", 360, baseY);
			await wait(page, 150);

			for (const step of steps) {
				for (let i = 0; i < Math.abs(step); i++) {
					const y = step > 0 ? delta : -delta;
					await trigger(tomato, "pointermove", 360, baseY + y);
					await nextFrame(page);
					await wait(page, 150);
				}
			}
			await trigger(tomato, "pointerup", 360, baseY);
			await wait(page, 150);
		};

		await visit(page, "?test=drag-to-reorder");
		await wait(page, 50);
		await checkBox();

		/**
		 * Re-query so the check retries: the snap back to origin needs two
		 * frames after release, which slow CI can take longer than
		 * moveAround's 150ms wait to produce.
		 */
		await moveAround([-4, 14, -8, 4, -5, 2, -6]);
		await checkBox();
	});
});
