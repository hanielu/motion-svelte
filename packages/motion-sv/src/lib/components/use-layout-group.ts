import { getLayoutGroup, setLayoutGroup, type LayoutGroupState } from "./context.js";
import { useForceUpdate } from "./use-force-update.svelte.js";
import { nodeGroup } from "motion-dom";

/**
 * Props for configuring layout group behavior
 */
export interface LayoutGroupProps {
	/** Optional ID for the layout group */
	id?: string;
	/**
	 * Controls inheritance of parent group properties:
	 * - true: Inherit both id and group
	 * - 'id': Only inherit id
	 * - 'group': Only inherit group
	 */
	inherit?: boolean | "id" | "group";
}

/**
 * Create a layout group and provide it to its children. Like React's LayoutGroup, it's created once, from the initial
 * props.
 */
export function useLayoutGroupProvider(props: LayoutGroupProps) {
	const parentGroup = getLayoutGroup();
	const [forceRender, key] = useForceUpdate();

	const context = {
		id: getGroupId(props, parentGroup),
		group: getGroup(props, parentGroup),
		forceRender,
		key,
	};
	setLayoutGroup(context);
	return context;
}

export function useLayoutGroup() {
	return { forceRender: getLayoutGroup()?.forceRender ?? (() => {}) };
}

/**
 * Determines the group ID based on inheritance rules
 */
function getGroupId(props: LayoutGroupProps, parentGroup: LayoutGroupState | undefined) {
	const shouldInherit = props.inherit === true || props.inherit === "id";
	const parentId = parentGroup?.id;

	if (shouldInherit && parentId) {
		return props.id ? `${parentId}-${props.id}` : parentId;
	}
	return props.id;
}

/**
 * Creates or inherits a node group based on inheritance rules
 */
function getGroup(props: LayoutGroupProps, parentGroup: LayoutGroupState | undefined) {
	const shouldInherit = props.inherit === true || props.inherit === "group";
	return shouldInherit ? parentGroup?.group || nodeGroup() : nodeGroup();
}
