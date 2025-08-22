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

  let { visualElement, layoutId, layoutDependency, drag = false }: MeasureProps = $props();

  const id = $props.id();
  const [isPresent, _safeToRemove] = usePresence(id);
  const layoutGroup = $derived(LayoutGroupContext.current);
  const switchLayoutGroup = $derived(SwitchLayoutGroupContext.current);

  let prevProps = { layoutDependency: undefined, isPresent: { current: undefined } as any };

  let hasTakenAnySnapshot = false;

  const defaultScaleCorrectors = {
    borderRadius: {
      ...correctBorderRadius,
      applyTo: [
        "borderTopLeftRadius",
        "borderTopRightRadius",
        "borderBottomLeftRadius",
        "borderBottomRightRadius",
      ],
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
      const promoteContext = switchLayoutGroup;
      const { projection } = visualElement;

      if (projection) {
        projection.scheduleCheckAfterUnmount();
        if (layoutGroup && layoutGroup.group) layoutGroup.group.remove(projection);
        if (promoteContext && promoteContext.deregister) promoteContext.deregister(projection);
      }
    };
  });

  $effect.pre(() => {
    const { projection } = visualElement;
    if (!projection) return;

    // If this component is a layout root, ensure we pre-snapshot its subtree
    // before any DOM mutations. This avoids affecting siblings outside this root.
    if (projection.options?.layoutRoot) {
      if (!projection.root?.isUpdating) {
        projection.root?.startUpdate();
      }

      const stack = [projection];
      while (stack.length) {
        const node = stack.pop();
        const opts = node?.options;
        if (opts?.layout || opts?.layoutId || opts?.layoutRoot) {
          node?.willUpdate(false);
        }
        if (node?.children) {
          node.children.forEach(child => stack.push(child));
        }
      }
    }
  });

  $effect.pre(() => {
    const { projection } = visualElement;

    if (!projection) return;

    /**
     * TODO: We use this data in relegate to determine whether to
     * promote a previous element. There's no guarantee its presence data
     * will have updated by this point - if a bug like this arises it will
     * have to be that we markForRelegation and then find a new lead some other way,
     * perhaps in didUpdate
     */
    projection.isPresent = isPresent.current;

    hasTakenAnySnapshot = true;

    if (
      drag ||
      prevProps.layoutDependency !== layoutDependency ||
      layoutDependency === undefined ||
      prevProps.isPresent !== isPresent.current
    ) {
      projection.willUpdate();
      console.log("[haniel] measure layout willUpdate");
    } else {
      console.log("[haniel] measure layout safeToRemove");
      safeToRemove();
    }

    if (prevProps.isPresent !== isPresent.current) {
      if (isPresent.current) {
        projection.promote();
      } else if (!projection.relegate()) {
        /**
         * If there's another stack member taking over from this one,
         * it's in charge of the exit animation and therefore should
         * be in charge of the safe to remove. Otherwise we call it here.
         */
        frame.postRender(() => {
          const stack = projection.getStack();
          if (!stack || !stack.members.length) {
            safeToRemove();
          }
        });
      }
    }
  });

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
