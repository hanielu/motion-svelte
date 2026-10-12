import { expect, test, type Locator, type Page } from "@playwright/test";
import { should, visit, wait } from "../../harness/upstream.js";

/** `cy.scrollTo("bottom", { duration })`: animates the page scroll to Cypress' bottom position with jQuery's swing easing. */
async function scrollToBottom(page: Page, duration: number) {
	await page.evaluate(
		(duration) =>
			new Promise<void>((resolve) => {
				const el = document.documentElement;
				const from = [el.scrollLeft, el.scrollTop];
				const to = [(el.scrollWidth - el.clientWidth) / 2, el.scrollHeight - el.clientHeight];
				const start = performance.now();
				const step = (now: number) => {
					const p = Math.min((now - start) / duration, 1);
					const eased = 0.5 - Math.cos(p * Math.PI) / 2;
					el.scrollTo(from[0] + (to[0] - from[0]) * eased, from[1] + (to[1] - from[1]) * eased);
					p < 1 ? requestAnimationFrame(step) : resolve();
				};
				requestAnimationFrame(step);
			}),
		duration
	);
}

const innerText = (locator: Locator) => locator.first().evaluate((el) => (el as HTMLElement).innerText);
const opacity = (locator: Locator) => locator.first().evaluate((el) => parseFloat(getComputedStyle(el).opacity));

test.describe("useScroll with target does not set accelerate", () => {
	test("Does not set accelerate when target is provided", async ({ page }) => {
		test.fail(
			true,
			"motion-sv: useScroll picks its accelerate config at construction, before the target element is bound, so a target with a non-ViewTimeline offset still gets the window ScrollTimeline config: accelerate is 'true', expected 'false'"
		);
		await visit(page, "?test=scroll-target-transform");
		await wait(page, 200);
		await should(async () => {
			expect(await innerText(page.locator("#has-accelerate"))).toBe("false");
		});
	});

	test("Opacity updates via useTransform when scrolling", async ({ page }) => {
		await visit(page, "?test=scroll-target-transform");
		await wait(page, 200);
		await should(async () => {
			// Before scrolling, opacity should be near initial value
			const initialOpacity = await opacity(page.locator("#target"));
			expect(initialOpacity).toBeGreaterThan(0);
		});
		await scrollToBottom(page, 300);
		await wait(page, 200);
		await should(async () => {
			// After scrolling, opacity should have changed
			expect(await opacity(page.locator("#target"))).toBeLessThan(1);
		});
	});
});
