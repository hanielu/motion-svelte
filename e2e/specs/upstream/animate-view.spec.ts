import { test } from "@playwright/test";

const unsupported =
	"unsupported: motion-sv has no AnimateView (motion/react-animate-view wraps React 19.3's <ViewTransition>, which Svelte has no equivalent of)";

test.describe("AnimateView entry point", () => {
	test("keeps ordinary Motion working and reports unsupported React versions", () => {
		test.skip(true, unsupported);
	});

	for (const mode of ["default", "custom", "share", "update"]) {
		test(`animates ${mode} views with Motion timing`, () => {
			test.skip(true, unsupported);
		});
	}
});
