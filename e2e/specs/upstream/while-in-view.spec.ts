import { expect, test, type Locator, type Page } from "@playwright/test";
import { should, visit, wait } from "../../harness/upstream.js";

/** `cy.scrollTo(x, y)` (the page) / `cy.get(sel).scrollTo(x, y)` (an element). */
async function scrollTo(target: Page | Locator, x: number, y: number) {
	const scroller = "goto" in target ? target.locator(":root") : target.first();
	await scroller.evaluate((el, [x, y]) => el.scrollTo(x, y), [x, y]);
}

// Upstream reads `innerHTML`; Svelte prefixes children with an anchor comment (`<!---->Out`), so compare text instead.
const box = (page: Page) =>
	page.locator("#box").evaluate((el) => ({
		backgroundColor: (el as HTMLElement).style.backgroundColor,
		text: el.textContent,
	}));

test.describe("whileInView", () => {
	test("Animates when an element enters the viewport", async ({ page }) => {
		await visit(page, "?test=while-in-view");
		await wait(page, 50);
		await should(async () => {
			const element = await box(page);
			expect(element.backgroundColor).toBe("rgb(255, 0, 0)");
			expect(element.text).toBe("Out");
		});

		await scrollTo(page, 0, 50);
		await wait(page, 50);
		await should(async () => {
			const element = await box(page);
			expect(element.backgroundColor).toBe("rgb(0, 255, 0)");
			expect(element.text).toBe("In");
		});
	});

	test("Animates when an element leaves the viewport", async ({ page }) => {
		await visit(page, "?test=while-in-view");
		await wait(page, 50);
		await scrollTo(page, 0, 0);
		await wait(page, 50);
		await should(async () => {
			const element = await box(page);
			expect(element.backgroundColor).toBe("rgb(255, 0, 0)");
			expect(element.text).toBe("Out");
		});
	});

	test("Animates only when all an element enters the viewport and amount='all'", async ({ page }) => {
		await visit(page, "?test=while-in-view&amount=all");
		await wait(page, 50);
		await should(async () => {
			expect((await box(page)).backgroundColor).toBe("rgb(255, 0, 0)");
		});

		await scrollTo(page, 0, 50);
		await wait(page, 50);
		await should(async () => {
			expect((await box(page)).backgroundColor).toBe("rgb(255, 0, 0)");
		});

		await scrollTo(page, 0, 150);
		await wait(page, 50);
		await should(async () => {
			expect((await box(page)).backgroundColor).toBe("rgb(0, 255, 0)");
		});
	});

	test("Animates when an element enters the viewport once", async ({ page }) => {
		await visit(page, "?test=while-in-view&once=true");
		await wait(page, 50);
		await should(async () => {
			const element = await box(page);
			expect(element.backgroundColor).toBe("rgb(255, 0, 0)");
			expect(element.text).toBe("Out");
		});

		await scrollTo(page, 0, 50);
		await wait(page, 50);
		await should(async () => {
			const element = await box(page);
			expect(element.backgroundColor).toBe("rgb(0, 255, 0)");
			expect(element.text).toBe("In");
		});

		await scrollTo(page, 0, 0);
		await wait(page, 50);
		await should(async () => {
			const element = await box(page);
			expect(element.backgroundColor).toBe("rgb(0, 255, 0)");
			expect(element.text).toBe("In");
		});
	});

	test("Animates when entering a custom root", async ({ page }) => {
		await visit(page, "?test=while-in-view-custom-root");
		await wait(page, 50);
		await should(async () => {
			expect((await box(page)).backgroundColor).toBe("rgb(255, 0, 0)");
		});
		await scrollTo(page.locator("#container"), 500, 0);
		await wait(page, 50);
		await should(async () => {
			expect((await box(page)).backgroundColor).toBe("rgb(0, 255, 0)");
		});
		await scrollTo(page.locator("#container"), 0, 0);
		await wait(page, 50);
		await should(async () => {
			expect((await box(page)).backgroundColor).toBe("rgb(255, 0, 0)");
		});
	});

	/**
	 * Manually verified this does work but headless browser not respecting margin
	 */
	test.skip("Respects margin", async ({ page }) => {
		await visit(page, "?test=while-in-view&margin=100px");
		await wait(page, 100);
		await should(async () => {
			const element = await box(page);
			expect(element.backgroundColor).toBe("rgb(0, 255, 0)");
			expect(element.text).toBe("In");
		});
	});
});
