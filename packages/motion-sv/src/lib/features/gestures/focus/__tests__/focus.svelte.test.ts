import { describe, it, expect } from "vitest";
import { render } from "vitest-browser-svelte";
import { html, delay } from "test-utils";
import { flushSync } from "svelte";

// svelte:defs
import { motionValue } from "framer-motion/dom";
import { motion } from "@/components/index.js";
import { useTransform } from "@/value/index.js";
// sd

describe("focus Gesture", () => {
	it("focus applied", async () => {
		const opacity = motionValue(1);
		const promise = new Promise(async (resolve) => {
			const { getByTestId } = render(
				html`
					<script>
						let { opacity } = $props()
					</script>
					<motion.a
						data-testid="myAnchorElement"
						href="#"
						whileFocus={{ opacity: 0.1 }}
						transition={{ duration: 0 }}
						style={{ opacity }}
					>
					</motion.a>
				`,
				{ props: { opacity } }
			);
			// flushSync();
			const element = getByTestId("myAnchorElement").element() as HTMLElement;
			element.matches = () => true;
			element.focus();
			await delay(7);
			resolve(opacity.get());
		});

		return expect(promise).resolves.toBe(0.1);
	});

	it("whileFocus not applied when :focus-visible is false", async () => {
		const promise = new Promise(async (resolve) => {
			const opacity = motionValue(1);
			const { getByTestId } = render(
				html`
					<script>
						let { opacity} = $props()
					</script>
					<motion.a
						data-testid="myAnchorElement"
						href="#"
						whileFocus={{ opacity: 0.1 }}
						transition={{ duration: 0 }}
						style={{ opacity }}
					>
					</motion.a>
				`,
				{ props: { opacity } }
			);
			// flushSync();
			const element = getByTestId("myAnchorElement").element() as HTMLElement;
			element.matches = () => false;
			element.focus();
			await delay(7);
			resolve(opacity.get());
		});

		return expect(promise).resolves.toBe(1);
	});

	it("focus applied if focus-visible selector throws unsupported", async () => {
		const promise = new Promise(async (resolve) => {
			const opacity = motionValue(1);
			const { getByTestId } = render(
				html`
					<script>
						let { opacity } = $props()
					</script>
					<motion.a
						data-testid="myAnchorElement"
						href="#"
						whileFocus={{ opacity: 0.1 }}
						transition={{ duration: 0 }}
						style={{ opacity }}
					>
					</motion.a>
				`,
				{ props: { opacity } }
			);
			flushSync();
			const element = getByTestId("myAnchorElement").element() as HTMLElement;
			element.matches = () => {
				/**
				 * Explicitly throw as while Jest throws we want to ensure this
				 * behaviour isn't silently fixed should it fix this in the future.
				 */
				throw new Error("this selector not supported");
			};
			element.focus();
			await delay(7);
			resolve(opacity.get());
		});

		return expect(promise).resolves.toBe(0.1);
	});

	it("whileFocus applied as variant", async () => {
		const target = 0.5;
		const opacity = motionValue(1);
		const promise = new Promise(async (resolve) => {
			const { getByTestId } = render(
				html`
					<script>
						let { target, opacity } = $props()
						const variant = {
							hidden: { opacity: target },
						}
						let Aref;
					</script>
					<motion.a
						bind:ref={Aref}
						data-testid="myAnchorElement"
						href="#"
						whileFocus="hidden"
						variants={variant}
						transition={{ type: false }}
						style={{ opacity }}
					>
					</motion.a>
				`,
				{ props: { target, opacity } }
			);
			flushSync();
			const element = getByTestId("myAnchorElement").element() as HTMLElement;
			element.matches = () => true;
			element.focus();
			await delay(7);
			resolve(opacity.get());
		});

		return expect(promise).resolves.toBe(target);
	});
});
