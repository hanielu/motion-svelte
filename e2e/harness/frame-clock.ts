import type { Page } from "@playwright/test";

declare global {
	interface Window {
		__realFrame: (callback: FrameRequestCallback) => number;
	}
}

/** Playwright's fake requestAnimationFrame fires on a 16ms grid, so one step is exactly one frame. */
export const FRAME_MS = 16;

/**
 * Deterministic, frame-by-frame time for a page.
 *
 * Playwright's fake clock drives timers and requestAnimationFrame (motion's frameloop, Svelte's scheduler), but
 * not the Web Animations timeline that motion uses for accelerated values and Svelte uses for every `transition:`.
 * That timeline is frozen through CDP and driven from fake time instead (see `virtualizeAnimations`).
 */
export class FrameClock {
	/** Fake milliseconds elapsed since navigation. */
	now = 0;

	private constructor(private readonly page: Page) {}

	/** Must be called before the first navigation. */
	static async install(page: Page): Promise<FrameClock> {
		// Keep the network local: remote images become same-size placeholders, everything else remote is blocked.
		await page.route(/^https?:\/\/(?!localhost[:/])/, (route) =>
			route.request().resourceType() === "image"
				? route.fulfill({ contentType: "image/svg+xml", body: placeholderImage(route.request().url()) })
				: route.abort()
		);
		await page.addInitScript(prepareRealm);
		const cdp = await page.context().newCDPSession(page);
		await cdp.send("Animation.enable");
		await cdp.send("Animation.setPlaybackRate", { playbackRate: 0 });
		// pauseAt installs the clock by itself. A separate install() call is replayed in the page with the real
		// milliseconds between the two calls as elapsed fake time, which shifts the 16ms frame grid at random.
		await page.clock.pauseAt(0);
		await page.addInitScript(virtualizeAnimations);
		return new FrameClock(page);
	}

	/** Advances one frame, then lets the real renderer catch up (layout, observers) before the next one. */
	async step() {
		await this.page.clock.runFor(FRAME_MS);
		this.now += FRAME_MS;
		await this.flush();
	}

	async advance(ms: number) {
		for (let i = 0; i < Math.round(ms / FRAME_MS); i++) await this.step();
	}

	/** Steps until `condition` holds, e.g. until the app has mounted. */
	async until(condition: () => Promise<boolean>, maxFrames = 600) {
		for (let i = 0; !(await condition()); i++) {
			if (i === maxFrames) throw new Error(`FrameClock.until: condition not met after ${maxFrames} frames`);
			await this.step();
		}
	}

	/**
	 * Lets real-time work settle without advancing fake time: images finish loading (so they never resize at a random
	 * frame), then two real frames pass so input Chrome aligns to frames (pointer moves) and observer callbacks land.
	 */
	async flush() {
		const settled = () =>
			this.page.evaluate(() =>
				[...document.images].every((image) => image.complete)
					? new Promise<boolean>((resolve) => window.__realFrame(() => window.__realFrame(() => resolve(true))))
					: false
			);
		while (!(await settled())) await new Promise((resolve) => setTimeout(resolve, 10));
	}
}

/** An image with the size remote image URLs usually encode (`.../800/600`), 800x600 otherwise. */
function placeholderImage(url: string) {
	const [, width = 800, height = 600] = url.match(/\/(\d+)\/(\d+)(?:[/?#]|$)/) ?? [];
	return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><rect width="100%" height="100%" fill="#888"/></svg>`;
}

/** Runs before the fake clock is installed. */
function prepareRealm() {
	Object.defineProperty(window, "__realFrame", { value: window.requestAnimationFrame.bind(window) });

	// Seeded PRNG (mulberry32) so examples that shuffle stay reproducible.
	let seed = 0x6d2b79f5;
	Math.random = () => {
		seed = (seed + 0x6d2b79f5) | 0;
		let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

/** Runs after the fake clock is installed, so `requestAnimationFrame` and `performance.now` are fake. */
function virtualizeAnimations() {
	// motion syncs WAAPI start times to its frameloop clock (fake performance.now), while the document timeline is
	// frozen at 0. Translate between the two.
	const startTime = Object.getOwnPropertyDescriptor(Animation.prototype, "startTime")!;
	Object.defineProperty(Animation.prototype, "startTime", {
		configurable: true,
		get() {
			const value = startTime.get!.call(this);
			return value === null ? null : value - Number(document.timeline.currentTime) + performance.now();
		},
		set(value: number | null) {
			startTime.set!.call(
				this,
				value === null ? null : value - performance.now() + Number(document.timeline.currentTime)
			);
		},
	});

	// Native finish events are dispatched on real frames. Own the handler so it fires on the fake frame instead.
	type Virtual = Animation & { __onfinish: Animation["onfinish"]; __finished: boolean };
	Object.defineProperty(Animation.prototype, "onfinish", {
		configurable: true,
		get(this: Virtual) {
			return this.__onfinish ?? null;
		},
		set(this: Virtual, handler: Animation["onfinish"]) {
			this.__onfinish = handler;
			this.__finished = false;
		},
	});

	let last = performance.now();
	const tick = () => {
		const now = performance.now();
		const elapsed = now - last;
		last = now;
		for (const animation of document.getAnimations() as Virtual[]) {
			if (animation.timeline !== document.timeline) continue;
			if (animation.playState === "running") {
				animation.__finished = false;
				animation.currentTime = (Number(animation.currentTime) || 0) + elapsed * animation.playbackRate;
			}
			// Zero-length animations (Svelte starts every transition with one) can already be finished when first
			// seen, depending on whether a real frame happened first. Fire their handler exactly once either way.
			if (animation.playState === "finished" && animation.__onfinish && !animation.__finished) {
				animation.__finished = true;
				animation.__onfinish.call(
					animation,
					new AnimationPlaybackEvent("finish", { currentTime: animation.currentTime })
				);
			}
		}
		requestAnimationFrame(tick);
	};
	requestAnimationFrame(tick);
}
