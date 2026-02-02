import type { Options } from "@/types/state.js";
import { inView } from "framer-motion/dom";

type InViewOptions = Options["inViewOptions"];

export interface UseInViewOptions extends Omit<InViewOptions, "root"> {
	root?: HTMLElement | Document;
}

class UseInView {
	isInView = $state(false);

	constructor(node: () => HTMLElement, options: () => UseInViewOptions) {
		$effect(() => {
			const realOptions = options();
			const { once } = realOptions;
			const el = node();

			if (!el || (once && this.isInView)) {
				return;
			}

			const onEnter = () => {
				this.isInView = true;
				return once
					? undefined
					: () => {
							this.isInView = false;
						};
			};

			const cleanup = inView(el, onEnter, {
				...realOptions,
				root: realOptions.root,
			});

			return () => cleanup();
		});
	}
}

export const useInView = (node: () => HTMLElement, options: () => UseInViewOptions) => new UseInView(node, options);
