import { scenario } from "../../harness/scenario.js";

scenario("basic-layout-toggle", async ({ root, play }) => {
	await play(20);
	await root.getByRole("button").click();
	await play(40);
	await root.getByRole("button").click();
	await play(40);
});

scenario("basic-layout-list", async ({ root, play }) => {
	await play(20);
	await root.getByPlaceholder("Add item").fill("Write tests");
	await root.getByRole("button", { name: "Add", exact: true }).click();
	await play(60);
	await root.getByRole("button", { name: "Remove" }).nth(1).click();
	await play(60);
	await root.getByRole("button", { name: "Shuffle" }).click();
	await play(60);
	await root.getByRole("button", { name: "Clear" }).click();
	await play(60);
});

scenario("layout-id-test", async ({ page, root, play }) => {
	await play(20);
	await root.getByText("Cheese").hover();
	await play(40);
	await root.getByText("Lettuce").hover();
	await play(40);
	await page.mouse.move(0, 0);
	await play(20);
});

scenario("directional-nav", async ({ root, play }) => {
	await play(20);
	await root.getByText("Collections").hover();
	await play(40);
	await root.getByText("32 Followers").hover();
	await play(40);
	await root.getByRole("button", { name: /Change direction/ }).click();
	await play(60);
	await root.getByText("Saved Sites").hover();
	await play(40);
});

scenario(
	"quillow-card",
	async ({ page, root, play }) => {
		const card = root.locator("div.s-screen > div").first();
		await play(30);
		await root.locator("button.w-35px").click();
		await play(60);
		// The card resized under the pointer; leaving it hid the actions after 500ms. Hovering brings them back.
		await card.hover();
		await play(40);
		await root.locator("button.s-22px").click();
		await play(60);
		await card.hover();
		await play(40);
		await root.locator("button.s-30px").click();
		await play(60);
		await card.hover();
		await play(40);
		await root.locator("button.p-2").first().click();
		await play(40);
		await page.mouse.move(0, 0);
		await play(60);
	},
	{ path: "/quillow-card", root: "#app" }
);
