import { featureDefinitions } from "./definitions.js";
import type { FeaturePackages } from "./types.js";

export function loadFeatures(features: FeaturePackages) {
	for (const key in features) {
		featureDefinitions[key as keyof typeof featureDefinitions] = {
			...featureDefinitions[key as keyof typeof featureDefinitions],
			...features[key as keyof typeof features],
		} as any;
	}
}
