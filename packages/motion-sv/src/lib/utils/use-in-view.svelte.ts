import type { InViewOptions } from "#lib/features/gestures/in-view/types.js";
import { inView } from "framer-motion/dom";
import { untrack } from "svelte";

export interface UseInViewOptions extends Omit<InViewOptions, "useClipPathWorkaround"> {
	/** Stop observing once the element has entered the viewport. */
	once?: boolean;
	/** Whether the element counts as in view before it's first observed. */
	initial?: boolean;
}

class InView {
	#isInView: boolean;

	constructor(element: () => Element | null | undefined, options: () => UseInViewOptions) {
		// `initial` only matters before the first observation
		this.#isInView = $state(options().initial ?? false);

		$effect(() => {
			const target = element();
			const { root, margin, amount, once } = options();
			// Untracked: entering and leaving don't need a new observer, only `once` stops observing after the first entry
			if (!target || (once && untrack(() => this.#isInView))) return;

			return inView(
				target,
				() => {
					this.#isInView = true;
					if (once) return;
					return () => {
						this.#isInView = false;
					};
				},
				{ root, margin, amount }
			);
		});
	}

	get current() {
		return this.#isInView;
	}
}

/** Whether the element is in the viewport. `element` and `options` are getters, so they can change. */
export const useInView = (element: () => Element | null | undefined, options: () => UseInViewOptions = () => ({})) =>
	new InView(element, options);
