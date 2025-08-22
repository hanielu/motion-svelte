import { type EventListenerWithPointInfo, addDomEvent, addPointerInfo } from '@/events/index.js';

export function addPointerEvent(
	target: EventTarget,
	eventName: string,
	handler: EventListenerWithPointInfo,
	options?: AddEventListenerOptions
) {
	return addDomEvent(target, eventName, addPointerInfo(handler), options);
}
