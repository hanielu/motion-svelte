import type { LayoutGroupState } from './context.js';
import { LayoutGroupContext } from './context.js';
import { useForceUpdate } from './use-force-update.js';
import { nodeGroup } from './group.js';

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
	inherit?: boolean | 'id' | 'group';
}

/**
 * Hook to create and manage a layout group
 * Handles group inheritance, force updates, and context management
 */
export function useLayoutGroupProvider(props: LayoutGroupProps): LayoutGroupState {
	// Get parent group context if it exists
	const parentGroup = LayoutGroupContext.getOr(null);
	const [forceRender, key] = useForceUpdate();

	const context: LayoutGroupState = {
		id: getGroupId(props, parentGroup),
		group: getGroup(props, parentGroup),
		forceRender,
		key,
	};

	// Make group context available to children
	LayoutGroupContext.set(context);
	return context;
}

export function useLayoutGroup() {
	const { forceRender } = LayoutGroupContext.getOr({ forceRender: () => {} });
	return { forceRender };
}

/**
 * Determines the group ID based on inheritance rules
 */
function getGroupId(props: LayoutGroupProps, parentGroup: LayoutGroupState | null) {
	const shouldInherit = props.inherit === true || props.inherit === 'id';
	const parentId = parentGroup?.id;

	if (shouldInherit && parentId) {
		return props.id ? `${parentId}-${props.id}` : parentId;
	}
	return props.id;
}

/**
 * Creates or inherits a node group based on inheritance rules
 */
function getGroup(props: LayoutGroupProps, parentGroup: LayoutGroupState | null) {
	const shouldInherit = props.inherit === true || props.inherit === 'group';
	return shouldInherit ? parentGroup?.group || nodeGroup() : nodeGroup();
}
