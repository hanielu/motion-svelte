import { test, type Locator, type Page } from "@playwright/test";
import { FrameClock } from "./frame-clock.js";
import { TraceRecorder, expectTrace } from "./trace.js";

export interface ScenarioContext {
	page: Page;
	/** The element whose subtree is recorded. */
	root: Locator;
	clock: FrameClock;
	/** Advances `frames` frames, recording every `every`th one. */
	play(frames: number, options?: { every?: number }): Promise<void>;
	/** Presses the mouse on `target`'s center, drags it by (dx, dy) over `frames` recorded frames and releases. */
	drag(target: Locator, dx: number, dy: number, frames?: number): Promise<void>;
}

interface ScenarioOptions {
	/** Defaults to `/example/<name>`. */
	path?: string;
	/** Defaults to the playground's example container. */
	root?: string;
}

/**
 * Records a playground example frame by frame while `run` interacts with it, then compares the recording with the
 * committed baseline. Interactions happen while time is paused, so only `play` and `drag` move time forward.
 */
export function scenario(name: string, run: (ctx: ScenarioContext) => Promise<void>, options: ScenarioOptions = {}) {
	test(name, async ({ page }, testInfo) => {
		const errors: Error[] = [];
		page.on("pageerror", (error) => errors.push(error));

		const clock = await FrameClock.install(page);
		await page.goto(options.path ?? `/example/${name}`);
		// On a cold dev server, Vite reloads the page once it has optimized newly discovered dependencies.
		await page.waitForLoadState("networkidle");
		const rootSelector = options.root ?? "[data-example-root]";
		const root = page.locator(rootSelector);
		await clock.until(() => root.isVisible());
		// Lazily imported modules (e.g. LazyMotion features) resolve on real time; let them land before recording.
		await page.waitForLoadState("networkidle");

		const recorder = new TraceRecorder(page, rootSelector);
		const play: ScenarioContext["play"] = async (frames, { every = 1 } = {}) => {
			await clock.flush();
			for (let frame = 1; frame <= frames; frame++) {
				await clock.step();
				if (frame % every === 0) await recorder.record(clock.now);
			}
		};
		const drag: ScenarioContext["drag"] = async (target, dx, dy, frames = 20) => {
			const box = (await target.boundingBox())!;
			const x = box.x + box.width / 2;
			const y = box.y + box.height / 2;
			await page.mouse.move(x, y);
			await page.mouse.down();
			for (let frame = 1; frame <= frames; frame++) {
				await page.mouse.move(x + (dx * frame) / frames, y + (dy * frame) / frames);
				await play(1);
			}
			await page.mouse.up();
		};

		await run({ page, root, clock, play, drag });

		if (errors.length) throw errors[0];
		await expectTrace(recorder.trace(), name, testInfo);
	});
}
