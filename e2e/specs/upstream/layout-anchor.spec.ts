import { expect, test } from "@playwright/test";
import { trigger, visit, wait } from "../../harness/upstream.js";

test.describe("layoutAnchor: centered child stays centered during parent resize", () => {
	test("Child with layoutAnchor={x:0.5,y:0.5} stays centered mid-animation", async ({ page }) => {
		test.skip(true, "unsupported: layoutAnchor prop isn't forwarded to the projection node (motion-dom supports it)");
		await visit(page, "?test=layout-anchor");
		await wait(page, 50);
		await trigger(page.locator("#parent"), "click");
		// Wait 250ms (25% through 1s linear parent animation, child hasn't started yet)
		await wait(page, 250);
		const { parentRect, childRect } = await page.locator("#parent").evaluate(($parent) => ({
			parentRect: $parent.getBoundingClientRect().toJSON(),
			childRect: $parent.querySelector("#child-anchored")!.getBoundingClientRect().toJSON(),
		}));
		const parentCenterX = parentRect.left + parentRect.width / 2;
		const parentCenterY = parentRect.top + parentRect.height / 2;

		const childCenterX = childRect.left + childRect.width / 2;
		const childCenterY = childRect.top + childRect.height / 2;

		// With layoutAnchor={x:0.5,y:0.5}, child should stay centered
		expect(Math.abs(childCenterX - parentCenterX)).toBeLessThanOrEqual(15);
		expect(Math.abs(childCenterY - parentCenterY)).toBeLessThanOrEqual(15);
	});

	test("Child without layoutAnchor drifts from center mid-animation", async ({ page }) => {
		await visit(page, "?test=layout-anchor");
		await wait(page, 50);
		await trigger(page.locator("#parent"), "click");
		await wait(page, 250);
		const { parentRect, childRect } = await page.locator("#parent-no-anchor").evaluate(($parent) => ({
			parentRect: $parent.getBoundingClientRect().toJSON(),
			childRect: $parent.querySelector("#child-no-anchor")!.getBoundingClientRect().toJSON(),
		}));
		const parentCenterX = parentRect.left + parentRect.width / 2;

		const childCenterX = childRect.left + childRect.width / 2;

		// Without layoutAnchor, the child should drift away from center
		const drift = Math.abs(childCenterX - parentCenterX);
		expect(drift).toBeGreaterThan(5);
	});
});
