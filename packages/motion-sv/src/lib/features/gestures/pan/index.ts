import { frame, type PanInfo } from "motion-dom";
import { noop } from "motion-utils";
import { PanSession } from "./PanSession.js";
import { addPointerEvent } from "#lib/events/index.js";
import { Feature } from "#lib/features/feature.js";
import { getContextWindow } from "#lib/utils/index.js";

type PanEventHandler = (event: PointerEvent, info: PanInfo) => void;
const asyncHandler = (handler?: PanEventHandler) => (event: PointerEvent, info: PanInfo) => {
	if (handler) {
		frame.update(() => handler(event, info), false, true);
	}
};

export class PanGesture extends Feature {
	static key = "pan" as const;

	private session?: PanSession;

	private removePointerDownListener: Function = noop;

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
		this.removePointerDownListener();
		this.session && this.session.end();
	}
}
