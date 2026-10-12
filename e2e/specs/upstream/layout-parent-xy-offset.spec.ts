import { expect, test } from "@playwright/test";
import { visit, wait } from "../../harness/upstream.js";

test.describe("Layout: nested in motion.div with x/y (#3244)", () => {
	test("layoutId element inside motion.div with x/y should not get a projection transform on mount", async ({
		page,
	}) => {
		// onBeforeLoad
		await page.addInitScript(() => {
			// Set up MutationObserver before React renders so we catch
			// any transient projection transforms during StrictMode remount
			const win = window as any;
			win.__projectionTransforms = [];
			const observer = new win.MutationObserver((mutations: MutationRecord[]) => {
				for (const m of mutations) {
					if (m.attributeName !== "style") continue;
					const el = m.target as HTMLElement;
					if (!el.classList?.contains("indicator")) continue;
					const motionParent = win.document.getElementById("motion-parent");
					if (!motionParent?.contains(el)) continue;
					const t = el.style.transform;
					if (t && t !== "none") {
						win.__projectionTransforms.push(t);
					}
				}
			});
			// Start observing as soon as DOM is available
			const startObserving = () => {
				observer.observe(win.document.body, {
					attributes: true,
					attributeFilter: ["style"],
					subtree: true,
				});
			};
			if (win.document.body) {
				startObserving();
			} else {
				win.document.addEventListener("DOMContentLoaded", startObserving);
			}
		});
		await visit(page, "?test=layout-parent-xy-offset");
		await wait(page, 500);
		const transforms = await page.evaluate(() => (window as any).__projectionTransforms as string[]);
		// The MutationObserver records every non-"none" transform
		// set on the indicator inside the motion.div parent.
		// If the bug is present, the projection system will briefly
		// apply a translate() transform during StrictMode remount.
		expect(transforms.length, `expected no projection transforms but got: ${transforms.join(", ")}`).toBe(0);
	});
});
