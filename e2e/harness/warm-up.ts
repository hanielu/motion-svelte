import { chromium, type FullConfig } from "@playwright/test";

/**
 * On a cold dependency cache (first run, or after upgrading dependencies) Vite optimizes dependencies as pages request
 * them, then reloads every open page, which would cut playground scenarios off mid-recording. Load every playground
 * route in parallel until a whole pass gets through without a reload.
 */
export default async function warmUp(config: FullConfig) {
	const baseURL = config.projects.find((project) => project.name === "playground")?.use.baseURL;
	if (!baseURL) return;

	const browser = await chromium.launch();
	const context = await browser.newContext({ baseURL });
	try {
		const index = await context.newPage();
		await index.goto("/");
		await index.waitForLoadState("networkidle");
		const routes = await index
			.locator('a[href^="/"]')
			.evaluateAll((links) => [...new Set(links.map((link) => link.getAttribute("href")!))]);

		for (let pass = 1; ; pass++) {
			let reloads = 0;
			await Promise.all(
				routes.map(async (route) => {
					const page = await context.newPage();
					page.on("load", () => reloads++);
					await page.goto(route);
					await page.waitForLoadState("networkidle");
					await page.close();
				})
			);
			// Each page loads once on its own; any further document load was Vite reloading it.
			if (reloads === routes.length) break;
			if (pass === 5) throw new Error("Playground dev server kept reloading pages during warm-up");
		}
	} finally {
		await browser.close();
	}
}
