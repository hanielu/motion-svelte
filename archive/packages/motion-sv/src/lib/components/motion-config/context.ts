import { Context } from "runed";
import type { MotionConfigState } from "./types.js";
import type { FnGetter } from "@/types/common.js";

/**
 * Default motion configuration
 */
export const defaultConfig: MotionConfigState = {
	reducedMotion: "never",
	transition: undefined,
	nonce: undefined,
};

/**
 * Context for sharing motion configuration with child components
 */
export const MotionConfigContext = new Context<FnGetter<MotionConfigState>>("MotionConfig");

export function useMotionConfig() {
	return MotionConfigContext.getOr(() => defaultConfig);
}
