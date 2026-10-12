import { test } from "@playwright/test";

/**
 * Two-pass FLIP (the AnimateNumber pattern): a layout effect starts one
 * animation (the digit roll), and a setState in an effect triggers a `layout`
 * width animation in a second render. Both must start on the same frame.
 */
const cases = [
	["sync", "layoutEffect"],
	["transition", "layoutEffect"],
	["useTransition", "layoutEffect"],
	["sync", "effect"],
	["transition", "effect"],
	["useTransition", "effect"],
];

const unsupported =
	"unsupported: React concurrent rendering (startTransition, useTransition) and React's useLayoutEffect/useEffect commit scheduling; Svelte has no equivalent";

test.describe("Concurrent React: two-pass FLIP", () => {
	for (const [mode, inner] of cases) {
		test(`outer ${mode}, inner ${inner}: roll and width start on the same frame`, () => {
			test.skip(true, unsupported);
		});
	}
});
