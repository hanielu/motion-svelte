import { expect, test } from "@playwright/test";
import { should, visit, wait } from "../../harness/upstream.js";

test.describe("animate() x read transform value", () => {
	test("correctly reads and animates transform values", async ({ page }) => {
		const transformOf = (selector: string) =>
			page.locator(selector).evaluate((el) => (el as HTMLElement).style.transform);

		await visit(page, "?test=animate-read-transform");
		await wait(page, 500);
		await should(async () => {
			const transform = await transformOf(".translate");
			expect(transform).toContain("translateX(150px)");
		});

		await should(async () => {
			const transform = await transformOf(".rotate");
			expect(transform).toContain("rotate(95deg)");
		});

		await should(async () => {
			const transform = await transformOf(".scale");
			expect(transform).toContain("scale(3)");
		});
	});
});
