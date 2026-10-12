import { expect, test, type Locator, type Page } from "@playwright/test";
import { should, visit, wait } from "../../harness/upstream.js";

/**
 * Two complementary tests, each gated on Element.getAnimations() support:
 *
 * - Browsers without it (CI's Electron) run a behavioral check: when an
 *   animation is hardware-accelerated, Motion doesn't run its JS animation
 *   loop, so the values it renders per-frame (SVG attributes, inline styles)
 *   stay at their initial keyframe while the computed style animates. The JS
 *   fallback writes these values every frame, so asserting they're static
 *   mid-animation proves WAAPI is driving the animation.
 *
 * - Browsers with it verify WAAPI animations directly.
 */

const parseMatrix = (computedTransform: string) =>
	computedTransform
		.replace(/matrix\(|\)/g, "")
		.split(",")
		.map(parseFloat);

const read = (target: Locator) =>
	target.evaluate((el) => {
		const computed = getComputedStyle(el);
		const { opacity, transform } = (el as HTMLElement | SVGElement).style;
		return { opacity: computed.opacity, transform: computed.transform, style: { opacity, transform } };
	});

const supportsGetAnimations = (page: Page) => page.evaluate(() => !!window.Element.prototype.getAnimations);

test.describe("waapi-svg", () => {
	test("Drives SVG opacity and transform animations with WAAPI, not per-frame renders", async ({ page }) => {
		await visit(page, "?test=waapi-svg");
		await wait(page, 1000);
		test.skip(
			await supportsGetAnimations(page),
			"env: Chromium has Element.getAnimations(), so upstream skips this check"
		);

		/**
		 * Sanity check: the HTML control element is accelerated,
		 * proving the WAAPI path works in this environment.
		 */
		const control = await read(page.locator("#control"));
		expect(parseFloat(control.opacity)).toBeLessThan(0.97);
		expect(parseFloat(control.opacity)).toBeGreaterThan(0.25);
		expect(control.style.opacity).toBe("1");
		expect(control.style.transform).toBe("translateX(0px)");

		const circle = await read(page.locator("#circle"));
		expect(parseFloat(circle.opacity)).toBeLessThan(0.97);
		expect(parseFloat(circle.opacity)).toBeGreaterThan(0.25);
		const [, , , , translateX] = parseMatrix(circle.transform);
		expect(translateX).toBeGreaterThan(3);
		// Per-frame rendered values remain at the initial keyframe
		expect(circle.style.opacity).toBe("1");
		expect(circle.style.transform).toBe("translateX(0px)");

		const rect = await read(page.locator("#rect"));
		expect(parseFloat(rect.opacity)).toBeLessThan(0.97);
		expect(parseFloat(rect.opacity)).toBeGreaterThan(0.25);
		const [scaleX] = parseMatrix(rect.transform);
		expect(scaleX).toBeGreaterThan(1.01);
		expect(rect.style.opacity).toBe("1");
		expect(rect.style.transform).toBe("scale(1)");
	});

	test("Creates WAAPI animations on SVG elements (requires getAnimations support)", async ({ page }) => {
		await visit(page, "?test=waapi-svg");
		await wait(page, 200);
		test.skip(!(await supportsGetAnimations(page)));

		const getAnimatedProperties = (target: Locator) =>
			target.evaluate((element) =>
				element
					.getAnimations()
					.flatMap((animation) => Object.keys((animation.effect as KeyframeEffect).getKeyframes()[0] ?? {}))
			);

		await should(async () => {
			const properties = await getAnimatedProperties(page.locator("#circle"));
			expect(properties).toContain("opacity");
			expect(properties).toContain("transform");
		});
		await should(async () => {
			const properties = await getAnimatedProperties(page.locator("#rect"));
			expect(properties).toContain("opacity");
			expect(properties).toContain("transform");
		});
	});
});
