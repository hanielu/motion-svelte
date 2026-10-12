export interface DocPage {
	title: string;
	/** Path under /docs; empty for the introduction. */
	slug: string;
	/** Not in Motion for React or Vue. */
	svelteOnly?: boolean;
}

export interface DocSection {
	title: string;
	pages: DocPage[];
}

export const navigation: DocSection[] = [
	{
		title: "Getting started",
		pages: [
			{ title: "Introduction", slug: "" },
			{ title: "Coming from React or Vue", slug: "coming-from-react-or-vue", svelteOnly: true },
		],
	},
	{
		title: "Animation",
		pages: [
			{ title: "Animation", slug: "animation" },
			{ title: "Transitions", slug: "transitions" },
			{ title: "Gestures", slug: "gestures" },
			{ title: "Layout animations", slug: "layout-animations" },
			{ title: "Scroll animations", slug: "scroll-animations" },
		],
	},
	{
		title: "Components",
		pages: [
			{ title: "motion", slug: "motion-component" },
			{ title: "AnimatePresence", slug: "animate-presence" },
			{ title: "LayoutGroup", slug: "layout-group" },
			{ title: "LazyMotion", slug: "lazy-motion" },
			{ title: "MotionConfig", slug: "motion-config" },
			{ title: "Reorder", slug: "reorder" },
		],
	},
	{
		title: "Motion values",
		pages: [
			{ title: "Overview", slug: "motion-value" },
			{ title: "useCurrentMotionValue", slug: "use-current-motion-value", svelteOnly: true },
			{ title: "useMotionTemplate", slug: "use-motion-template" },
			{ title: "useMotionValueEvent", slug: "use-motion-value-event" },
			{ title: "useScroll", slug: "use-scroll" },
			{ title: "useSpring", slug: "use-spring" },
			{ title: "useTime", slug: "use-time" },
			{ title: "useTransform", slug: "use-transform" },
			{ title: "useVelocity", slug: "use-velocity" },
		],
	},
	{
		title: "Hooks",
		pages: [
			{ title: "useAnimate", slug: "use-animate" },
			{ title: "useAnimationFrame", slug: "use-animation-frame" },
			{ title: "useDragControls", slug: "use-drag-controls" },
			{ title: "useInView", slug: "use-in-view" },
			{ title: "usePageInView", slug: "use-page-in-view" },
			{ title: "useReducedMotion", slug: "use-reduced-motion" },
		],
	},
];

export const pages = navigation.flatMap((section) => section.pages);

export const href = (page: DocPage) => (page.slug ? `/docs/${page.slug}` : "/docs");
