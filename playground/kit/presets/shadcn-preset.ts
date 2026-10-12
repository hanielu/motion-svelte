import { definePreset } from "unocss";
import { h, cornerMap, themeTracking } from "@unocss/preset-wind4/utils";

// this is needed, because unlike tailwind, unocss literally creates
// the css variables for each radius value in the theme object
// meaning during usage, `rounded-md` becomes `border-radius: var(--radius-md);`
// as opposed to `rounded-md` becoming `border-radius: calc(var(--radius) - 2px);`
// and this is bad because say we want to use `rounded-md` in a component,
// and we want to override the radius, even if we do `[--radius: 0.5rem;]`,
// it will still be the original value `border-radius: var(--radius-md);`
// because the css variable is already defined
function handlerRounded([, a = "", s = "DEFAULT"], { theme }) {
  if (a in cornerMap) {
    if (s === "full")
      return cornerMap[a].map((i) => [
        `border${i}-radius`,
        "calc(infinity * 1px)",
      ]);

    const _v = theme.radius?.[s] ?? h.bracket.cssvar.global.fraction.rem(s);
    if (_v != null) {
      const isVar = theme.radius && s in theme.radius;
      if (isVar) {
        // console.log("isVar", isVar, s);
        themeTracking(`radius`, s);
      }

      return cornerMap[a].map((i) => [
        `border${i}-radius`,
        isVar ? theme.radius[s] : _v,
      ]);
    }
  }
}

export default definePreset(() => ({
  name: "shadcn",

  rules: [
    // radius
    [
      /^(?:border-|b-)?(?:rounded|rd)()(?:-(.+))?$/,
      handlerRounded,
      {
        autocomplete: [
          "(border|b)-(rounded|rd)",
          "(border|b)-(rounded|rd)-$radius",
          "(rounded|rd)",
          "(rounded|rd)-$radius",
        ],
      },
    ],
    [/^(?:border-|b-)?(?:rounded|rd)-([rltbse])(?:-(.+))?$/, handlerRounded],
    [/^(?:border-|b-)?(?:rounded|rd)-([rltb]{2})(?:-(.+))?$/, handlerRounded],
    [/^(?:border-|b-)?(?:rounded|rd)-([bise][se])(?:-(.+))?$/, handlerRounded],
    [
      /^(?:border-|b-)?(?:rounded|rd)-([bi][se]-[bi][se])(?:-(.+))?$/,
      handlerRounded,
    ],

    // [
    // 	/^text-(.*)$/,
    // 	([, c], { theme }) => {
    // 		if (theme.colors[c]) return { color: theme.colors[c] };
    // 	},
    // ],
  ],

  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    colors: {
      border: "var(--border)",
      input: "var(--input)",
      ring: "var(--ring)",
      background: "var(--background)",
      foreground: "var(--foreground)",
      primary: {
        DEFAULT: "var(--primary)",
        foreground: "var(--primary-foreground)",
      },
      secondary: {
        DEFAULT: "var(--secondary)",
        foreground: "var(--secondary-foreground)",
      },
      destructive: {
        DEFAULT: "var(--destructive)",
        foreground: "var(--destructive-foreground)",
      },
      muted: {
        DEFAULT: "var(--muted)",
        foreground: "var(--muted-foreground)",
      },
      accent: {
        DEFAULT: "var(--accent)",
        foreground: "var(--accent-foreground)",
      },
      popover: {
        DEFAULT: "var(--popover)",
        foreground: "var(--popover-foreground)",
      },
      card: {
        DEFAULT: "var(--card)",
        foreground: "var(--card-foreground)",
      },
      sidebar: {
        DEFAULT: "var(--sidebar)",
        foreground: "var(--sidebar-foreground)",
        primary: "var(--sidebar-primary)",
        "primary-foreground": "var(--sidebar-primary-foreground)",
        accent: "var(--sidebar-accent)",
        "accent-foreground": "var(--sidebar-accent-foreground)",
        border: "var(--sidebar-border)",
        ring: "var(--sidebar-ring)",
      },
      chart: {
        1: "var(--chart-1)",
        2: "var(--chart-2)",
        3: "var(--chart-3)",
        4: "var(--chart-4)",
        5: "var(--chart-5)",
      },
    },
    radius: {
      sm: "calc(var(--radius) - 4px)",
      md: "calc(var(--radius) - 2px)",
      lg: "var(--radius)",
      xl: "calc(var(--radius) + 4px)",
    },

    animation: {
      keyframes: {
        "accordion-down":
          "{from {height: 0;} to {height: var(--bits-accordion-content-height);}}",
        "accordion-up":
          "{from {height: var(--bits-accordion-content-height);} to {height: 0;}}",
        "caret-blink": "{0%,70%,100%{opacity: 1;} 20%,50%{opacity: 0;}}",
        "enter-from-right":
          "{from {opacity: 0; transform: translateX(200px);} to {opacity: 1; transform: translateX(0);}}",
        "enter-from-left":
          "{from {opacity: 0; transform: translateX(-200px);} to {opacity: 1; transform: translateX(0);}}",
        "exit-to-right":
          "{from {opacity: 1; transform: translateX(0);} to {opacity: 0; transform: translateX(200px);}}",
        "exit-to-left":
          "{from {opacity: 1; transform: translateX(0);} to {opacity: 0; transform: translateX(-200px);}}",
        "scale-in":
          "{from {opacity: 0; transform: rotateX(-10deg) scale(0.9);} to {opacity: 1; transform: rotateX(0deg) scale(1);}}",
        "scale-out":
          "{from {opacity: 1; transform: rotateX(0deg) scale(1);} to {opacity: 0; transform: rotateX(-10deg) scale(0.95);}}",
        "fade-in": "{from {opacity: 0;} to {opacity: 1;}}",
        "fade-out": "{from {opacity: 1;} to {opacity: 0;}}",
      },
      durations: {
        "accordion-down": "0.2s",
        "accordion-up": "0.2s",
        "caret-blink": "1.25s",
        "scale-in": "0.2s",
        "scale-out": "0.15s",
        "fade-in": "0.2s",
        "fade-out": "0.15s",
        "enter-from-left": "0.2s",
        "enter-from-right": "0.2s",
        "exit-to-left": "0.2s",
        "exit-to-right": "0.2s",
      },
      easings: {
        "accordion-down": "ease-out",
        "accordion-up": "ease-out",
        "caret-blink": "ease-out",
        "scale-in": "ease",
        "scale-out": "ease",
        "fade-in": "ease",
        "fade-out": "ease",
        "enter-from-left": "ease",
        "enter-from-right": "ease",
        "exit-to-left": "ease",
        "exit-to-right": "ease",
      },
      counts: {
        "caret-blink": "infinite",
      },
    },
  },

  preflights: [
    // commented out because I put the CSS in app.css
    // also, I'm making use of this extension https://marketplace.visualstudio.com/items?itemName=dexxiez.shadcn-color-preview#:~:text=The%20shadcn%2020Preview%20extension,directly%20in%20your%20CSS%20files.
    //   {
    //     layer: 'default',
    //     getCSS: () => `:root {
    //   --background: 0 0% 100%;
    //   --foreground: 224 71.4% 4.1%;
    //   --muted: 220 14.3% 95.9%;
    //   --muted-foreground: 220 8.9% 46.1%;
    //   --popover: 0 0% 100%;
    //   --popover-foreground: 224 71.4% 4.1%;
    //   --card: 0 0% 100%;
    //   --card-foreground: 224 71.4% 4.1%;
    //   --border: 220 13% 91%;
    //   --input: 220 13% 91%;
    //   --primary: 220.9 39.3% 11%;
    //   --primary-foreground: 210 20% 98%;
    //   --secondary: 220 14.3% 95.9%;
    //   --secondary-foreground: 220.9 39.3% 11%;
    //   --accent: 220 14.3% 95.9%;
    //   --accent-foreground: 220.9 39.3% 11%;
    //   --destructive: 0 72.2% 50.6%;
    //   --destructive-foreground: 210 20% 98%;
    //   --ring: 224 71.4% 4.1%;
    //   --radius: 0.5rem;
    // }`,
    //   },
  ],
}));
