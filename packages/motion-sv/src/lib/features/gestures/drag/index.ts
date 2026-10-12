import { Feature } from "#lib/features/feature.js";
import { VisualElementDragControls } from "#lib/features/gestures/drag/VisualElementDragControls.js";
import type { MotionState } from "#lib/state/motion-state.js";

export class DragGesture extends Feature {
	static key = "drag" as const;
	static enabledBy = ["drag", "dragControls"] as const;

	controls: VisualElementDragControls;

	removeGroupControls?: VoidFunction;
	removeListeners?: VoidFunction;

	constructor(state: MotionState) {
		super(state);
		this.controls = new VisualElementDragControls(state);
	}

	mount() {
		// If we've been provided a DragControls for manual control over the drag gesture,
		// subscribe this component to it on mount.
		const { dragControls } = this.state.options;

		if (dragControls) {
			this.removeGroupControls = dragControls.subscribe(this.controls);
		}
		this.removeListeners = this.controls.addListeners();
	}

	update() {
		const { dragControls } = this.state.visualElement.getProps();
		const { dragControls: prevDragControls } = this.state.visualElement.prevProps || {};

		if (dragControls !== prevDragControls) {
			this.removeGroupControls?.();
			if (dragControls) {
				this.removeGroupControls = dragControls.subscribe(this.controls);
			}
		}
	}

	unmount() {
		this.removeGroupControls?.();
		this.removeListeners?.();
		/**
		 * A keyed list reorder can unmount and remount an item mid-drag. Keep the
		 * pan session alive then; its window listeners end it on pointerup.
		 */
		if (!this.controls.isDragging) {
			this.controls.endPanSession();
		}
	}
}
