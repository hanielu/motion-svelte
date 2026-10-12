import { Feature } from "#lib/features/feature.js";
import { extractEventInfo } from "#lib/events/index.js";
import { frame, hover } from "motion-dom";

export class HoverGesture extends Feature {
	static key = "hover" as const;
	static enabledBy = ["whileHover", "onHoverStart", "onHoverEnd"] as const;

	private removeHover: VoidFunction | undefined;

	private isActive() {
		const { whileHover, onHoverStart, onHoverEnd } = this.state.options;
		return Boolean(whileHover || onHoverStart || onHoverEnd);
	}

	private register() {
		const element = this.state.element;
		if (!element || !this.isActive()) return;

		this.removeHover = hover(element, (_el, startEvent) => {
			this.state.setActive("whileHover", true);
			const { onHoverStart } = this.state.options;
			if (onHoverStart) frame.postRender(() => onHoverStart(startEvent, extractEventInfo(startEvent)));

			return (endEvent) => {
				this.state.setActive("whileHover", false);
				const { onHoverEnd } = this.state.options;
				if (onHoverEnd) frame.postRender(() => onHoverEnd(endEvent, extractEventInfo(endEvent)));
			};
		});
	}

	mount() {
		this.register();
	}

	update() {
		if (!this.removeHover) this.register();
	}

	unmount() {
		this.removeHover?.();
		this.removeHover = undefined;
	}
}
