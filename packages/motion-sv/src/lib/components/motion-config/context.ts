import type { MotionConfigState } from "./types.js";
import { createOptionalContext } from "#lib/utils/optional-context.js";

/**
 * Default motion configuration
 */
export const defaultConfig: MotionConfigState = {
	reducedMotion: "never",
	transition: undefined,
	nonce: undefined,
};

export const [getMotionConfig, setMotionConfig] = createOptionalContext<() => MotionConfigState>();

/** A getter for the closest MotionConfig's configuration, or the default one. */
export function useMotionConfig() {
	return getMotionConfig() ?? (() => defaultConfig);
}
