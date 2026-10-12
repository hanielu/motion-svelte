import { scenario } from "../../harness/scenario.js";

scenario("copy-button", async ({ root, play }) => {
	await play(20);
	await root.getByRole("button", { name: "Copy code snippet" }).click();
	// reverts after 3000ms
	await play(220, { every: 2 });
});

scenario("path-drawing", async ({ play }) => {
	// staggered by 0.5s per path, 1.5s springs
	await play(240, { every: 2 });
});

scenario("progress-center-reveal", async ({ root, play }) => {
	// progress runs for 10s, completes once the 12s "work" resolves
	await play(800, { every: 8 });
	await root.getByRole("button", { name: "replay" }).click();
	await play(60);
});

scenario("when-variant", async ({ root, play }) => {
	await play(10);
	await root.getByRole("button", { name: "Toggle" }).click();
	// children take 4s to enter
	await play(300, { every: 2 });
	await root.getByRole("button", { name: "Toggle" }).click();
	await play(120, { every: 2 });
});

scenario("image-gallery", async ({ root, play }) => {
	await play(20);
	await root.getByRole("button").first().click();
	await play(60);
	await root.getByRole("button").last().click();
	await play(60);
});
