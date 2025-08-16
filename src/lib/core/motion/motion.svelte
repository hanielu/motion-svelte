<script lang="ts" module>
  import Motion from "./motion.svelte";
  import type { Component, Snippet } from "svelte";
  import type { DOMMotionComponents } from "../render/dom/types.js";
  import type { CreateVisualElement } from "../render/types.js";
  import type { FeatureBundle, FeaturePackages } from "./features/types.js";
  import type { MotionProps } from "./types.js";
  import { loadFeatures } from "./features/load-features.js";
  import { isSVGComponent } from "../render/dom/utils/is-svg-component.js";
  import { useHTMLVisualState } from "../render/html/use-html-visual-state.js";
  import { useSVGVisualState } from "../render/svg/use-svg-visual-state.js";
  import { MotionConfigContext } from "../context/motion-config-context.js";
  import { LayoutGroupContext } from "../context/layout-group-context.js";
  import { useCreateMotionContext } from "../context/motion-context/create.svelte.js";
  import { LazyContext } from "../context/lazy-context.js";
  import { warning, invariant } from "motion-utils";
  import { featureDefinitions } from "./features/definitions.js";
  import { isBrowser } from "../utils/is-browser.js";
  import type { MeasureProps } from "./features/layout/measure-layout.svelte";
  import { read } from "runed";
  import { useVisualElement } from "./utils/use-visual-element.svelte.js";
  import { MotionContext } from "../context/motion-context/index.js";
  import UseRender from "../render/dom/use-render.svelte";
  import { useMotionRef } from "./utils/use-motion-ref.js";
  import type { HTMLRenderState } from "../render/html/types.js";
  import type { SVGRenderState } from "../render/svg/types.js";
  import {
    default as PresenceCollector,
    PresenceCollectorContext,
  } from "../components/animate-presence/presence-collector.svelte";
  import { motionComponentSymbol } from "./utils/symbol.js";
  import { nextSeq } from "$lib/utils/debug-seq.js";

  export interface MotionComponentConfig<
    TagName extends keyof DOMMotionComponents | string = "div",
  > {
    preloadedFeatures?: FeatureBundle;
    createVisualElement?: CreateVisualElement;
    Component: TagName | Component<any>;
    forwardMotionProps?: boolean;
  }

  export type MotionComponentProps<Props> = {
    [K in Exclude<keyof Props, keyof MotionProps>]?: Props[K];
  } & MotionProps & {
      ref?: HTMLElement | SVGElement | null;
    };

  export type MotionComponent<T, P> = T extends keyof DOMMotionComponents
    ? DOMMotionComponents[T]
    : Component<
        Omit<MotionComponentProps<P>, "children"> & {
          children?: "children" extends keyof P
            ? P["children"] | MotionComponentProps<P>["children"]
            : MotionComponentProps<P>["children"];
        }
      >;

  export interface MotionComponentOptions {
    forwardMotionProps?: boolean;
  }

  /**
   * Create a `motion` component.
   *
   * This function accepts a Component argument, which can be either a string (ie "div"
   * for `motion.div`), or an actual React component.
   *
   * Alongside this is a config option which provides a way of rendering the provided
   * component "offline", or outside the React render cycle.
   */
  export function createMotionComponent<
    Props extends Record<string, any>,
    TagName extends keyof DOMMotionComponents | string = "div",
  >(
    Component: TagName | string | Component<Props>,
    { forwardMotionProps = false }: MotionComponentOptions = {},
    preloadedFeatures?: FeaturePackages,
    createVisualElement?: CreateVisualElement<Props, TagName>
  ) {
    preloadedFeatures && loadFeatures(preloadedFeatures);

    const MotionDOMComponent: Component<MotionComponentProps<Props>> = (anchor, props) => {
      const MotionProps = {
        Component,
        props,
        set ref(v) {
          props.ref = v;
        },
        get ref() {
          return props.ref;
        },
        createVisualElement,
        forwardMotionProps,
      };

      const key = props.key;
      delete props.key;

      const collector = PresenceCollectorContext.get();
      if (!collector || collector.hasParent) return Motion(anchor, MotionProps);

      return PresenceCollector(anchor, {
        key: key!,
        children: ((anchor: any) => {
          Motion(anchor, MotionProps);
        }) as Snippet,
      });
    };

    (MotionDOMComponent as any)[motionComponentSymbol] = Component;

    return MotionDOMComponent;
  }

  function useLayoutId({ layoutId }: MotionProps) {
    const layoutGroupId = LayoutGroupContext.current.id;
    return layoutGroupId && layoutId !== undefined ? layoutGroupId + "-" + layoutId : layoutId;
  }

  function useStrictMode(configAndProps: MotionProps, preloadedFeatures?: FeaturePackages) {
    const isStrict = LazyContext.current.strict;

    /**
     * If we're in development mode, check to make sure we're not rendering a motion component
     * as a child of LazyMotion, as this will break the file-size benefits of using it.
     */
    if (process.env.NODE_ENV !== "production" && preloadedFeatures && isStrict) {
      const strictMessage =
        "You have rendered a `motion` component within a `LazyMotion` component. This will break tree shaking. Import and render a `m` component instead.";
      configAndProps.ignoreStrict
        ? warning(false, strictMessage, "lazy-strict-mode")
        : invariant(false, strictMessage, "lazy-strict-mode");
    }
  }

  function getProjectionFunctionality(props: MotionProps) {
    const { drag, layout } = featureDefinitions;

    if (!drag && !layout) return {};

    const combined = { ...drag, ...layout };

    return {
      // Also enable MeasureLayout when layoutRoot is set on this component,
      // so it can act as a measuring root for child layout animations even if it
      // doesn't have its own layout prop.
      MeasureLayout:
        props.layoutRoot || drag?.isEnabled(props) || layout?.isEnabled(props)
          ? combined.MeasureLayout
          : undefined,
      ProjectionNode: combined.ProjectionNode,
    };
  }
</script>

<script
  lang="ts"
  generics="Props extends Record<string, any>, TagName extends keyof DOMMotionComponents | string = 'div'"
>
  type MotionProps = {
    Component: TagName | string | Component<Props>;
    props: MotionComponentProps<Props>;
    preloadedFeatures?: FeaturePackages;
    ref?: HTMLElement | SVGElement | null;
    forwardMotionProps?: boolean;
    createVisualElement?: CreateVisualElement<Props, TagName>;
  };

  let {
    Component,
    props,
    preloadedFeatures,
    createVisualElement,
    forwardMotionProps,
    ref: externalRef = $bindable(),
  }: MotionProps = $props();

  // TODO: (haniel) revisit the reactivity in this component if stuff breaks

  let MeasureLayout: Component<MeasureProps> | undefined = $state();

  const configAndProps = $derived({
    ...MotionConfigContext.current,
    ...props,
    layoutId: useLayoutId(props),
  });

  $effect(() => {
    // console.log("[haniel] effect", props.animate);
  });

  // svelte-ignore state_referenced_locally - this is a valid use case
  const { isStatic } = configAndProps;

  const context = useCreateMotionContext<HTMLElement | SVGElement>(read(() => props));

  const useVisualState = isSVGComponent(Component) ? useSVGVisualState : useHTMLVisualState;
  const visualState = useVisualState(
    read(() => props),
    isStatic
  );

  if (!isStatic && isBrowser) {
    useStrictMode(configAndProps, preloadedFeatures);

    const layoutProjection = $derived(getProjectionFunctionality(configAndProps));

    $effect(() => {
      console.log(
        "[haniel][",
        nextSeq(),
        "][motion] projection: layoutRoot=",
        !!configAndProps.layoutRoot,
        "hasProjectionNode=",
        !!layoutProjection.ProjectionNode,
        "hasMeasureLayout=",
        !!layoutProjection.MeasureLayout
      );
      MeasureLayout = layoutProjection.MeasureLayout;
    });

    /**
     * Create a VisualElement for this component. A VisualElement provides a common
     * interface to renderer-specific APIs (ie DOM/Three.js etc) as well as
     * providing a way of rendering to these APIs outside of the React render loop
     * for more performant animations and interactions
     */
    context.current.visualElement = useVisualElement(
      Component,
      visualState,
      read(() => configAndProps),
      createVisualElement,
      () => {
        const ctor = layoutProjection.ProjectionNode;
        if (!ctor) {
          console.log(
            "[haniel][",
            nextSeq(),
            "][motion] ProjectionNode missing; layoutRoot=",
            !!configAndProps.layoutRoot
          );
        }
        return ctor;
      }
    );
  }

  /**
   * If we need to measure the element we load this functionality in a
   * separate class component in order to gain access to getSnapshotBeforeUpdate.
   */
  // const MeasureLayout = $derived.by(() => {
  //   if (!isStatic && isBrowser) {
  //     const layoutProjection = getProjectionFunctionality(configAndProps);
  //     return layoutProjection.MeasureLayout;
  //   }
  // });

  MotionContext.set(context);

  // Create a ref callback to hand to UseRender so it mounts VE on attach
  const renderedRef = useMotionRef<HTMLElement | SVGElement, HTMLRenderState | SVGRenderState>(
    visualState,
    read(() => context.current.visualElement),
    node => (externalRef = node)
  );
</script>

{#if MeasureLayout && context.current.visualElement}
  <MeasureLayout visualElement={context.current.visualElement} {...configAndProps} />
{/if}

<UseRender
  {Component}
  {props}
  ref={renderedRef}
  latestValues={visualState.current.latestValues}
  {isStatic}
  {forwardMotionProps}
/>
