import { Feature } from "#lib/features/feature.js";
import { extractEventInfo } from "#lib/events/index.js";
import { frame, press } from "motion-dom";

export class PressGesture extends Feature {
	static key = "press" as const;
	static enabledBy = ["whilePress", "onPress", "onPressStart", "onPressCancel"] as const;

	private removePress: VoidFunction | undefined;

	private isActive() {
		const { whilePress, onPress, onPressCancel, onPressStart } = this.state.options;
		return Boolean(whilePress || onPress || onPressCancel || onPressStart);
	}

	private register() {
		const element = this.state.element;
		if (!element || !this.isActive()) return;

		this.removePress = press(
			element,
			(_el, startEvent) => {
				this.state.setActive("whilePress", true);
				const { onPressStart } = this.state.options;
				if (onPressStart) frame.postRender(() => onPressStart(startEvent, extractEventInfo(startEvent)));

				return (endEvent, { success }) => {
					this.state.setActive("whilePress", false);
					const { onPress, onPressCancel } = this.state.options;
					const callback = success ? onPress : onPressCancel;
					if (callback) frame.postRender(() => callback(endEvent, extractEventInfo(endEvent)));
				};
			},
			{ useGlobalTarget: this.state.options.globalPressTarget }
		);
	}

	mount() {
		this.register();
	}

	update() {
		if (!this.removePress) this.register();
	}

	unmount() {
		this.removePress?.();
		this.removePress = undefined;
	}
}
