import { expect, test } from "@playwright/test";
import { bbox, expectBbox, should, trigger, visit, wait, type BoundingBox } from "../../harness/upstream.js";

test.describe("Shared layout: Toggle multiple times", () => {
	test("Should allow multiple toggles", async ({ page }) => {
		await visit(page, "?test=layout-shared-toggle-multiple");
		await wait(page, 50);
		await page.locator("button").click();
		await wait(page, 200);
		await should(async () => {
			const box = await bbox(page.locator("#a"));
			expect(box.left).not.toBe(0);
		});
		await should(async () => {
			const box = await bbox(page.locator("#b"));
			expect(box.left).not.toBe(0);
		});
		await page.locator("button").click();
		await wait(page, 200);
		await should(async () => {
			const box = await bbox(page.locator("#a"));
			expect(box.left).not.toBe(0);
		});
		await page.locator("button").click();
		await wait(page, 200);
		await should(async () => {
			const box = await bbox(page.locator("#a"));
			expect(box.left).not.toBe(0);
		});
		await should(async () => {
			const box = await bbox(page.locator("#b"));
			expect(box.left).not.toBe(0);
		});
		await page.locator("button").click();
		await wait(page, 200);
		await should(async () => {
			const box = await bbox(page.locator("#a"));
			expect(box.left).not.toBe(0);
		});
	});
});

test.describe("Shared layout: A -> B transition", () => {
	test("When performing crossfade animation, removed element isn't removed until animation is complete", async ({
		page,
	}) => {
		await visit(page, "?test=layout-shared-animate-presence");
		await wait(page, 50);
		await should(async () => expect(await page.locator("#shape-0").evaluate((el) => el.style.opacity)).toBe("1"));
		await trigger(page.locator("#shape-0"), "click");
		await wait(page, 50);
		// Lose reference to original element
		await expect(page.locator("#shape-1")).toBeAttached({ timeout: 4000 });
		await should(async () => expect(await page.locator("#shape-0").evaluate((el) => el.style.opacity)).toBe("1"));
		await should(async () =>
			expect(await page.locator("#shape-1").evaluate((el) => el.style.opacity)).toBe("0.433013")
		);
	});
});

test.describe("Shared layout: A -> B transition", () => {
	test("Correctly fires layout={true} animations and fires onLayoutAnimationStart and onLayoutAnimationComplete", async ({
		page,
	}) => {
		await visit(page, "?test=layout-shared-switch-a-b");
		await wait(page, 50);
		await should(async () => {
			const a = page.locator("#a");
			expect(await bbox(a)).toEqual({ top: 0, left: 0, width: 100, height: 200 });
			expect(await a.evaluate((el) => getComputedStyle(el).opacity)).toBe("0.4");
		});
		await trigger(page.locator("#a"), "click");
		await wait(page, 200);
		/**
		 * Test that onLayoutAnimationStart fires
		 */
		await should(async () => {
			const b = page.locator("#b");
			expect(await b.evaluate((el) => el.style.backgroundColor)).toBe("rgb(0, 255, 0)");
			expect(await b.evaluate((el) => getComputedStyle(el).borderRadius)).toBe("5% / 4%");
			expect(await b.evaluate((el) => getComputedStyle(el).opacity)).toBe("0.7");
			expect(await bbox(b)).toEqual({ top: 50, left: 100, width: 200, height: 250 });
		});
		/**
		 * Test that onLayoutAnimationComplete fires
		 */
		await wait(page, 2000);
		await should(async () =>
			expect(await page.locator("#b").evaluate((el) => el.style.backgroundColor)).toBe("rgb(0, 0, 255)")
		);
		await trigger(page.locator("#b"), "click");
		await wait(page, 200);
		await expectBbox(page.locator("#a"), { top: 50, left: 100, width: 200, height: 250 });
	});

	test(`It correctly fires layout="position" animations`, async ({ page }) => {
		await visit(page, "?test=layout-shared-switch-a-b&type=position");
		await wait(page, 50);
		await expectBbox(page.locator("#a"), { top: 0, left: 0, width: 100, height: 200 });
		await trigger(page.locator("#a"), "click");
		await wait(page, 50);
		await expectBbox(page.locator("#b"), { top: 50, left: 100, width: 300, height: 300 });
		await trigger(page.locator("#b"), "click");
		await wait(page, 50);
		await expectBbox(page.locator("#a"), { top: 25, left: 50, width: 100, height: 200 });
	});

	test(`It correctly fires layout="size" animations`, async ({ page }) => {
		test.skip(
			true,
			'unsupported: layout.* (createLayoutMotion) forces layout={true}, so a top-level layout="size" element can\'t be expressed'
		);
		await visit(page, "?test=layout-shared-switch-a-b&type=size");
		await wait(page, 50);
		await expectBbox(page.locator("#a"), { top: 0, left: 0, width: 100, height: 200 });
		await trigger(page.locator("#a"), "click");
		await wait(page, 50);
		await expectBbox(page.locator("#b"), { top: 100, left: 200, width: 200, height: 250 });
		await trigger(page.locator("#b"), "click");
		await wait(page, 50);
		await expectBbox(page.locator("#a"), { top: 0, left: 0, width: 150, height: 225 });
	});
});

test.describe("Shared layout: A -> AB -> A switch transition", () => {
	test.skip("Correctly fires layout={true} animations and fires onLayoutAnimationComplete", async ({ page }) => {
		await visit(page, "?test=layout-shared-switch-a-ab");
		await wait(page, 50);
		await expectBbox(page.locator("#a"), { top: 0, left: 0, width: 100, height: 200 });
		await trigger(page.locator("#a"), "click");
		await wait(page, 50);
		await should(async () => expect(await page.locator("#a").evaluate((el) => el.style.visibility)).toBe("hidden"));
		await should(async () => {
			const b = page.locator("#b");
			expect(parseFloat(await b.evaluate((el) => el.style.opacity))).toBe(1);
			expect(await bbox(b)).toEqual({ top: 50, left: 100, width: 200, height: 250 });
		});
		await trigger(page.locator("#b"), "click");
		await wait(page, 50);
		await should(async () => {
			const a = page.locator("#a");
			expect(await a.evaluate((el) => el.style.visibility)).not.toBe("hidden");
			expect(await bbox(a)).toEqual({ top: 25, left: 50, width: 100, height: 125 });
		});
	});

	test.skip(`It correctly fires layout="position" animations`, async ({ page }) => {
		await visit(page, "?test=layout-shared-switch-a-ab&type=position");
		await wait(page, 50);
		await expectBbox(page.locator("#a"), { top: 0, left: 0, width: 100, height: 200 });
		await trigger(page.locator("#a"), "click");
		await wait(page, 50);
		await expectBbox(page.locator("#b"), { top: 50, left: 100, width: 300, height: 300 });
		await trigger(page.locator("#b"), "click");
		await wait(page, 50);
		await expectBbox(page.locator("#a"), { top: 50, left: 100, width: 100, height: 200 });
	});
});

test.describe("Shared layout: 0 -> A -> B -> 0 transition", () => {
	test("Correctly fires layout={true} animations", async ({ page }) => {
		await visit(page, "?test=layout-shared-switch-0-a-b-0");
		await wait(page, 50);
		await trigger(page.locator("#trigger"), "click");
		await wait(page, 50);
		await expectBbox(page.locator("#a"), { top: 0, left: 0, width: 100, height: 200 });
		await trigger(page.locator("#trigger"), "click");
		await wait(page, 50);
		await expectBbox(page.locator("#b"), { top: 50, left: 100, width: 200, height: 250 });
		await trigger(page.locator("#trigger"), "click");
		await wait(page, 50);
		await expectBbox(page.locator("#a"), { top: 25, left: 50, width: 150, height: 225 });
	});
});

test.describe("Shared layout: 0 -> A -> AB -> A -> 0 transition", () => {
	test("Correctly fires layout={true} animations", async ({ page }) => {
		await visit(page, "?test=layout-shared-switch-0-a-b-0");
		await wait(page, 50);
		await trigger(page.locator("#trigger"), "click");
		await wait(page, 50);
		await expectBbox(page.locator("#a"), { top: 0, left: 0, width: 100, height: 200 });
		await trigger(page.locator("#trigger"), "click");
		await wait(page, 50);
		await expectBbox(page.locator("#b"), { top: 50, left: 100, width: 200, height: 250 });
		await trigger(page.locator("#trigger"), "click");
		await wait(page, 50);
		await expectBbox(page.locator("#a"), { top: 25, left: 50, width: 150, height: 225 });
	});
});

test.describe("Shared layout: A -> B crossfade transition", () => {
	test("Correctly fires layout={true} animations and fires onLayoutAnimationStart and onLayoutAnimationComplete", async ({
		page,
	}) => {
		await visit(page, "?test=layout-shared-switch-a-b");
		await wait(page, 50);
		await expectBbox(page.locator("#a"), { top: 0, left: 0, width: 100, height: 200 });
		await trigger(page.locator("#a"), "click");
		await wait(page, 200);
		await should(async () => {
			const b = page.locator("#b");
			expect(await b.evaluate((el) => el.style.backgroundColor)).toBe("rgb(0, 255, 0)");
			expect(await b.evaluate((el) => getComputedStyle(el).borderRadius)).toBe("5% / 4%");
			expect(await bbox(b)).toEqual({ top: 50, left: 100, width: 200, height: 250 });
		});
		/**
		 * Test that onLayoutAnimationComplete fires
		 */
		await wait(page, 2000);
		await should(async () =>
			expect(await page.locator("#b").evaluate((el) => el.style.backgroundColor)).toBe("rgb(0, 0, 255)")
		);
		await trigger(page.locator("#b"), "click");
		await wait(page, 200);
		await expectBbox(page.locator("#a"), { top: 50, left: 100, width: 200, height: 250 });
	});

	test(`It correctly fires layout="position" animations`, async ({ page }) => {
		await visit(page, "?test=layout-shared-switch-a-b&type=position");
		await wait(page, 50);
		await expectBbox(page.locator("#a"), { top: 0, left: 0, width: 100, height: 200 });
		await trigger(page.locator("#a"), "click");
		await wait(page, 50);
		await expectBbox(page.locator("#b"), { top: 50, left: 100, width: 300, height: 300 });
		await trigger(page.locator("#b"), "click");
		await wait(page, 50);
		await expectBbox(page.locator("#a"), { top: 25, left: 50, width: 100, height: 200 });
	});

	test(`It correctly fires layout="size" animations`, async ({ page }) => {
		test.skip(
			true,
			'unsupported: layout.* (createLayoutMotion) forces layout={true}, so a top-level layout="size" element can\'t be expressed'
		);
		await visit(page, "?test=layout-shared-switch-a-b&type=size");
		await wait(page, 50);
		await expectBbox(page.locator("#a"), { top: 0, left: 0, width: 100, height: 200 });
		await trigger(page.locator("#a"), "click");
		await wait(page, 50);
		await expectBbox(page.locator("#b"), { top: 100, left: 200, width: 200, height: 250 });
		await trigger(page.locator("#b"), "click");
		await wait(page, 50);
		await expectBbox(page.locator("#a"), { top: 0, left: 0, width: 150, height: 225 });
	});

	test("It correctly fires layout={true} animations when the component has a transformTemplate", async ({ page }) => {
		await visit(page, "?test=layout-shared-crossfade-a-b-transform-template");
		await wait(page, 50);
		await expectBbox(page.locator("#a"), { top: 150, left: 200, width: 100, height: 200 });
		await trigger(page.locator("#a"), "click");
		await wait(page, 100);
		await expectBbox(page.locator("#b"), { top: 125, left: 150, width: 200, height: 250 });
		// interrupt the animation
		await trigger(page.locator("#b"), "click");
		await wait(page, 100);
		await expectBbox(page.locator("#a"), { top: 137.5, left: 175, width: 150, height: 225 });
	});
});

test.describe("Shared layout: A -> AB -> A crossfade transition", () => {
	test("Correctly fires layout={true} animations and fires onLayoutAnimationComplete", async ({ page }) => {
		await visit(page, "?test=layout-shared-crossfade-a-ab");
		await wait(page, 50);
		await expectBbox(page.locator("#a"), { top: 0, left: 0, width: 100, height: 200 });
		await trigger(page.locator("#a"), "click");
		await wait(page, 50);
		await should(async () => {
			const a = page.locator("#a");
			expect(parseFloat(await a.evaluate((el) => el.style.opacity)) || 1).toBe(1);
			expect(await bbox(a)).toEqual({ top: 50, left: 100, width: 200, height: 250 });
		});
		await should(async () => {
			const b = page.locator("#b");
			expect(parseFloat(await b.evaluate((el) => el.style.opacity)) || 1).toBe(1);
			expect(await bbox(b)).toEqual({ top: 50, left: 100, width: 200, height: 250 });
		});
	});

	test(`It correctly fires layout="position" animations`, async ({ page }) => {
		await visit(page, "?test=layout-shared-crossfade-a-ab&type=position");
		await wait(page, 50);
		await expectBbox(page.locator("#a"), { top: 0, left: 0, width: 100, height: 200 });
		await trigger(page.locator("#a"), "click");
		await wait(page, 50);
		await expectBbox(page.locator("#a"), { top: 50, left: 100, width: 100, height: 200 });
		await expectBbox(page.locator("#b"), { top: 50, left: 100, width: 300, height: 300 });
	});

	test(`It correctly animates layout="preserve-aspect" as "position" animations if aspect ratios are different`, async ({
		page,
	}) => {
		test.skip(
			true,
			'unsupported: layout.* (createLayoutMotion) forces layout={true}, so a top-level layout="preserve-aspect" element can\'t be expressed'
		);
		await visit(page, "?test=layout-shared-crossfade-a-ab&type=preserve-aspect");
		await wait(page, 50);
		await expectBbox(page.locator("#a"), { top: 0, left: 0, width: 100, height: 200 });
		await trigger(page.locator("#a"), "click");
		await wait(page, 50);
		await should(async () => {
			const a = page.locator("#a");
			expect(parseFloat(await a.evaluate((el) => el.style.opacity)) || 1).toBe(1);
			expect(await bbox(a)).toEqual({ top: 50, left: 100, width: 100, height: 200 });
		});
		await should(async () => {
			const b = page.locator("#b");
			expect(parseFloat(await b.evaluate((el) => el.style.opacity)) || 1).toBe(1);
			expect(await bbox(b)).toEqual({ top: 50, left: 100, width: 300, height: 300 });
		});
	});

	test(`It correctly doesn't animate if layout="preserve-aspect" if size is different and position is the same`, async ({
		page,
	}) => {
		test.skip(
			true,
			'unsupported: layout.* (createLayoutMotion) forces layout={true}, so a top-level layout="preserve-aspect" element can\'t be expressed'
		);
		await visit(page, "?test=layout-shared-crossfade-a-ab&type=preserve-aspect&move=no");
		await wait(page, 50);
		await expectBbox(page.locator("#a"), { top: 0, left: 0, width: 100, height: 200 });
		await trigger(page.locator("#a"), "click");
		await wait(page, 50);
		await should(async () => {
			const a = page.locator("#a");
			expect(parseFloat(await a.evaluate((el) => el.style.opacity)) || 1).toBe(1);
			expect(await bbox(a)).toEqual({ top: 0, left: 0, width: 100, height: 200 });
		});
		await should(async () => {
			const b = page.locator("#b");
			expect(parseFloat(await b.evaluate((el) => el.style.opacity)) || 1).toBe(1);
			expect(await bbox(b)).toEqual({ top: 0, left: 0, width: 300, height: 300 });
		});
	});

	test(`It correctly doesn't animate if layout="preserve-aspect" on same element if size and position are the same`, async ({
		page,
	}) => {
		const a = page.locator("#a");
		const width = async () => Math.round((await bbox(a)).width);
		await visit(page, "?test=layout-preserve-ratio");
		await wait(page, 50);
		await should(async () => expect(await width()).toBe(200));
		await trigger(a, "click");
		await wait(page, 50);
		await should(async () => expect(await width()).toBe(100));
		await trigger(a, "click");
		await wait(page, 50);
		await should(async () => expect(await width()).toBe(200));
		await trigger(a, "click");
		await wait(page, 50);
		await should(async () => expect(await width()).toBe(100));
	});

	test(`It correctly animates layout="preserve-aspect" as normal layout animations if both aspect ratios are the same`, async ({
		page,
	}) => {
		test.skip(
			true,
			'unsupported: layout.* (createLayoutMotion) forces layout={true}, so a top-level layout="preserve-aspect" element can\'t be expressed'
		);
		await visit(page, "?test=layout-shared-crossfade-a-ab&type=preserve-aspect&size=same");
		await wait(page, 50);
		await expectBbox(page.locator("#a"), { top: 0, left: 0, width: 100, height: 200 });
		await trigger(page.locator("#a"), "click");
		await wait(page, 100);
		await expectBbox(page.locator("#a"), { top: 50, left: 100, width: 200, height: 400 });
		await expectBbox(page.locator("#b"), { top: 50, left: 100, width: 200, height: 400 });
	});

	test("Correctly fires layout={true} animations after an instant transition", async ({ page }) => {
		await visit(page, "?test=layout-shared-instant-transition-a-ab-a");
		await wait(page, 50);
		await expectBbox(page.locator("#a"), { top: 0, left: 0, width: 100, height: 200 });
		await trigger(page.locator("#a"), "click");
		await wait(page, 50);
		// a shouldn't change since the update is blocked
		await should(async () => {
			const a = page.locator("#a");
			expect(parseFloat(await a.evaluate((el) => el.style.opacity)) || 1).toBe(1);
			expect(await bbox(a)).toEqual({ top: 0, left: 0, width: 100, height: 200 });
		});
		// b should have its identical layout
		await should(async () => {
			const b = page.locator("#b");
			expect(parseFloat(await b.evaluate((el) => el.style.opacity)) || 1).toBe(1);
			expect(await bbox(b)).toEqual({ top: 100, left: 200, width: 300, height: 300 });
		});
		await trigger(page.locator("#b"), "click");
		await wait(page, 50);
		// half way back to a
		await should(async () => {
			const a = page.locator("#a");
			expect(parseFloat(await a.evaluate((el) => el.style.opacity)) || 1).toBe(1);
			expect(await bbox(a)).toEqual({ top: 50, left: 100, width: 200, height: 250 });
		});
	});
});

test.describe("Shared layout: 0 -> A -> B -> 0 crossfade transition", () => {
	test("Correctly fires layout={true} animations", async ({ page }) => {
		await visit(page, "?test=layout-shared-switch-0-a-b-0");
		await wait(page, 50);
		await trigger(page.locator("#trigger"), "click");
		await wait(page, 50);
		await expectBbox(page.locator("#a"), { top: 0, left: 0, width: 100, height: 200 });
		await trigger(page.locator("#trigger"), "click");
		await wait(page, 50);
		await expectBbox(page.locator("#b"), { top: 50, left: 100, width: 200, height: 250 });
		await trigger(page.locator("#trigger"), "click");
		await wait(page, 50);
		await expectBbox(page.locator("#a"), { top: 25, left: 50, width: 150, height: 225 });
	});
});

test.describe("Shared layout:  0 -> A -> AB -> A -> 0 crossfade transition", () => {
	test("Correctly fires layout={true} animations", async ({ page }) => {
		await visit(page, "?test=layout-shared-switch-0-a-b-0");
		await wait(page, 50);
		await trigger(page.locator("#trigger"), "click");
		await wait(page, 50);
		await expectBbox(page.locator("#a"), { top: 0, left: 0, width: 100, height: 200 });
		await trigger(page.locator("#trigger"), "click");
		await wait(page, 50);
		await expectBbox(page.locator("#b"), { top: 50, left: 100, width: 200, height: 250 });
		await trigger(page.locator("#b"), "click");
		await wait(page, 50);
		await expectBbox(page.locator("#a"), { top: 25, left: 50, width: 150, height: 225 });
	});
});

test.describe("Shared layout: nested crossfade transition", () => {
	test("Correctly fires layout={true} animations", async ({ page }) => {
		await visit(page, "?test=layout-shared-crossfade-nested");
		await wait(page, 50);
		await trigger(page.locator("#a"), "click");
		await expectBbox(page.locator("#a"), { top: 200, left: 200, width: 200, height: 250 });
		await expectBbox(page.locator("#child"), { top: 200, left: 200, width: 100, height: 100 });
		await trigger(page.locator("#b"), "click");
		await wait(page, 50);
		await expectBbox(page.locator("#b"), { top: 150, left: 200, width: 150, height: 225 });
		await expectBbox(page.locator("#child"), { top: 150, left: 200, width: 100, height: 100 });
	});

	test("Correctly fires layout={true} animations when there are divs with `display: contents` in the path", async ({
		page,
	}) => {
		await visit(page, "?test=layout-shared-crossfade-nested-display-contents");
		await wait(page, 50);
		await trigger(page.locator("#a"), "click");
		await wait(page, 250);
		await expectBbox(page.locator("#a"), { top: 200, left: 200, width: 200, height: 250 });
		await expectBbox(page.locator("#child"), { top: 200, left: 200, width: 100, height: 100 });
		await trigger(page.locator("#b"), "click");
		await expectBbox(page.locator("#b"), { top: 150, left: 200, width: 150, height: 225 });
		await expectBbox(page.locator("#child"), { top: 150, left: 200, width: 100, height: 100 });
	});
});

test.describe("Shared layout: component unmounts in a LayoutGroup", () => {
	test("Should trigger sibling animation when unmount", async ({ page }) => {
		await visit(page, "?test=layout-group-unmount");
		await wait(page, 50);
		await trigger(page.locator("#a"), "click");
		await wait(page, 50);
		await expectBbox(page.locator("#b"), { top: 90, left: 20, width: 100, height: 100 });
	});

	test("If a sibling's position relative to the parent has changed, it should remain at its position", async ({
		page,
	}) => {
		await visit(page, "?test=layout-group-unmount-list");
		await wait(page, 50);
		const box = await bbox(page.locator("#b"));
		await trigger(page.locator("#a"), "click");
		await wait(page, 50);
		await expectBbox(page.locator("#b"), box);
	});
});

test.describe("Shared layout: A -> undefined -> B transition", () => {
	test("After removing an element with a layoutId, the next element with that ID should not animate from the last element", async ({
		page,
	}) => {
		await visit(page, "?test=layout-shared-clear-snapshots");
		await wait(page, 50);
		await expectBbox(page.locator("#box"), { top: 100, left: 0, width: 100, height: 100 });
		await page.locator("button").click();
		await wait(page, 50);
		await page.locator("button").click();
		await wait(page, 50);
		await expectBbox(page.locator("#box"), { top: 100, left: 200, width: 100, height: 100 });
	});

	test("As previous, but with rendering layout projecting sibling that is not removed", async ({ page }) => {
		await visit(page, "?test=layout-shared-clear-snapshots&sibling=true");
		await wait(page, 50);
		await expectBbox(page.locator("#box"), { top: 100, left: 0, width: 100, height: 100 });
		await page.locator("button").click();
		await wait(page, 50);
		await page.locator("button").click();
		await wait(page, 50);
		await expectBbox(page.locator("#box"), { top: 100, left: 200, width: 100, height: 100 });
	});
});

test.describe("Shared pointer events", () => {
	test("Applies pointer-events: none to follow elements", async ({ page }) => {
		await visit(page, "?test=layout-follow-pointer-events");
		await wait(page, 50);
		await expectBbox(page.locator("#a"), { top: 0, left: 0, width: 100, height: 200 });
		await page.locator("#a").click();
		await wait(page, 200);
		await expectBbox(page.locator("#a"), { top: 200, left: 0, width: 300, height: 300 });
		await expectBbox(page.locator("#b"), { top: 200, left: 0, width: 300, height: 300 });
		await page.locator("#b").click();
		await wait(page, 200);
		await expectBbox(page.locator("#a"), { top: 0, left: 0, width: 100, height: 200 });
	});
});

test.describe("Shared layout: Works with queueMicrotasks", () => {
	test("queueMicrotasks doesn't break layout measurements", async ({ page }) => {
		await visit(page, "?test=layout-queuemicrotask");
		await wait(page, 50);
		await trigger(page.locator("#target"), "click");
		await wait(page, 150);
		await trigger(page.locator("#open"), "click");
		await wait(page, 150);
		await trigger(page.locator("#target"), "click");
		await wait(page, 150);
		await trigger(page.locator("#open"), "click");
		await wait(page, 150);
		await should(async () =>
			expect(await page.locator("#error").evaluate((el) => (el as HTMLElement).innerText)).toBe("")
		);
	});
});

test.describe("Shared layout: Measures rotated elements correctly when animation is interrupted", () => {
	test("Measures correctly", async ({ page }) => {
		let boundingBox: BoundingBox;
		await visit(page, "?test=layout-shared-rotate");
		await wait(page, 50);
		await trigger(page.locator("#box"), "click");
		await should(async () => {
			boundingBox = await bbox(page.locator("#box"));
			// Only record once the animation is running, frozen halfway
			// between the 200px and 100px rotated boxes.
			expect(Math.abs(boundingBox.width - 150 * Math.SQRT2)).toBeLessThanOrEqual(1);
		});
		await trigger(page.locator("#box"), "click");
		await wait(page, 50);
		await expectBbox(page.locator("#box"), boundingBox!);
	});
});

test.describe("Shared layout: Border radius", () => {
	test("Should animate border radius", async ({ page }) => {
		await visit(page, "?test=layout-shared-border-radius");
		await wait(page, 50);
		await page.locator("#next").click();
		await wait(page, 200);
		await should(async () => {
			// Both boxes are read in the same tick, like Cypress' synchronous `.should` callback (the radii are animating).
			const [boxAStyle, boxBStyle] = await page.locator(".measure-box").evaluateAll(([$boxA, $boxB]) => {
				return [window.getComputedStyle($boxA).borderRadius, window.getComputedStyle($boxB).borderRadius];
			});
			expect(boxAStyle).not.toBe("0%");
			expect(boxBStyle).not.toBe("0%");
			expect(boxBStyle).toBe(boxAStyle);
		});
	});
});
