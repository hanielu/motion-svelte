import { expect, test, type Locator } from "@playwright/test";
import { bbox, should, visit, wait } from "../../harness/upstream.js";

/**
 * Tests for the `path: arc()` transition modifier across both layout
 * animations (`transition.layout.path`) and keyframe animations
 * (`transition.path`).
 *
 * Layout-arc tests visit `?variant=freeze` (or `none`/`small`) which use
 * `ease: () => 0.5` to pin the layout animation at exactly 50% progress.
 * That lets us sample mid-arc position with `getBoundingClientRect()`
 * without fighting timing.
 *
 * The default `?test=transition-arc` URL auto-toggles with a real ease for
 * visual inspection — those URLs are not what these tests run against.
 */

const closeTo = (actual: number, expected: number, delta: number) =>
	expect(Math.abs(actual - expected)).toBeLessThanOrEqual(delta);

const computedTransform = (target: Locator) => target.evaluate((el) => window.getComputedStyle(el).transform);

test.describe("layout arc", () => {
	test("deviates from the straight-line path mid-animation", async ({ page }) => {
		const indicator = page.locator("#indicator");
		await visit(page, "?test=transition-arc&variant=freeze");
		await wait(page, 50);
		await should(async () => closeTo((await bbox(indicator)).top, 200, 10));
		await page.locator("#toggle").click();
		await wait(page, 100);
		// 400px horizontal, strength=1 → ~200px perpendicular at t=0.5
		await should(async () => {
			const { top } = await bbox(indicator);
			expect(Math.abs(top - 200)).toBeGreaterThan(80);
		});
	});

	test("stays on the straight-line path without arc config", async ({ page }) => {
		const indicator = page.locator("#indicator");
		await visit(page, "?test=transition-arc&variant=none");
		await wait(page, 50);
		await should(async () => closeTo((await bbox(indicator)).top, 200, 10));
		await page.locator("#toggle").click();
		await wait(page, 100);
		await should(async () => closeTo((await bbox(indicator)).top, 200, 20));
	});

	test("does not arc for movements below the 20px minimum distance", async ({ page }) => {
		const indicator = page.locator("#indicator");
		await visit(page, "?test=transition-arc&variant=small");
		await wait(page, 50);
		await should(async () => closeTo((await bbox(indicator)).top, 200, 10));
		await page.locator("#toggle").click();
		await wait(page, 100);
		await should(async () => closeTo((await bbox(indicator)).top, 200, 20));
	});
});

/**
 * Keyframe arc tests use `?freeze` to pin the animation at midpoint
 * (same trick as the layout tests). Click Toggle, wait for the layout
 * effect + animation start, then sample.
 */
test.describe("keyframe arc", () => {
	test("deflects y perpendicular while x interpolates", async ({ page }) => {
		const indicator = page.locator("#indicator");
		await visit(page, "?test=transition-arc&variant=keyframe&freeze");
		await wait(page, 50);
		await should(async () => {
			// Starts at top:200 with no x translation.
			const r = await bbox(indicator);
			closeTo(r.top, 200, 5);
			closeTo(r.left, 50, 5);
		});
		await page.locator("#toggle").click();
		await wait(page, 100);
		await should(async () => {
			// 400px horizontal, strength=1 → ~200px perpendicular at t=0.5.
			// Because the chord is horizontal and dx>0, auto-direction
			// bulges +y (downward in screen space).
			const r = await bbox(indicator);
			// x is roughly midway
			closeTo(r.left, 50 + 200, 25);
			// y has deflected ~200px from baseline
			expect(Math.abs(r.top - 200)).toBeGreaterThan(150);
		});
	});

	test("rotate option rotates the element along the curve", async ({ page }) => {
		// freezeAt=0.25: at t=0.25 the bezier tangent has clearly diverged
		// from the baseline tangent so rotation is non-zero. (At t=0.5 it
		// crosses zero by symmetry — see KeyframeArc comments.)
		await visit(page, "?test=transition-arc&variant=oriented&freezeAt=0.25");
		await wait(page, 50);
		await page.locator("#toggle").click();
		await wait(page, 100);
		await should(async () => {
			const t = await computedTransform(page.locator("#indicator"));
			// expected a transform matrix
			expect(t).toMatch(/matrix/);
			const m = t.match(/matrix\(([^)]+)\)/);
			if (!m) throw new Error(`unexpected transform: ${t}`);
			// matrix(a, b, c, d, tx, ty). For a pure translate, a=1, b=0.
			// For rotation, |b| > 0 and a < 1.
			const [a, b] = m[1].split(",").map((v) => parseFloat(v));
			// y-shear of matrix is non-zero (rotated)
			expect(Math.abs(b)).toBeGreaterThan(0.05);
			// x-scale is less than 1 (rotated)
			expect(a).toBeLessThan(1);
		});
	});

	test("no rotate option leaves rotation untouched", async ({ page }) => {
		await visit(page, "?test=transition-arc&variant=keyframe&freeze");
		await wait(page, 50);
		await page.locator("#toggle").click();
		await wait(page, 100);
		await should(async () => {
			const t = await computedTransform(page.locator("#indicator"));
			const m = t.match(/matrix\(([^)]+)\)/);
			if (!m) return;
			const [a, b] = m[1].split(",").map((v) => parseFloat(v));
			// Pure translate: a=1, b=0. Allow tiny float fuzz.
			closeTo(a, 1, 0.01);
			expect(Math.abs(b)).toBeLessThan(0.01);
		});
	});
});

/**
 * An oriented arc running concurrently with a user `rotate` animation.
 * `pathRotation` is composed onto the user's `rotate` at the build site,
 * so the user's value must never be read or clobbered.
 *
 * Frozen at t=0.5: pathRotation ~0 by symmetry, x ~mid, and `rotate`
 * (0 → 90, eased 0.5) ~45deg. The old clobbering behaviour would leave
 * rotation at ~0deg instead.
 */
test.describe("arc composes with concurrent rotate", () => {
	test("does not clobber a user rotate animation", async ({ page }) => {
		await visit(page, "?test=transition-arc&variant=rotate-compose");
		await wait(page, 50);
		await page.locator("#toggle").click();
		await wait(page, 100);
		await should(async () => {
			const t = await computedTransform(page.locator("#indicator"));
			const m = t.match(/matrix\(([^)]+)\)/);
			if (!m) throw new Error(`expected a matrix, got: ${t}`);
			const [a, b, , , tx] = m[1].split(",").map((v) => parseFloat(v));
			// x interpolated to ~mid (0 → 400, eased 0.5).
			closeTo(tx, 200, 40);
			// Decompose rotation from matrix(a,b,...). Should be ~45deg
			// from the user's rotate; clobbering would give ~0deg.
			const angle = (Math.atan2(b, a) * 180) / Math.PI;
			// user rotate (45deg) survived alongside the arc
			closeTo(angle, 45, 12);
		});
	});
});
