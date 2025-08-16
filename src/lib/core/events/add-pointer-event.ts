import { addDomEvent } from "./add-dom-event.js";
import { addPointerInfo, type EventListenerWithPointInfo } from "./event-info.js";

export function addPointerEvent(
  target: EventTarget,
  eventName: string,
  handler: EventListenerWithPointInfo,
  options?: AddEventListenerOptions
) {
  return addDomEvent(target, eventName, addPointerInfo(handler), options);
}
