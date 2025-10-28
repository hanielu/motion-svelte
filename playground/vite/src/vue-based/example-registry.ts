import type { Component } from "svelte";

// Animate Presence
import LoginLinkBtn from "./examples/animate-presence/login-link-btn.svelte";
import EnterExitBasic from "./examples/animate-presence/enter-exit-basic.svelte";
import EnterExitList from "./examples/animate-presence/enter-exit-list.svelte";
import BoxSwitch from "./examples/animate-presence/box-switch.svelte";

// From Docs
import InView from "./examples/from-docs/in-view.svelte";
import UseSpring from "./examples/from-docs/use-spring.svelte";
import UseTime from "./examples/from-docs/use-time.svelte";
import UseTransform from "./examples/from-docs/use-transform.svelte";
import UseTransformPathMorphing from "./examples/from-docs/use-transform-path-morphing.svelte";
import DragDirectionLocking from "./examples/from-docs/drag-direction-locking.svelte";

// Layout Focused
import BasicLayoutList from "./examples/layout-focused/basic-layout-list.svelte";
import BasicLayoutToggle from "./examples/layout-focused/basic-layout-toggle.svelte";
import DirectionalNav from "./examples/layout-focused/directional-nav.svelte";
import LayoutIdTest from "./examples/layout-focused/layout-id-test.svelte";

// Variants
import WhenVariant from "./examples/variants/when-variant.svelte";
import CopyButton from "./examples/variants/copy-button.svelte";
import PathDrawing from "./examples/variants/path-drawing.svelte";
import ProgressCenterReveal from "./examples/variants/progress-center-reveal.svelte";
import ImageGallery from "./examples/variants/image-gallery.svelte";

// Lazy Motion
import LazyMotion from "./examples/lazy-motion/lazy-motion.svelte";

// Reorder
import ReorderExample_1 from "./examples/reorder/example-1/example-1.svelte";

// Other
import RollingBox from "./examples/rolling-box.svelte";

export interface Example {
	id: string;
	name: string;
	component: Component<any>;
	category: string;
}

export const examples: Example[] = [
	// Animate Presence
	{ id: "box-switch", name: "Box Switch", component: BoxSwitch, category: "Animate Presence" },
	{ id: "login-link-btn", name: "Login Link Button", component: LoginLinkBtn, category: "Animate Presence" },
	{ id: "enter-exit-basic", name: "Enter/Exit Basic", component: EnterExitBasic, category: "Animate Presence" },
	{ id: "enter-exit-list", name: "Enter/Exit List", component: EnterExitList, category: "Animate Presence" },
	
	// Layout Focused
	{ id: "basic-layout-toggle", name: "Basic Layout Toggle", component: BasicLayoutToggle, category: "Layout" },
	{ id: "basic-layout-list", name: "Basic Layout List", component: BasicLayoutList, category: "Layout" },
	{ id: "layout-id-test", name: "Layout ID Test", component: LayoutIdTest, category: "Layout" },
	{ id: "directional-nav", name: "Directional Nav", component: DirectionalNav, category: "Layout" },
	
	// Variants
	{ id: "copy-button", name: "Copy Button", component: CopyButton, category: "Variants" },
	{ id: "path-drawing", name: "Path Drawing", component: PathDrawing, category: "Variants" },
	{ id: "progress-center-reveal", name: "Progress Center Reveal", component: ProgressCenterReveal, category: "Variants" },
	{ id: "when-variant", name: "When Variant", component: WhenVariant, category: "Variants" },
	{ id: "image-gallery", name: "Image Gallery", component: ImageGallery, category: "Variants" },
	
	// From Docs
	{ id: "in-view", name: "In View", component: InView, category: "From Docs" },
	{ id: "use-spring", name: "Use Spring", component: UseSpring, category: "From Docs" },
	{ id: "use-time", name: "Use Time", component: UseTime, category: "From Docs" },
	{ id: "use-transform", name: "Use Transform", component: UseTransform, category: "From Docs" },
	{ id: "use-transform-path-morphing", name: "Use Transform Path Morphing", component: UseTransformPathMorphing, category: "From Docs" },
	{ id: "drag-direction-locking", name: "Drag Direction Locking", component: DragDirectionLocking, category: "From Docs" },
	
	// Other
	{ id: "lazy-motion", name: "Lazy Motion", component: LazyMotion, category: "Other" },
	{ id: "reorder-example-1", name: "Reorder Example 1", component: ReorderExample_1, category: "Other" },
	{ id: "rolling-box", name: "Rolling Box", component: RollingBox, category: "Other" },
];

export const examplesByCategory = examples.reduce((acc, example) => {
	if (!acc[example.category]) {
		acc[example.category] = [];
	}
	acc[example.category].push(example);
	return acc;
}, {} as Record<string, Example[]>);

export const examplesById = examples.reduce((acc, example) => {
	acc[example.id] = example;
	return acc;
}, {} as Record<string, Example>);
