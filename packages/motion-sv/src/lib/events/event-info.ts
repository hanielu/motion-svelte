import { isPrimaryPointer, type EventInfo } from "motion-dom";

export type EventListenerWithPointInfo = (e: PointerEvent, info: EventInfo) => void;

export function extractEventInfo(event: PointerEvent): EventInfo {
	return {
		point: {
			x: event.pageX,
			y: event.pageY,
		},
	};
}

export const addPointerInfo =
	(handler: EventListenerWithPointInfo): EventListener =>
	(event) => {
		const pointerEvent = event as PointerEvent;
		if (isPrimaryPointer(pointerEvent)) handler(pointerEvent, extractEventInfo(pointerEvent));
	};
