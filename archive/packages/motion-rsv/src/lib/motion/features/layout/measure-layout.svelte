<script lang="ts" module>
	export type MeasureProps = MotionProps & { visualElement: VisualElement };
</script>

<script lang="ts">
	import { frame, microtask } from "motion-dom";
	import { usePresence } from "../../../components/animate-presence/use-presence.svelte.js";
	import { LayoutGroupContext } from "../../../context/layout-group-context.js";
	import { SwitchLayoutGroupContext } from "../../../context/switch-layout-group-context.js";
	import { globalProjectionState } from "../../../projection/node/state.js";
	import { correctBorderRadius } from "../../../projection/styles/scale-border-radius.js";
	import { correctBoxShadow } from "../../../projection/styles/scale-box-shadow.js";
	import { addScaleCorrector } from "../../../projection/styles/scale-correction.js";
	import { VisualElement } from "../../../render/VisualElement.js";
	import type { MotionProps } from "../../types.js";
	import { onMount } from "svelte";
	import { LayoutMotionScopeContext } from "./layout-motion-context.js";

	let { visualElement, layoutId, layoutDependency, drag = false }: MeasureProps = $props();

	const id = $props.id();
	const [isPresent, _safeToRemove] = usePresence(id);
	const layoutGroup = $derived(LayoutGroupContext.current);
	const switchLayoutGroup = $derived(SwitchLayoutGroupContext.current);
	const layoutMotionScope = LayoutMotionScopeContext.getOr(null);

	let prevProps = { layoutDependency: undefined, isPresent: { current: undefined } as any };

	let hasTakenAnySnapshot = false;

	const defaultScaleCorrectors = {
		borderRadius: {
			...correctBorderRadius,
			applyTo: ["borderTopLeftRadius", "borderTopRightRadius", "borderBottomLeftRadius", "borderBottomRightRadius"],
		},
		borderTopLeftRadius: correctBorderRadius,
		borderTopRightRadius: correctBorderRadius,
		borderBottomLeftRadius: correctBorderRadius,
		borderBottomRightRadius: correctBorderRadius,
		boxShadow: correctBoxShadow,
	};

	function safeToRemove() {
		return _safeToRemove && _safeToRemove();
	}

	$effect.pre(() => {
		void layoutDependency;
		void isPresent.current;

		return () => {
			prevProps = { layoutDependency, isPresent };
		};
	});

	onMount(() => {
		addScaleCorrector(defaultScaleCorrectors);

		const { projection } = visualElement;
		if (projection) {
			layoutGroup?.group?.add?.(projection);
			if (switchLayoutGroup?.register && layoutId) {
				switchLayoutGroup.register(projection);
			}

			if (hasTakenAnySnapshot) projection.root?.didUpdate();

			projection.addEventListener("animationComplete", () => safeToRemove());
			projection.setOptions({ ...projection.options, onExitComplete: () => safeToRemove() });
		}

		globalProjectionState.hasEverUpdated = true;

		// componentWillUnmount
		return () => {
			layoutMotionScope?.unregister?.(snapshotBeforeUpdate);
			const promoteContext = switchLayoutGroup;
			const { projection } = visualElement;

			if (projection) {
				projection.scheduleCheckAfterUnmount();
				if (layoutGroup && layoutGroup.group) layoutGroup.group.remove(projection);
				if (promoteContext && promoteContext.deregister) promoteContext.deregister(projection);
			}
		};
	});

	// Needs to be in the body of the component to ensure it's unregistered
	// from parent-first order, as opposed to using a `$effect` ($effect is child-first)
	layoutMotionScope?.register?.(snapshotBeforeUpdate);

	// This exists because svelte does not have a similar concept to
	// React's getSnapshotBeforeUpdate
	function snapshotBeforeUpdate() {
		const { projection } = visualElement;
		if (!projection) return;

		projection.isPresent = isPresent.current;
		hasTakenAnySnapshot = true;

		if (
			drag ||
			prevProps.layoutDependency !== layoutDependency ||
			layoutDependency === undefined ||
			prevProps.isPresent !== isPresent.current
		) {
			projection.willUpdate();
		} else {
			safeToRemove();
		}

		if (prevProps.isPresent !== isPresent.current) {
			if (isPresent.current) {
				projection.promote();
			} else if (!projection.relegate()) {
				frame.postRender(() => {
					const stack = projection.getStack();
					if (!stack || !stack.members.length) {
						safeToRemove();
					}
				});
			}
		}
	}

	// componentDidUpdate
	$effect(() => {
		const { projection } = visualElement;
		if (projection) {
			projection.root!.didUpdate();

			microtask.postRender(() => {
				if (!projection.currentAnimation && projection.isLead()) {
					safeToRemove();
				}
			});
		}
	});
</script>
