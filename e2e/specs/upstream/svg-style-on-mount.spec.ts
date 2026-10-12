import { expect, test } from "@playwright/test";
import { visit } from "../../harness/upstream.js";

/**
 * Tests for #2949: SVG styles not applying on mount.
 *
 * The bug: SVG elements using useTransform-derived values would have
 * incorrect transformOrigin/transformBox on initial mount (before
 * dimensions are measured), causing a visible "jump" when the visual
 * element takes over.
 *
 * The fix: Always set transformBox to "fill-box" and transformOrigin
 * to "50% 50%" on SVG elements with transforms, even before dimensions
 * are measured.
 */
test.describe("SVG styles on mount (#2949)", () => {
	test("Applies transform, transformBox, and transformOrigin on mount", async ({ page }) => {
		await visit(page, "?test=svg-style-on-mount");
		const style = await page.locator("#path").evaluate((el) => {
			const { transform, transformBox, transformOrigin } = (el as SVGElement).style;
			return { transform, transformBox, transformOrigin };
		});
		// Transform should be applied immediately on mount
		expect(style.transform).toContain("translateX(10px)");
		expect(style.transform).toContain("translateY(10px)");

		// transformBox must be "fill-box" on initial mount
		// (this was the core of the #2949 bug — it was missing)
		expect(style.transformBox).toBe("fill-box");

		// transformOrigin must be set to prevent jumping
		expect(style.transformOrigin).toBe("50% 50%");
	});

	test("Applies useTransform-derived pathLength attributes on mount", async ({ page }) => {
		await visit(page, "?test=svg-style-on-mount");
		const path = page.locator("#path");
		// pathLength should be 0.5 (useTransform(50, [0,100], [0,1]))
		// buildSVGPath normalizes the pathLength attribute to 1
		expect(await path.getAttribute("pathLength")).toBe("1");

		// stroke-dasharray should reflect pathLength=0.5
		expect(await path.getAttribute("stroke-dasharray")).toBe("0.5 1");

		// stroke-dashoffset should be 0 (pathOffset defaults to 0)
		const dashoffset = await path.getAttribute("stroke-dashoffset");
		expect(parseFloat(dashoffset!)).toBe(0);
	});

	test("Applies useTransform-derived opacity on SVG path on mount", async ({ page }) => {
		await visit(page, "?test=svg-style-on-mount");
		// opacity should be 0.5 (useTransform(50, [0,100], [0,1]))
		const opacity = await page
			.locator("#path")
			.evaluate((el) => el.getAttribute("opacity") ?? window.getComputedStyle(el).opacity);
		expect(parseFloat(opacity)).toBe(0.5);
	});

	test("Applies useTransform-derived fill on SVG circle on mount", async ({ page }) => {
		await visit(page, "?test=svg-style-on-mount");
		// fill should be interpolated (not null/empty/default)
		const fill = await page.locator("#circle").getAttribute("fill");
		expect(fill).not.toBeNull();
		expect(fill).not.toBe("");
	});

	test("Applies transformBox and transformOrigin on SVG rect with static transform", async ({ page }) => {
		await visit(page, "?test=svg-style-on-mount");
		const style = await page.locator("#rect").evaluate((el) => {
			const { transform, transformBox, transformOrigin } = (el as SVGElement).style;
			return { transform, transformBox, transformOrigin };
		});
		expect(style.transform).toBe("rotate(45deg)");
		expect(style.transformBox).toBe("fill-box");
		expect(style.transformOrigin).toBe("50% 50%");
	});
});
