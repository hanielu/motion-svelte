import { animations } from "../../../motion/features/animations.js";
import { drag } from "../../../motion/features/drag.js";
import { gestureAnimations } from "../../../motion/features/gestures.js";
import { layout } from "../../../motion/features/layout.js";

// TODO: (haniel) there's type errors in some of the imports, fix them
// or check if they actualy have any bearing on if this works
export const featureBundle = {
	...animations,
	...gestureAnimations,
	...drag,
	...layout,
};
