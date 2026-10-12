/**
 * Global configuration for motion-sv.
 *
 * @example
 * ```ts
 * import { motionGlobalConfig } from "motion-sv";
 * motionGlobalConfig.motionAttribute = "data-msv";
 * ```
 */
export const motionGlobalConfig = {
	/**
	 * The data attribute used to identify motion elements in the DOM.
	 * Used for AnimatePresence exit detection and VE parent hierarchy resolution.
	 */
	motionAttribute: "data-ap",
};
