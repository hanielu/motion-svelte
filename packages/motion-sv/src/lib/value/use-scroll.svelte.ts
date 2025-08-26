import type { ScrollInfoOptions } from "@/types/index.js";
import { motionValue, scroll } from "framer-motion/dom";

export interface UseScrollOptions extends Omit<ScrollInfoOptions, "container" | "target"> {
	container?: HTMLElement | null;
	target?: HTMLElement | null;
}

function createScrollMotionValues() {
	return {
		scrollX: motionValue(0),
		scrollY: motionValue(0),
		scrollXProgress: motionValue(0),
		scrollYProgress: motionValue(0),
	};
}

export function useScroll(scrollOptions: UseScrollOptions = {}) {
	const values = createScrollMotionValues();

	$effect(() => {
		return scroll(
			(_progress, { x, y }) => {
				values.scrollX.set(x.current);
				values.scrollXProgress.set(x.progress);
				values.scrollY.set(y.current);
				values.scrollYProgress.set(y.progress);
			},
			{
				offset: scrollOptions.offset,
				axis: scrollOptions.axis,
				container: scrollOptions.container,
				target: scrollOptions.target,
			}
		);
	});

	return values;
}
