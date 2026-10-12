import { expect, test, type Page } from "@playwright/test";
import { should, visit, wait } from "../../harness/upstream.js";

test.describe("animateMini()", () => {
	const widthOf = (page: Page) =>
		page.locator("#box").evaluate((el) => ({
			rect: el.getBoundingClientRect().width,
			style: (el as HTMLElement).style.width,
		}));

	test("correctly runs an animation", async ({ page }) => {
		await visit(page, "?test=animate-style");
		await wait(page, 200);
		await should(async () => {
			const width = await widthOf(page);
			expect(width.rect).toBe(200);
			expect(width.style).toBe("200px");
		});
	});

	test("complete() correctly finishes the animation", async ({ page }) => {
		await visit(page, "?test=animate-style-complete");
		await wait(page, 200);
		await should(async () => {
			const width = await widthOf(page);
			expect(width.rect).toBe(200);
			expect(width.style).toBe("200px");
		});
	});

	test("pause() correctly pauses the animation", async ({ page }) => {
		await visit(page, "?test=animate-style-pause");
		await wait(page, 400);
		await should(async () => {
			// Only check it's not at the final value - proves pause worked
			// Don't check lower bound as timing varies on CI
			const width = await widthOf(page);
			expect(width.rect).toBeLessThan(200);
		});
	});

	test("autoplay correctly pauses the animation on creation", async ({ page }) => {
		await visit(page, "?test=animate-style-autoplay");
		await wait(page, 200);
		await should(async () => {
			const width = await widthOf(page);
			expect(width.rect).toBe(100);
			expect(width.style).toBe("100px");
		});
	});

	test("play correctly resumes the animation", async ({ page }) => {
		await visit(page, "?test=animate-style-play");
		await wait(page, 200);
		await should(async () => {
			const width = await widthOf(page);
			expect(width.rect).toBe(200);
			expect(width.style).toBe("200px");
		});
	});

	test("fires its promise on end", async ({ page }) => {
		await visit(page, "?test=animate-style-promise");
		await wait(page, 200);
		await should(async () =>
			expect(await page.locator("#box").evaluate((el) => (el as HTMLElement).style.backgroundColor)).toBe("red")
		);
	});

	test("correctly reads wildcard keyframes", async ({ page }) => {
		await visit(page, "?test=animate-style-wildcard");
		await wait(page, 200);
		await should(async () => {
			const width = await widthOf(page);
			expect(width.rect).toBe(200);
			expect(width.style).toBe("200px");
		});
	});

	test("works correctly with stagger", async ({ page }) => {
		await visit(page, "?test=animate-style-stagger");
		await wait(page, 500);
		await should(async () =>
			expect(await page.locator("#box").evaluate((el) => (el as HTMLElement).style.opacity)).toBe("1")
		);
	});

	test("works correctly with CSS variables", async ({ page }) => {
		await visit(page, "?test=animate-style-css-var");
		await wait(page, 500);
		await should(async () => {
			const { x, left } = await page.locator("#box").evaluate((el) => ({
				x: (el as HTMLElement).style.getPropertyValue("--x"),
				left: el.getBoundingClientRect().left,
			}));
			expect(x).toBe("500px");
			expect(left).toBe(500);
		});
	});
});
