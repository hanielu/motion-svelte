import { Feature } from "#lib/features/feature.js";
import type { IProjectionNode } from "motion-dom";
import { HTMLProjectionNode, addScaleCorrector } from "motion-dom";
import { getClosestProjectingNode } from "#lib/features/layout/utils.js";
import { defaultScaleCorrector } from "#lib/features/layout/config.js";
import { isHTMLElement } from "#lib/features/gestures/drag/utils/is.js";
import { isSSR } from "#lib/utils/is.js";

export class ProjectionFeature extends Feature {
	static key = "projection" as const;
	private projection: IProjectionNode | undefined;

	constructor(state) {
		super(state);
		addScaleCorrector(defaultScaleCorrector);
		if (!isSSR) {
			this.initProjection();
		}
	}

	initProjection() {
		const options = this.state.options;
		this.state.visualElement.projection = new HTMLProjectionNode(
			this.state.visualElement.latestValues,
			options["data-framer-portal-id"] ? undefined : getClosestProjectingNode(this.state.visualElement.parent)
		);
		this.projection = this.state.visualElement.projection;
		this.projection.isPresent = true;
		this.setOptions();
	}

	setOptions() {
		const options = this.state.options;
		const { layoutId, layout, drag = false, dragConstraints = false } = options;
		const shouldDisableInitialCrossfade = this.shouldDisableInitialCrossfade(layoutId);
		this.projection?.setOptions({
			layout,
			layoutId,
			alwaysMeasureLayout: Boolean(layoutId) || Boolean(drag) || (dragConstraints && isHTMLElement(dragConstraints)),
			visualElement: this.state.visualElement,
			animationType: typeof options.layout === "string" ? options.layout : "both",
			// initialPromotionConfig
			layoutRoot: options.layoutRoot,
			layoutScroll: options.layoutScroll,
			crossfade: options.crossfade ?? (shouldDisableInitialCrossfade ? false : undefined),
			onExitComplete: () => {
				if (!this.projection?.isPresent && this.state.options.layoutId && !this.state.isExiting) {
					// Defer to avoid re-entrant microtask.read() during projection update().
					// notifyLayoutUpdate can call this synchronously while the microtask batcher
					// is processing; a direct root.didUpdate() call here would be permanently lost
					// because the microtask batcher's allowKeepAlive=false skips follow-up batches.
					queueMicrotask(() => {
						this.state.options.presenceContext?.onMotionExitComplete?.(this.state.presenceContainer, this.state);
					});
				}
			},
		});
	}

	private shouldDisableInitialCrossfade(layoutId?: string) {
		if (!layoutId || this.state.options.crossfade !== undefined) {
			return false;
		}

		// Svelte can replace a layoutId node after the previous lead has already left the DOM.
		const lead = this.projection?.root?.sharedNodes.get(layoutId)?.lead;
		return Boolean(lead && (lead.isPresent === false || (lead.instance as Element | undefined)?.isConnected === false));
	}

	update() {
		this.setOptions();
	}

	mount() {
		this.projection?.mount(this.state.element);
	}
}
