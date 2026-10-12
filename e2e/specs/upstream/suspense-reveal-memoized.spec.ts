import { test } from "@playwright/test";

test.describe("Suspense reveal of memoized content", () => {
	test("replays the enter animation when a re-suspended boundary reveals", () => {
		test.skip(true, "unsupported: Svelte has no <Suspense> that hides and later reveals a mounted subtree");
	});
});
