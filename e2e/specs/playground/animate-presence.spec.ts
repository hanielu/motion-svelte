import { scenario } from "../../harness/scenario.js";

scenario("box-switch", async ({ root, play }) => {
	await play(30);
	await root.getByRole("button").click();
	await play(150);
	await root.getByRole("button").click();
	await play(150);
});

scenario("login-link-btn", async ({ root, play }) => {
	await play(20);
	await root.getByRole("button").click();
	// loading after click, success at 1750ms, back to idle at 3500ms
	await play(240);
});

scenario("enter-exit-basic", async ({ page, root, play }) => {
	await play(20);
	await root.getByRole("button", { name: "Hide" }).click();
	await play(60);
	await root.getByRole("button", { name: "Show" }).click();
	await play(60);
	await page.mouse.move(0, 0);
	await root.locator("div > div").first().hover();
	await play(30);
});

scenario("enter-exit-list", async ({ root, play }) => {
	await play(20);
	await root.getByPlaceholder("Add item").fill("Write tests");
	await root.getByRole("button", { name: "Add", exact: true }).click();
	await play(60);
	await root.getByRole("button", { name: "Remove" }).nth(1).click();
	await play(60);
	await root.getByRole("button", { name: "Shuffle" }).click();
	await play(60);
	await root.getByPlaceholder("Filter").fill("zzz");
	await play(60);
	await root.getByPlaceholder("Filter").fill("");
	await play(60);
	await root.getByRole("button", { name: "Clear" }).click();
	await play(60);
});

scenario("enis-repro-gallery", async ({ root, play }) => {
	await play(20);
	await root.getByRole("button").first().click();
	await play(60);
	await root.locator(".lightbox-backdrop").click({ position: { x: 5, y: 5 } });
	await play(60);
});
