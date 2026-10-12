import { scenario } from "../../harness/scenario.js";

scenario("lazy-motion", async ({ page, root, play }) => {
	await play(10);
	await root.getByText("Hello").hover();
	await play(40);
	await page.mouse.move(0, 0);
	await play(40);
});

scenario("reorder-example-1", async ({ root, play, drag }) => {
	await play(10);
	await drag(root.getByText("Tomato"), 0, 130, 30);
	await play(60);
});

scenario("rolling-box", async ({ page, root, play }) => {
	// The rotated box overlaps the button, so a real click would land on the box.
	await play(30);
	await root.getByRole("button", { name: "Click me" }).dispatchEvent("click");
	await play(60);
	await root.getByRole("button", { name: "Click me" }).dispatchEvent("click");
	await play(60);
	await root.locator("#test").hover();
	await play(30);
	await page.mouse.down();
	await play(20);
	await page.mouse.up();
	await play(30);
});
