import { expect, test, type Page } from "@playwright/test";
import { nextFrame, should, trigger, visit, wait } from "../../harness/upstream.js";

const drag = async (page: Page, x: number, y: number) => {
	const a = page.locator("[data-testid='a']");
	await nextFrame(page);
	await nextFrame(page);
	await trigger(a, "pointerdown", 40, 40);
	await wait(page, 50);
	await trigger(a, "pointermove", 50, 50);
	await nextFrame(page);
	await wait(page, 50);
	await trigger(a, "pointermove", x, y);
	await nextFrame(page);
	await wait(page, 100);
};

const currentOrder = (page: Page) => page.locator("[data-testid='current-order']").textContent();

test.describe("Reorder flex layouts", () => {
	test("auto-detects a flex row", async ({ page }) => {
		await visit(page, "?test=reorder-flex&layout=row");
		await wait(page, 200);
		await drag(page, 150, 40);
		await should(async () => expect(await currentOrder(page)).toBe("b,a,c,d"));
	});

	test("auto-detects a flex column", async ({ page }) => {
		await visit(page, "?test=reorder-flex&layout=column");
		await wait(page, 200);
		await drag(page, 40, 150);
		await should(async () => expect(await currentOrder(page)).toBe("b,a,c,d"));
	});

	test("auto-detects wrapped flex rows", async ({ page }) => {
		await visit(page, "?test=reorder-flex&layout=wrap");
		await wait(page, 200);
		await drag(page, 150, 150);
		await should(async () => expect(await currentOrder(page)).toBe("b,c,d,a"));
	});

	test("auto-detects wrapped RTL flex rows", async ({ page }) => {
		await visit(page, "?test=reorder-flex&layout=wrap-rtl");
		await wait(page, 200);
		await drag(page, -70, 150);
		await should(async () => expect(await currentOrder(page)).toBe("b,c,d,a"));
	});
});
