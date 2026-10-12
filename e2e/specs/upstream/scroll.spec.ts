import { expect, test, type Locator, type Page } from "@playwright/test";
import { bbox, should, visit, wait } from "../../harness/upstream.js";

/**
 * `cy.scrollTo(x, y)` (the page) / `cy.get(sel).scrollTo(x, y)` (an element). `"bottom"` is Cypress' bottom
 * position: x 50%, y 100% of the scrollable range.
 */
async function scrollTo(target: Page | Locator, x: number | "bottom", y = 0) {
	const scroller = "goto" in target ? target.locator(":root") : target.first();
	await scroller.evaluate(
		(el, { x, y }) => {
			const [left, top] =
				x === "bottom" ? [(el.scrollWidth - el.clientWidth) / 2, el.scrollHeight - el.clientHeight] : [x, y];
			el.scrollTo(left, top);
		},
		{ x, y }
	);
}

const innerText = (locator: Locator) => locator.first().evaluate((el) => (el as HTMLElement).innerText);
const computedStyle = (locator: Locator) =>
	locator.first().evaluate((el) => {
		const { backgroundColor, color, opacity } = getComputedStyle(el);
		return { backgroundColor, color, opacity, transform: (el as HTMLElement).style.transform };
	});

test.describe("scroll() callbacks", () => {
	test("Fires callback on first frame, before scroll event", async ({ page }) => {
		await visit(page, "?test=scroll-callback-first-frame");
		await wait(page, 100);
		await should(async () => {
			expect(await innerText(page.locator("#progress"))).toBe("2");
		});
	});

	test("Correctly updates window scroll progress callback", async ({ page }) => {
		await visit(page, "?test=scroll-container");
		await wait(page, 100);

		await scrollTo(page.locator("#container"), 0, 50);
		await should(async () => {
			expect(await innerText(page.locator("#label"))).toBe("0.5");
		});
	});

	test("Correctly measures scroll position", async ({ page }) => {
		await visit(page, "?test=scroll-callback-window");
		await wait(page, 100);
		await page.setViewportSize({ width: 100, height: 400 });

		await scrollTo(page, 0, 600);
		await wait(page, 200);
		await should(async () => {
			expect(await innerText(page.locator("#progress"))).toBe("0.5");
		});
		await page.setViewportSize({ width: 100, height: 800 });
		await wait(page, 200);
		await should(async () => {
			expect(await innerText(page.locator("#progress"))).toBe("0.25");
		});

		await should(async () => {
			expect(await innerText(page.locator("#error"))).toBe("");
		});
	});

	test("Correctly updates window scroll progress callback, x axis", async ({ page }) => {
		await visit(page, "?test=scroll-callback-window-x");
		await wait(page, 100);
		await page.setViewportSize({ width: 400, height: 100 });

		await scrollTo(page, 600, 0);
		await wait(page, 200);
		await should(async () => {
			expect(await innerText(page.locator("#progress"))).toBe("0.5");
		});
		await page.setViewportSize({ width: 800, height: 100 });
		await wait(page, 200);
		await should(async () => {
			expect(await innerText(page.locator("#progress"))).toBe("0.25");
		});
	});

	test("Correctly updates element scroll progress callback", async ({ page }) => {
		await visit(page, "?test=scroll-callback-element");
		await wait(page, 100);

		await scrollTo(page.locator("#scroller"), 0, 600);
		await wait(page, 200);
		await should(async () => {
			const progress = parseFloat(await innerText(page.locator("#progress")));
			const isClose = progress >= 0.49 && progress <= 0.51;
			expect(isClose).toBe(true);
		});
	});

	test("Correctly updates element scroll progress callback, x axis", async ({ page }) => {
		await visit(page, "?test=scroll-callback-element-x");
		await wait(page, 100);

		await scrollTo(page.locator("#scroller"), 600, 0);
		await wait(page, 200);
		await should(async () => {
			const progress = parseFloat(await innerText(page.locator("#progress")));
			const isClose = progress >= 0.49 && progress <= 0.51;
			expect(isClose).toBe(true);
		});
	});
});

test.describe("scroll() animation", () => {
	test("Updates animation on first frame, before scroll event", async ({ page }) => {
		await visit(page, "?test=scroll-animate-window");
		await wait(page, 100);
		await should(async () => {
			expect((await computedStyle(page.locator("#color"))).backgroundColor).toBe("rgb(255, 255, 255)");
		});
	});

	test("Correctly updates window scroll progress callback", async ({ page }) => {
		const color = page.locator("#color");
		await visit(page, "?test=scroll-animate-window");
		await wait(page, 100);
		await page.setViewportSize({ width: 100, height: 400 });

		await scrollTo(page, 0, 600);
		await wait(page, 200);
		await should(async () => {
			const style = await computedStyle(color);

			// backgroundColor is WAAPI-accelerated so the browser interpolates in sRGB
			expect(style.backgroundColor).toBe("rgb(128, 128, 128)");

			// This is animated by animate mini and thus doesn't use linear RGB mixing
			expect(style.color).toBe("rgb(128, 128, 128)");

			expect(style.opacity).toBe("0.5");
			expect(style.transform).toBe("translateX(50px)");

			expect(await innerText(color)).toBe("50");
		});
		await page.setViewportSize({ width: 100, height: 800 });
		await wait(page, 200);
		await should(async () => {
			const style = await computedStyle(color);
			expect(style.backgroundColor).toBe("rgb(191, 191, 191)");
			expect(style.color).toBe("rgb(64, 64, 64)");
		});
	});

	test("With useAnimateMini, updates animation on first frame, before scroll event", async ({ page }) => {
		await visit(page, "?test=scroll-animate-style");
		await wait(page, 100);
		await should(async () => {
			expect((await computedStyle(page.locator("#color"))).backgroundColor).toBe("rgb(255, 255, 255)");
		});
	});

	test("Correctly applies the same easing to both useAnimate and useAnimateMini", async ({ page }) => {
		await visit(page, "?test=scroll-default-ease");
		await wait(page, 100);
		await page.setViewportSize({ width: 400, height: 400 });

		// Scroll halfway down the page
		await scrollTo(page, 0, 1250);
		await wait(page, 200);

		// Get all the elements we need to compare
		const byText = (text: string) => page.getByText(text, { exact: true });
		const miniDefault = byText("mini - default");
		const animateDefault = byText("animate - default");
		const miniEaseOut = byText("mini - easeOut");
		const animateEaseOut = byText("animate - easeOut");
		const miniSpring = byText("mini - spring");
		const animateSpring = byText("animate - spring");
		const animateMainThreadDefault = byText("animate main thread - default");
		const animateMainThreadEaseOut = byText("animate main thread - easeOut");
		const animateMainThreadSpring = byText("animate main thread - spring");

		// Now compare transforms
		const miniDefaultBounds = await bbox(miniDefault);
		const animateDefaultBounds = await bbox(animateDefault);
		const miniEaseOutBounds = await bbox(miniEaseOut);
		const animateEaseOutBounds = await bbox(animateEaseOut);
		const miniSpringBounds = await bbox(miniSpring);
		await animateSpring.waitFor({ state: "attached" });
		const animateMainThreadDefaultBounds = await bbox(animateMainThreadDefault);
		const animateMainThreadEaseOutBounds = await bbox(animateMainThreadEaseOut);
		const animateMainThreadSpringBounds = await bbox(animateMainThreadSpring);

		// Both default boxes should have the same position
		expect(miniDefaultBounds.left).toBe(animateDefaultBounds.left);

		// Both easeOut boxes should have the same position
		expect(miniEaseOutBounds.left).toBe(animateEaseOutBounds.left);

		expect(animateMainThreadDefaultBounds.left).toBe(animateDefaultBounds.left);
		expect(Math.round(animateMainThreadEaseOutBounds.left)).toBe(Math.round(animateEaseOutBounds.left));

		// Skipping as env doesn't support linear() easing
		// expect(miniSpringBounds.left).toBe(animateSpringBounds.left)

		// Each easing type should have different positions
		expect(miniDefaultBounds.left).not.toBe(miniEaseOutBounds.left);
		expect(miniDefaultBounds.left).not.toBe(miniSpringBounds.left);
		expect(animateMainThreadDefaultBounds.left).not.toBe(animateMainThreadEaseOutBounds.left);
		expect(animateMainThreadDefaultBounds.left).not.toBe(animateMainThreadSpringBounds.left);
		// Skipping as env doesn't support linear() easing
		// expect(miniEaseOutBounds.left).not.toBe(miniSpringBounds.left)
	});

	test("correctly applies parallax animations", async ({ page }) => {
		await visit(page, "?test=scroll-parallax");
		await page.setViewportSize({ width: 1000, height: 500 });
		await wait(page, 200);
		await should(async () => {
			expect((await bbox(page.locator(".img-container:first-child .main-thread.sentinel"))).top).toBe(200);
		});
		await should(async () => {
			expect((await bbox(page.locator(".img-container:first-child .waapi.sentinel"))).top).toBe(200);
		});
		await should(async () => {
			expect((await bbox(page.locator(".img-container:first-child .waapi.sentinel"))).top).toBe(200);
		});
	});
});

test.describe("SVG", () => {
	test("tracks SVG elements as target", async ({ page }) => {
		const rectProgress = page.locator("#rect-progress");
		const svgProgress = page.locator("#svg-progress");
		await visit(page, "?test=scroll-svg");
		await wait(page, 100);
		await page.setViewportSize({ width: 100, height: 400 });
		await should(async () => expect(await innerText(rectProgress)).toBe("0"));
		await should(async () => expect(await innerText(svgProgress)).toBe("0"));
		await scrollTo(page, 0, 25);
		await should(async () => expect(await innerText(rectProgress)).toBe("0"));
		await should(async () => expect(await innerText(svgProgress)).not.toBe("0"));
		await scrollTo(page, 0, 75);
		await should(async () => expect(await innerText(rectProgress)).not.toBe("0"));
		await should(async () => expect(await innerText(svgProgress)).not.toBe("0"));
		await scrollTo(page, 0, 500);
		await should(async () => expect(await innerText(rectProgress)).not.toBe("1"));
		await should(async () => expect(await innerText(svgProgress)).not.toBe("1"));
		await scrollTo(page, 0, 600);
		await should(async () => expect(await innerText(rectProgress)).toBe("1"));
		await should(async () => expect(await innerText(svgProgress)).toBe("1"));
	});
});

test.describe("scroll() full height target", () => {
	test("doesn't return progress 1 before it hits its first offset", async ({ page }) => {
		await visit(page, "?test=scroll-fill-range");
		await wait(page, 100);
		await should(async () => {
			expect(await innerText(page.locator("#content"))).toBe("0");
		});
	});
});

test.describe.skip("scroll() container tracking", () => {
	test("correctly tracks position of a target with container of fixed height", async ({ page }) => {
		await visit(page, "?test=scroll-explicit-height");
		await page.setViewportSize({ width: 800, height: 500 });
		await wait(page, 100);
		await scrollTo(page.locator("#scroll-container"), 0, 139);
		await wait(page, 100);
		await should(async () => {
			const opacity = await page.locator("#item-0").evaluate((el) => (el as HTMLElement).style.opacity);
			expect(parseInt(opacity)).toBe(1);
		});
		await scrollTo(page.locator("#scroll-container"), 0, 1000);
		await wait(page, 100);
		await should(async () => {
			const opacity = await page.locator("#item-2").evaluate((el) => (el as HTMLElement).style.opacity);
			expect(opacity).not.toBe("0");
			expect(opacity).not.toBe("1");
		});
	});
});

test.describe("scroll() dynamic content", () => {
	test("Recalculates window scrollYProgress when content is added below", async ({ page }) => {
		await visit(page, "?test=scroll-progress-dynamic-content");
		await wait(page, 100);
		await page.setViewportSize({ width: 100, height: 400 });

		// Scroll to bottom (100% with 2 screens of content)
		await scrollTo(page, "bottom");
		await wait(page, 200);
		await should(async () => {
			expect(parseFloat(await innerText(page.locator("#progress")))).toBeGreaterThan(0.95);
		});

		// Wait for dynamic content to load
		await should(async () => expect(await page.locator("#content-loaded").textContent()).toContain("loaded"));
		await wait(page, 200);

		// Progress should recalculate WITHOUT scrolling - now we're ~50% down
		await should(async () => {
			expect(parseFloat(await innerText(page.locator("#progress")))).toBeLessThan(0.7);
		});
	});

	test("Recalculates element scrollYProgress when content is added", async ({ page }) => {
		await visit(page, "?test=scroll-progress-dynamic-content-element");
		await wait(page, 100);

		// Scroll to bottom of element (100% with 2 screens of content)
		await scrollTo(page.locator("#scroller"), "bottom");
		await wait(page, 200);
		await should(async () => {
			expect(parseFloat(await innerText(page.locator("#progress")))).toBeGreaterThan(0.95);
		});

		// Wait for dynamic content to load
		await should(async () => expect(await page.locator("#content-loaded").textContent()).toContain("loaded"));
		await wait(page, 200);

		// Progress should recalculate WITHOUT scrolling - now we're ~50% down
		await should(async () => {
			expect(parseFloat(await innerText(page.locator("#progress")))).toBeLessThan(0.7);
		});
	});
});
