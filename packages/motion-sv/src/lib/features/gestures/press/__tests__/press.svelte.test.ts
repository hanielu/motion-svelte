import { describe, it, expect } from "vitest";
import { render } from "vitest-browser-svelte";
import { Motion } from "@/components/motion/index.js";

describe("press Gesture", () => {
	it("adds tabindex=0 when whilePress is set", async () => {
		const screen = render(Motion, {
			props: {
				whilePress: { scale: 0.9 },
				"data-testid": "motion",
			},
		});
		const motion = screen.getByTestId("motion").element() as HTMLElement;
		expect(motion.tabIndex).toBe(0);
	});

	it("does not add tabindex when whilePress is not set", () => {
		const wrapper = render(Motion, {
			props: {
				"data-testid": "motion",
			},
		});

		expect((<HTMLElement>wrapper.getByTestId("motion").element()).tabIndex).toBe(-1);
	});
});
