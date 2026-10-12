import presetAnimations from "unocss-preset-animations";
import {
  defineConfig,
  presetIcons,
  presetTypography,
  presetWebFonts,
  presetWind4,
  transformerDirectives,
  transformerVariantGroup,
} from "unocss";
import { font } from "@unocss/preset-wind4/theme";
import shadcnPreset from "./presets/shadcn-preset";
import customPreset from "./presets/custom-preset";

export default defineConfig({
  content: {
    filesystem: ["./node_modules/bits-ui/dist/**/*.{html,js,svelte,ts}"],
    pipeline: {
      include: [/\.(vue|svelte|[jt]sx|mdx?|astro|elm|php|phtml|html|ts)($|\?)/],
    },
  },
  theme: {
    font: {
      "inter-sans": `Inter, ${font.sans}`,
    },
  },
  shortcuts: [{}],
  configDeps: ["./presets/custom-preset.ts", "./presets/shadcn-preset.ts"],
  presets: [
    customPreset(),
    presetWind4(),
    shadcnPreset,
    presetIcons({ scale: 1.2 }),
    presetWebFonts({
      fonts: {
        geist: "Geist:400;500;600;700;800",
        "geist-mono": "Geist Mono:400;500;600;700;800",
        // inter: "Inter:300;400;500;600;700;800",
      },
    }),
    presetTypography(),
    presetAnimations(),
  ],
  transformers: [transformerDirectives(), transformerVariantGroup()],
});
