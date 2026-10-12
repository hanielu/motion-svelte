import { playgroundUno, shadcnPreset } from "@motion-sv/uno";
import { font } from "@unocss/preset-wind4/theme";
import { defineConfig, mergeConfigs, presetTypography, presetWebFonts } from "unocss";
import presetAnimations from "unocss-preset-animations";

export default defineConfig(
	mergeConfigs([
		playgroundUno(),
		{
			content: {
				filesystem: ["./node_modules/bits-ui/dist/**/*.{html,js,svelte,ts}"],
			},
			theme: {
				font: {
					"inter-sans": `Inter, ${font.sans}`,
				},
			},
			presets: [
				shadcnPreset(),
				presetWebFonts({
					fonts: {
						geist: "Geist:400;500;600;700;800",
						"geist-mono": "Geist Mono:400;500;600;700;800",
					},
				}),
				presetTypography(),
				presetAnimations(),
			],
		},
	])
);
