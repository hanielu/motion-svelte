import { describe, it, expect } from "vitest";
import { render } from "vitest-browser-svelte";
import { html, delay } from "#lib/shared/test-utils.js";

// svelte:defs
import { Motion } from "#lib/components/motion/index.js";
import { useTransform } from "#lib/value/index.js";
// sd

describe("useTransform", () => {
	it("should update when reactive value changes", async () => {
		const Component = html`
		<script>
			let x = $state(0);
			const transform = useTransform(() => x)
			$effect(() => {
				x = 100;
			})
		</script>
		
		<Motion style={{ x: transform }} />
		`;
		const { container } = render(Component);
		await delay(100);
		expect(container.innerHTML).toContain("100");
	});
});
