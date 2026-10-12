import { expect, test, type Locator } from "@playwright/test";
import { should, visit, wait } from "../../harness/upstream.js";

const rectOf = (target: Locator) =>
	target.first().evaluate((el) => {
		const { top, left, right, bottom } = el.getBoundingClientRect();
		return { top, left, right, bottom };
	});

const styleOf = (target: Locator) =>
	target.first().evaluate((el) => {
		const { transform, transformBox, transformOrigin } = (el as SVGElement).style;
		return { transform, transformBox, transformOrigin };
	});

test.describe("SVG", () => {
	test("Correctly applies transforms", async ({ page }) => {
		await visit(page, "?test=svg");
		await wait(page, 200);
		await should(async () => {
			const { top, left, right, bottom } = await rectOf(page.locator("[data-testid='rotate']"));
			expect(Math.round(top)).toBe(29);
			expect(Math.round(left)).toBe(29);
			expect(Math.round(right)).toBe(171);
			expect(Math.round(bottom)).toBe(171);
		});
		await should(async () => {
			const { top, left, right, bottom } = await rectOf(page.locator("[data-testid='scale']"));
			expect(top).toBe(150);
			expect(left).toBe(0);
			expect(right).toBe(200);
			expect(bottom).toBe(350);
		});
		await should(async () => {
			const { top, left, right, bottom } = await rectOf(page.locator("[data-testid='translate']"));
			expect(top).toBe(350);
			expect(left).toBe(150);
			expect(right).toBe(250);
			expect(bottom).toBe(450);
		});
	});
	test("Correctly applies transforms in static mode", async ({ page }) => {
		test.skip(true, "unsupported: MotionConfig has no isStatic prop (static rendering mode)");
		await visit(page, "?test=svg&isStatic=true");
		await wait(page, 200);
		await should(async () => {
			const { top, left, right, bottom } = await rectOf(page.locator("[data-testid='rotate']"));
			expect(Math.round(top)).toBe(29);
			expect(Math.round(left)).toBe(29);
			expect(Math.round(right)).toBe(171);
			expect(Math.round(bottom)).toBe(171);
		});
		await should(async () => {
			const { top, left, right, bottom } = await rectOf(page.locator("[data-testid='scale']"));
			expect(top).toBe(150);
			expect(left).toBe(0);
			expect(right).toBe(200);
			expect(bottom).toBe(350);
		});
		await should(async () => {
			const { top, left, right, bottom } = await rectOf(page.locator("[data-testid='translate']"));
			expect(top).toBe(350);
			expect(left).toBe(150);
			expect(right).toBe(250);
			expect(bottom).toBe(450);
		});
	});

	test("Correctly animates to CSS variables", async ({ page }) => {
		await visit(page, "?test=svg-css-vars");
		await wait(page, 50);
		await page.locator("svg").click();
		await wait(page, 50);
		await should(async () =>
			expect(await page.locator("circle").first().getAttribute("fill")).toBe("rgba(180, 0, 180, 1)")
		);
	});
});

test.describe("SVG origin", () => {
	test("Correctly animates origin", async ({ page }) => {
		test.fail(
			true,
			'motion-sv: SVG rect with animate={{ x: "none" }} gets no inline transform (style.transform "") instead of "none"'
		);
		await visit(page, "?test=svg-origin");
		await wait(page, 100);
		await should(async () => {
			const style = await styleOf(page.locator("#none-transform"));
			expect(style.transform).toBe("none");
			expect(style.transformBox).toBe("fill-box");
			expect(style.transformOrigin).toBe("50% 50%");
		});
		await should(async () => {
			const style = await styleOf(page.locator("#only-transform"));
			expect(style.transform).toBe("rotate(45deg)");
			expect(style.transformBox).toBe("fill-box");
			expect(style.transformOrigin).toBe("50% 50%");
		});
		await should(async () => {
			const style = await styleOf(page.locator("#only-transformOrigin"));
			expect(style.transform).toBe("");
			expect(style.transformBox).toBe("");
			expect(style.transformOrigin).toBe("100% 50% 0px");
		});
		await should(async () => {
			const style = await styleOf(page.locator("#transform-and-transformOrigin"));
			expect(style.transform).toBe("rotate(45deg)");
			expect(style.transformBox).toBe("fill-box");
			expect(style.transformOrigin).toBe("100% 50% 0px");
		});
		await wait(page, 100);
		await should(async () => {
			const style = await styleOf(page.locator("#no-set-originY"));
			expect(style.transform).toBe("rotate(180deg) skew(45deg)");
			expect(style.transformBox).toBe("fill-box");
			expect(style.transformOrigin).toBe("100% 50% 0px");
		});
		await should(async () => {
			const style = await styleOf(page.locator("#set-originY"));
			expect(style.transform).toBe("rotate(180deg) skew(45deg)");
			expect(style.transformBox).toBe("fill-box");
			expect(style.transformOrigin).toBe("100% 100% 0px");
		});
	});
});

test.describe("SVG measures", () => {
	test("Correctly measures SVG and renders on mount", async ({ page }) => {
		await visit(page, "?test=svg-initial-render");
		await should(async () => {
			const style = await styleOf(page.locator("path"));
			expect(style.transform).toBe("translateX(5px) translateY(5px)");
			expect(style.transformBox).toBe("fill-box");
			expect(style.transformOrigin).toBe("50% 50%");
		});
	});

	test("Measure SVG and renders on mount when encountering new transforms", async ({ page }) => {
		await visit(page, "?test=svg-animate-transform");
		await wait(page, 200);
		await should(async () => {
			const style = await styleOf(page.locator("path"));
			expect(style.transform).toBe("translateX(5px) translateY(5px)");
			expect(style.transformBox).toBe("fill-box");
			expect(style.transformOrigin).toBe("50% 50%");
		});
	});
});
