import { playgroundUno } from "@motion-sv/uno";
import { defineConfig } from "unocss";

// Examples are styled against browser defaults; quillow-card imports its own reset.
export default defineConfig(playgroundUno({ reset: false }));
