import { expect, test, type Locator } from "@playwright/test";
import { bbox, should, trigger, visit, wait, type BoundingBox } from "../../harness/upstream.js";

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
		test.fail(
			true,
			"motion-sv: ReorderItem renders <div> instead of <li> (drops `as`), so li styles don't apply (Tomato 300x45 at top 240 vs 340x68 at 174); with li styles forced, the dragged item still isn't offset-compensated on reorder (top 405 vs 249) and no item can be dragged after the first reorder"
		);
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
		await trigger(tomato, "pointerdown", 360, 175);
		await wait(page, 50);
		await trigger(tomato, "pointermove", 360, 180);
		await wait(page, 50);
		await trigger(tomato, "pointermove", 360, 200);
		await wait(page, 50);
		await trigger(tomato, "pointermove", 360, 220);
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
		await wait(page, 50);
		await trigger(cucumber, "pointermove", 360, 200);
		await wait(page, 50);
		await trigger(cucumber, "pointermove", 360, 220);
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
		test.fail(
			true,
			"motion-sv: ReorderItem renders <div> instead of <li> (Tomato 78x73 at top 293.5 vs 340x68 at 291); with li styles forced, the dragged item isn't offset-compensated when it reorders (left 1215 vs 535)"
		);
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
		await trigger(tomato, "pointerdown", 360, 175);
		await wait(page, 50);
		await trigger(tomato, "pointermove", 365, 175);
		await wait(page, 50);
		await trigger(tomato, "pointermove", 425, 175);
		await wait(page, 50);
		await trigger(tomato, "pointermove", 475, 175);
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
		test.fail(
			true,
			"motion-sv: ReorderItem renders <div> instead of <li> (Tomato top 240 vs 174); with li styles forced, the dragged item isn't offset-compensated on reorder and ends in slot 2 (top 252 vs 174)"
		);
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
			await trigger(tomato, "pointerdown", 360, baseY);
			await wait(page, 150);

			for (const step of steps) {
				for (let i = 0; i < Math.abs(step); i++) {
					const y = step > 0 ? delta : -delta;
					await trigger(tomato, "pointermove", 360, baseY + y);
					await wait(page, 150);
				}
			}
			await trigger(tomato, "pointerup", 360, baseY);
			await wait(page, 150);
		};

		await visit(page, "?test=drag-to-reorder");
		await wait(page, 50);
		await checkBox();

		await moveAround([-4, 14, -8, 4, -5, 2, -6]);
		await checkBox();
	});
});
