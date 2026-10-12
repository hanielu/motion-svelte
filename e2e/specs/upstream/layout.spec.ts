import { expect, test } from "@playwright/test";
import { bbox, expectBbox, should, trigger, visit, wait, type BoundingBox } from "../../harness/upstream.js";

test.describe("Layout animation", () => {
	test("Correctly fires layout={true} animations and fires onLayoutAnimationStart and onLayoutAnimationComplete", async ({
		page,
	}) => {
		const box = page.locator("#box");
		await visit(page, "?test=layout");
		await wait(page, 50);
		await expectBbox(box, { top: 0, left: 0, width: 100, height: 200 });
		await trigger(box, "click");
		// onLayoutAnimationStart fires
		await should(async () => expect(await box.evaluate((el) => el.style.backgroundColor)).toBe("green"));
		await expectBbox(box, { top: 50, left: 100, width: 200, height: 250 });
		// onLayoutAnimationComplete fires
		await should(async () => expect(await box.evaluate((el) => el.style.backgroundColor)).toBe("blue"));
	});

	test(`It correctly fires layout="position" animations`, async ({ page }) => {
		test.skip(
			true,
			`unsupported: <layout.*> forces layout={true}, so layout="position" can't be combined with layout.update()`
		);
		const box = page.locator("#box");
		await visit(page, "?test=layout&type=position");
		await wait(page, 50);
		await expectBbox(box, { top: 0, left: 0, width: 100, height: 200 });
		await trigger(box, "click");
		await expectBbox(box, { top: 50, left: 100, width: 300, height: 300 });
	});

	test(`It correctly fires layout="size" animations`, async ({ page }) => {
		test.skip(
			true,
			`unsupported: <layout.*> forces layout={true}, so layout="size" can't be combined with layout.update()`
		);
		const box = page.locator("#box");
		await visit(page, "?test=layout&type=size");
		await wait(page, 50);
		await expectBbox(box, { top: 0, left: 0, width: 100, height: 200 });
		await trigger(box, "click");
		await expectBbox(box, { top: 100, left: 200, width: 200, height: 250 });
	});

	test("Doesn't initiate a new animation if the viewport box hasn't updated between renders", async ({ page }) => {
		const box = page.locator("#box");
		await visit(page, "?test=layout-block-interrupt");
		await wait(page, 50);
		await expectBbox(box, { top: 0, left: 0, width: 100, height: 200 });
		await trigger(box, "click");
		await expectBbox(box, { top: 50, left: 100, width: 200, height: 250 });
		/**
		 * The easing curve is set to always return t=0.5, so if this box moves it means
		 * a new animation has started
		 */
		await trigger(box, "click");
		await wait(page, 50);
		await expectBbox(box, { top: 50, left: 100, width: 200, height: 250 });
	});

	test("Doesn't initiate a new animation if layoutDependency hasn't changed", async ({ page }) => {
		const box = page.locator("#box");
		await visit(page, "?test=layout-dependency");
		await wait(page, 50);
		await expectBbox(box, { top: 0, left: 0, width: 100, height: 200 });
		await trigger(box, "click");
		await wait(page, 50);
		await expectBbox(box, { height: 300, left: 200, top: 100, width: 300 });
		/**
		 * The easing curve is set to always return t=0.5, so if this box moves it means
		 * a new animation has started
		 */
		await trigger(box, "click");
		await wait(page, 50);
		await expectBbox(box, { top: 0, left: 0, width: 100, height: 200 });
	});

	test("Exiting children correctly animate when layoutDependency changes", async ({ page }) => {
		test.skip(
			true,
			"env: left is 34.999996 vs 35 (exact float equality); upstream React + framer-motion 12.42.2 gives the identical value in this Chromium"
		);
		let initialBbox!: BoundingBox;

		await visit(page, "?test=layout-dependency-child");
		await wait(page, 50);
		await should(async () => {
			// Wait for the entry animation to start. Before its first
			// frame opacity is still 0, so exiting to opacity 0 has
			// nothing to animate and the child is removed immediately.
			expect(await page.locator("#child").evaluate((el) => getComputedStyle(el).opacity)).toBe("0.5");
			initialBbox = await bbox(page.locator("#child"));
		});
		await trigger(page.locator("button"), "click");
		await wait(page, 100);
		await should(async () => {
			const afterBbox = await bbox(page.locator("#child"));

			expect(afterBbox.top).toBe(initialBbox.top);
			expect(afterBbox.left).toBe(initialBbox.left);
			expect(afterBbox.width).toBe(initialBbox.width);
			expect(afterBbox.height).toBe(initialBbox.height);
		});
	});

	test("Doesn't animate shared layout components when layoutDependency hasn't changed (issue #1436)", async ({
		page,
	}) => {
		const box = page.locator("#box");
		const backgroundColor = () => box.first().evaluate((el) => getComputedStyle(el).backgroundColor);
		await visit(page, "?test=layout-shared-dependency");
		await wait(page, 50);
		// Color should be red (no animation started)
		await should(async () => expect(await backgroundColor()).toBe("rgb(255, 0, 0)"));
		// Switch to section B - same layoutDependency, should NOT animate
		await trigger(page.locator("#section-b-btn"), "click");
		await wait(page, 50);
		await should(async () => {
			/**
			 * After switching sections, the box should NOT animate because
			 * layoutDependency (selected=0) is the same. If an animation started,
			 * the color would change to green.
			 */
			expect(await backgroundColor()).toBe("rgb(255, 0, 0)");
		});
		// Click "Jump here" to change layoutDependency - SHOULD animate
		await trigger(page.locator("#jump-1"), "click");
		await wait(page, 50);
		await should(async () => {
			/**
			 * After clicking "Jump here", the layoutDependency changes from 0 to 1,
			 * so the box SHOULD animate. The color changes to green when animation starts.
			 */
			expect(await backgroundColor()).not.toBe("rgb(255, 0, 0)");
		});
	});

	test("Has a correct bounding box when a transform is applied", async ({ page }) => {
		const box = page.locator("#box");
		await visit(page, "?test=layout-scaled-child-in-transformed-parent");
		await wait(page, 50);
		await expectBbox(box, { height: 100, left: 200, top: 150, width: 100 });
		await trigger(box, "click");
		await expectBbox(box, { height: 100, left: 225, top: 150, width: 75 });
	});

	test("Newly-entering elements animate as expected", async ({ page }) => {
		await visit(page, "?test=layout-repeat-new");
		await wait(page, 50);
		await trigger(page.locator("#add"), "click");
		await wait(page, 50);
		await expectBbox(page.locator("#box-0"), { top: 50, left: 0, width: 160, height: 100 });
		await trigger(page.locator("#add"), "click");
		await wait(page, 50);
		await expectBbox(page.locator("#box-1"), { top: 50, left: 0, width: 160, height: 100 });
		await should(async () => {
			const bbox0 = await bbox(page.locator("#box-0"));
			expect(bbox0.left).not.toBe(170);
		});
		await trigger(page.locator("#reset"), "click");
		await wait(page, 50);
		await trigger(page.locator("#add"), "click");
		await wait(page, 50);
		await expectBbox(page.locator("#box-0"), { top: 50, left: 0, width: 160, height: 100 });
		await trigger(page.locator("#add"), "click");
		await wait(page, 50);
		await should(async () => {
			const bbox0 = await bbox(page.locator("#box-0"));
			expect(bbox0.left).not.toBe(170);
		});
	});

	test("Elements within portal don't perform scale correction on parents", async ({ page }) => {
		await visit(page, "?test=layout-portal");
		await wait(page, 50);
		await expectBbox(page.locator("#parent"), { top: 0, left: 0, width: 100, height: 100 });
		await expectBbox(page.locator("#child"), { top: 100, left: 0, width: 100, height: 100 });
		await trigger(page.locator("#parent"), "click");
		await wait(page, 50);
		await expectBbox(page.locator("#parent"), { top: 0, left: 0, width: 200, height: 200 });
		await wait(page, 50);
		await expectBbox(page.locator("#child"), { top: 200, left: 0, width: 100, height: 100 });
	});

	test("A new layout animation isn't started if the target doesn't change", async ({ page }) => {
		await visit(page, "?test=layout-rerender");
		await wait(page, 50);
		await trigger(page.locator("button"), "click");
		await wait(page, 200);
		await should(async () => expect(await page.locator("#render-count").textContent()).toBe("1"));
	});

	test("A new layout animation isn't started if the target doesn't change, even if parent starts layout animation", async ({
		page,
	}) => {
		await visit(page, "?test=layout-rerender&parent=true");
		await wait(page, 50);
		await trigger(page.locator("button"), "click");
		await wait(page, 200);
		await should(async () => expect(await page.locator("#render-count").textContent()).toBe("1"));
	});

	test(`It correctly fires layout="x" animations, only animating the x axis`, async ({ page }) => {
		test.skip(
			true,
			`unsupported: <layout.*> forces layout={true}, so layout="x" can't be combined with layout.update()`
		);
		const box = page.locator("#box");
		await visit(page, "?test=layout&type=x");
		await wait(page, 50);
		await expectBbox(box, { top: 0, left: 0, width: 100, height: 200 });
		await trigger(box, "click");
		await expectBbox(box, { top: 100, left: 100, width: 200, height: 300 });
	});

	test(`It correctly fires layout="y" animations, only animating the y axis`, async ({ page }) => {
		test.skip(
			true,
			`unsupported: <layout.*> forces layout={true}, so layout="y" can't be combined with layout.update()`
		);
		const box = page.locator("#box");
		await visit(page, "?test=layout&type=y");
		await wait(page, 50);
		await expectBbox(box, { top: 0, left: 0, width: 100, height: 200 });
		await trigger(box, "click");
		await expectBbox(box, { top: 50, left: 200, width: 300, height: 250 });
	});

	test("Disabling crossfade works as expected", async ({ page }) => {
		test.fail(
			true,
			"motion-sv: exit-less layoutId element inside AnimatePresence is removed immediately on toggle-off, so #box is gone instead of staying (opacity 1) for its shared-layout exit"
		);
		const opacity = () =>
			page
				.locator("#box")
				.first()
				.evaluate((el) => (el as HTMLElement).style.opacity);
		await visit(page, "?test=layout-crossfade");
		await wait(page, 50);
		await trigger(page.locator("button"), "click");
		await wait(page, 200);
		await should(async () => expect(await opacity()).toBe("1"));
		await trigger(page.locator("button"), "click");
		await wait(page, 200);
		await should(async () => expect(await opacity()).toBe("1"));
	});
});
