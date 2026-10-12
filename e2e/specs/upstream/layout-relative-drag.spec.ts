import { test, type Page } from "@playwright/test";
import { expectBbox, nextFrame, trigger, visit, wait } from "../../harness/upstream.js";

// Unused upstream as well; ported so the file stays line-for-line comparable.
async function testNestedDrag(page: Page, query: string) {
	const parent = page.locator("#parent");
	const child = page.locator("#child");

	await visit(page, `?test=drag-layout-nested&${query}`);
	await wait(page, 50);
	await expectBbox(parent, {
		top: 100,
		left: 200,
		width: 300,
		height: 300,
	});

	await expectBbox(child, {
		top: 150,
		left: 250,
		width: 600,
		height: 200,
	});
	await nextFrame(page);
	await nextFrame(page);
	await trigger(parent, "pointerdown", 5, 5);
	await trigger(parent, "pointermove", 10, 10); // Gesture will start from first move past threshold
	await nextFrame(page);
	await wait(page, 50);
	await trigger(parent, "pointermove", 100, 100);
	await nextFrame(page);
	await wait(page, 50);
	await trigger(parent, "pointerup");
	await expectBbox(parent, {
		top: 200,
		left: 300,
		width: 300,
		height: 300,
	});
	await expectBbox(child, {
		top: 250,
		left: 350,
		width: 600,
		height: 200,
	});
	await trigger(child, "pointerdown", 5, 5);
	await trigger(child, "pointermove", 10, 10); // Gesture will start from first move past threshold
	await nextFrame(page);
	await wait(page, 50);
	await trigger(child, "pointermove", 100, 100);
	await nextFrame(page);
	await wait(page, 50);
	await trigger(child, "pointerup");
	await expectBbox(child, {
		top: 200,
		left: 300,
		width: 300,
		height: 300,
	});
	await expectBbox(child, {
		top: 350,
		left: 450,
		width: 600,
		height: 200,
	});
}

test.describe("Relative projection targets: Drag", () => {
	test("Child correctly follows parent", async ({ page }) => {
		const parent = page.locator("#parent");
		const child = page.locator("#child");

		await visit(page, `?test=layout-relative-drag`);
		await wait(page, 50);
		await expectBbox(parent, {
			top: 0,
			left: 0,
			width: 200,
			height: 200,
		});
		await expectBbox(child, {
			top: 0,
			left: 0,
			width: 100,
			height: 100,
		});
		await nextFrame(page);
		await nextFrame(page);
		await trigger(parent, "pointerdown", 5, 5);
		await trigger(parent, "pointermove", 10, 10);
		await nextFrame(page);
		await wait(page, 50);
		await trigger(parent, "pointermove", 110, 110);
		await nextFrame(page);
		await expectBbox(parent, {
			top: 110,
			left: 110,
			width: 200,
			height: 200,
		});
		await expectBbox(child, {
			top: 110,
			left: 110,
			width: 100,
			height: 100,
		});
	});
});
