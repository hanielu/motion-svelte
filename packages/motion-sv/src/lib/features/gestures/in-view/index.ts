import { Feature } from "#lib/features/feature.js";
import type { InViewOptions } from "./types.js";
import { frame } from "motion-dom";
import { inView } from "framer-motion/dom";

const OBSERVER_OPTIONS = ["amount", "margin", "root"] as const;

export class InViewGesture extends Feature {
	static key = "inView" as const;
	static enabledBy = ["whileInView", "onViewportEnter", "onViewportLeave"] as const;

	private removeObserver: VoidFunction | undefined;
	/** The options the observer was created with, to restart it when they change. */
	private observedOptions: InViewOptions | undefined;

	private isActive() {
		const { whileInView, onViewportEnter, onViewportLeave } = this.state.options;
		return Boolean(whileInView || onViewportEnter || onViewportLeave);
	}

	private startObserver() {
		const element = this.state.element;
		if (!element || !this.isActive()) return;

		this.removeObserver?.();
		const { once, ...viewOptions } = this.state.options.inViewOptions ?? {};
		this.observedOptions = viewOptions;
		this.removeObserver = inView(
			element,
			(_, entry) => {
				this.state.setActive("whileInView", true);
				const { onViewportEnter } = this.state.options;
				if (onViewportEnter) frame.postRender(() => onViewportEnter(entry));
				if (once) return;

				return () => {
					this.state.setActive("whileInView", false);
					const { onViewportLeave } = this.state.options;
					if (onViewportLeave) frame.postRender(() => onViewportLeave(entry));
				};
			},
			viewOptions
		);
	}

	mount() {
		this.startObserver();
	}

	update() {
		const options = this.state.options.inViewOptions;
		if (OBSERVER_OPTIONS.some((name) => options?.[name] !== this.observedOptions?.[name])) this.startObserver();
	}

	unmount() {
		this.removeObserver?.();
		this.removeObserver = undefined;
	}
}
