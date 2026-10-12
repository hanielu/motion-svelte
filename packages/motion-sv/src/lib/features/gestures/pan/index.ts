import { frame, type PanInfo } from "motion-dom";
import { PanSession } from "./PanSession.js";
import { addPointerEvent } from "#lib/events/index.js";
import { Feature } from "#lib/features/feature.js";
import { getContextWindow } from "#lib/utils/get-context-window.js";

type PanEventHandler = (event: PointerEvent, info: PanInfo) => void;
const asyncHandler = (handler?: PanEventHandler) => (event: PointerEvent, info: PanInfo) => {
	if (handler) {
		frame.update(() => handler(event, info), false, true);
	}
};

export class PanGesture extends Feature {
	static key = "pan" as const;
	static enabledBy = ["onPan", "onPanStart", "onPanSessionStart", "onPanEnd"] as const;

	private session?: PanSession;

	private removePointerDownListener?: VoidFunction;

	onPointerDown(pointerDownEvent: PointerEvent) {
		this.session = new PanSession(pointerDownEvent, this.createPanHandlers(), {
			transformPagePoint: this.state.visualElement.getTransformPagePoint(),
			contextWindow: getContextWindow(this.state.visualElement),
		});
	}

	createPanHandlers() {
		const { onPanSessionStart, onPanStart, onPan, onPanEnd } = this.state.options;

		return {
			onSessionStart: asyncHandler(onPanSessionStart),
			onStart: asyncHandler(onPanStart),
			onMove: asyncHandler(onPan),
			onEnd: (event: PointerEvent, info: PanInfo) => {
				delete this.session;
				if (onPanEnd) {
					frame.postRender(() => onPanEnd(event, info));
				}
			},
		};
	}

	mount() {
		this.removePointerDownListener = addPointerEvent(this.state.element!, "pointerdown", (event: PointerEvent) =>
			this.onPointerDown(event)
		);
	}

	update() {
		this.session && this.session.updateHandlers(this.createPanHandlers());
	}

	unmount() {
		this.removePointerDownListener?.();
		this.session && this.session.end();
	}
}
