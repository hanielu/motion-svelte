import { AnimationFeature } from "./animation/index.js";
import { ExitAnimationFeature } from "./animation/exit.js";
import type { FeaturePackages } from "./types.js";

export const animations: FeaturePackages = {
	animation: {
		Feature: AnimationFeature,
	},
	exit: {
		Feature: ExitAnimationFeature,
	},
};
