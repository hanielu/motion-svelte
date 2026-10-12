import { scenario } from "../../harness/scenario.js";

scenario("in-view", async ({ root, play }) => {
	await play(30);
	for (let i = 0; i < 8; i++) {
		// The example view's scroll container, not the window, scrolls.
		await root.evaluate((el) => el.closest(".overflow-y-auto")!.scrollBy(0, 400));
		await play(30, { every: 2 });
	}
});

scenario("use-spring", async ({ page, play }) => {
	await play(10);
	await page.mouse.move(700, 400);
	await play(90, { every: 2 });
	await page.mouse.move(1000, 600);
	await play(120, { every: 2 });
});

scenario("use-time", async ({ play }) => {
	await play(120, { every: 4 });
});

scenario("use-transform", async ({ root, play, drag }) => {
	await play(10);
	const box = root.locator(".use-transform-box");
	await drag(box, 120, 0);
	await play(60);
	await drag(box, -120, 0);
	await play(60);
});

scenario("use-transform-path-morphing", async ({ play }) => {
	// one shape every 1.3s
	await play(300, { every: 2 });
});

scenario("drag-direction-locking", async ({ root, play, drag }) => {
	await play(10);
	const box = root.locator(".box");
	await drag(box, 100, 8);
	await play(60);
	await drag(box, 8, 100);
	await play(60);
});
