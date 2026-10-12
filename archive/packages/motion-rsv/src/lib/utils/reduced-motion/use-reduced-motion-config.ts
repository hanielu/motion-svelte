import { read } from "runed";
import { MotionConfigContext } from "../../context/motion-config-context.js";
import { useReducedMotion } from "./use-reduced-motion.js";

export function useReducedMotionConfig() {
	const reducedMotionPreference = useReducedMotion();

	return read(() => {
		const { reducedMotion } = MotionConfigContext.current;

		if (reducedMotion === "never") {
			return false;
		} else if (reducedMotion === "always") {
			return true;
		} else {
			return reducedMotionPreference;
		}
	});
}
