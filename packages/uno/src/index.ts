import { presetIcons, presetWind4, transformerDirectives, transformerVariantGroup, type UserConfig } from "unocss";
import { customPreset } from "./custom-preset.js";

export { customPreset } from "./custom-preset.js";
export { shadcnPreset } from "./shadcn-preset.js";

interface PlaygroundUnoOptions {
	/** Apply preset-wind4's CSS reset preflight. */
	reset?: boolean;
}

/** The UnoCSS setup every playground shares. Add app-specific config on top with `mergeConfigs`. */
export function playgroundUno({ reset = true }: PlaygroundUnoOptions = {}): UserConfig {
	return {
		content: {
			pipeline: {
				include: [/\.(vue|svelte|[jt]sx|mdx?|astro|elm|php|phtml|html|ts)($|\?)/],
			},
		},
		presets: [customPreset(), presetWind4({ preflights: { reset } }), presetIcons({ scale: 1.2 })],
		transformers: [transformerDirectives(), transformerVariantGroup()],
	};
}
