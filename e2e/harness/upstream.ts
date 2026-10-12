/**
 * Cypress semantics for specs ported from motion's packages/framer-motion/cypress/integration, so ports stay
 * line-for-line comparable with the originals.
 */
import { expect, type Locator, type Page } from "@playwright/test";

export interface BoundingBox {
	top: number;
	left: number;
	width: number;
	height: number;
}

/** `cy.visit("?test=<fixture>&...")`: loads `src/fixtures/<fixture>.svelte` and waits for it to mount. */
export async function visit(page: Page, query: string) {
	await page.goto(`/${query}`);
	await page.locator("html[data-fixture=mounted]").waitFor({ state: "attached" });
}

/** `.wait(ms)` */
export function wait(page: Page, ms: number) {
	return page.waitForTimeout(ms);
}

/**
 * `.should(callback)`: Cypress re-runs the callback every frame until it passes or 4s elapse, so assertions can
 * catch transient values. Use for every `.should`; `.then` callbacks run once and translate to plain assertions.
 */
export function should(callback: () => Promise<void>) {
	return expect(callback).toPass({ timeout: 4000, intervals: [16] });
}

/**
 * `.trigger(type, x?, y?, options?)`: dispatches a synthetic event on the element itself, at (x, y) from its
 * top-left corner (its center by default), without scrolling or actionability checks. `init` adds event properties.
 */
export async function trigger(target: Locator, type: string, x?: number, y?: number, init: Record<string, unknown> = {}) {
	await target.first().evaluate(
		(el, { type, x, y, init }) => {
			const rect = el.getBoundingClientRect();
			const clientX = rect.left + (x ?? rect.width / 2);
			const clientY = rect.top + (y ?? rect.height / 2);
			const options = {
				bubbles: true,
				cancelable: true,
				composed: true,
				view: window,
				clientX,
				clientY,
				screenX: clientX,
				screenY: clientY,
				button: 0,
				...init,
			};
			const event = type.startsWith("pointer")
				? new PointerEvent(type, { pointerId: 1, pointerType: "mouse", isPrimary: true, ...options })
				: /^(click|dblclick|contextmenu|mouse)/.test(type)
					? new MouseEvent(type, options)
					: new Event(type, options);
			el.dispatchEvent(event);
		},
		{ type, x, y, init }
	);
}

/**
 * What Cypress does before a `.trigger`/`.click` WITHOUT `{ force: true }`: scroll the element to the top of its
 * scroll container. Upstream's expected geometry depends on it in scrollable fixtures; call it before `trigger`.
 */
export function scrollToTop(target: Locator) {
	return target.first().evaluate((el) => el.scrollIntoView({ block: "start" }));
}

/** `.trigger(...)` without `{ force: true }`: scrolls the element to the top like Cypress, then triggers. */
export async function triggerInView(
	target: Locator,
	type: string,
	x?: number,
	y?: number,
	init: Record<string, unknown> = {}
) {
	await scrollToTop(target);
	await trigger(target, type, x, y, init);
}

/** `getBoundingClientRect()` of the first matching element. */
export function bbox(target: Locator): Promise<BoundingBox> {
	return target.first().evaluate((el) => {
		const { top, left, width, height } = el.getBoundingClientRect();
		return { top, left, width, height };
	});
}

/** Upstream's `expectBbox`: exact equality, retried like `.should`. */
export function expectBbox(target: Locator, expected: BoundingBox) {
	return should(async () => expect(await bbox(target)).toEqual(expected));
}
