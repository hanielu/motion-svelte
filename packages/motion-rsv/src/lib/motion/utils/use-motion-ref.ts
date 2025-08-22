import type { VisualElement } from '$lib/render/VisualElement.js';
import type { VisualState } from './use-visual-state.js';

/**
 * Svelte 5 helper to mirror React's useMotionRef semantics.
 * Call this inside an effect when the bound DOM node (instance) changes.
 * It will:
 * - invoke visualState.onMount(instance)
 * - mount the visualElement on the instance
 * - return a cleanup that unmounts the visualElement
 */
type ExternalRef<Instance> = (node: Instance | null) => void;

/**
 * Returns an attachment/ref callback suitable for Svelte 5 attachments.
 * Pass this directly to UseRender via `ref={useMotionRef(...)}.`
 */
export function useMotionRef<Instance, RenderState>(
	visualState: VisualState<Instance, RenderState>,
	visualElement?: VisualElement<Instance> | undefined,
	externalRef?: ExternalRef<Instance>
) {
	return (node: Instance) => {
		if (node) {
			visualState.onMount?.(node);
		}
		// console.log("[haniel] useMotionRef", visualState.current);

		if (visualElement) {
			// console.log("[haniel] useMotionRef mount", visualElement.current.mount);
			visualElement.mount(node);
		}
		externalRef?.(node);

		return () => {
			visualElement?.unmount();
			externalRef?.(null);
		};

		// AI generated code below
		// if (!node) return;
		// visualState.current.onMount(node);
		// visualElement.current?.mount(node);
		// externalRef?.(node);
		// return () => {
		//   visualElement.current?.unmount();
		//   externalRef?.(null);
		// };
	};
}
