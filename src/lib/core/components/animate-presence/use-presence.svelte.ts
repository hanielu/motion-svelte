// import { useCallback, useContext, useEffect, useId } from "react";
import { read, watch, type ReadableBox } from "runed";
import { PresenceContext, type PresenceContextProps } from "../../context/presence-context.js";

export type SafeToRemove = () => void;

type AlwaysPresent = [ReadableBox<true>, null];
// type AlwaysPresent = { isPresent: ReadableBox<true>; safeToRemove: null };

type Present = [ReadableBox<true>, null];
// type Present = { isPresent: ReadableBox<true>; safeToRemove: null };

type NotPresent = [ReadableBox<false>, SafeToRemove];
// type NotPresent = { isPresent: ReadableBox<false>; safeToRemove: SafeToRemove };

/**
 * When a component is the child of `AnimatePresence`, it can use `usePresence`
 * to access information about whether it's still present in the React tree.
 *
 * ```svelte
 * <script>
 *  import { usePresence } from "framer-motion"
 *  const id = $props.id()
 *  const [isPresent, safeToRemove] = usePresence(id)
 *
 *  $effect(() => {
 *    !isPresent.current && setTimeout(safeToRemove, 1000)
 *  })
 * </script>
 * <div></div>
 * ```
 *
 * If `isPresent.current` is `false`, it means that a component has been removed the tree, but
 * `AnimatePresence` won't really remove it until `safeToRemove` has been called.
 *
 * @public
 */
export function usePresence(
  id: string, // we need to pass in the component id because `$props.id()` is only available in the component
  subscribe: () => boolean = () => true
): AlwaysPresent | Present | NotPresent {
  const parentContext = PresenceContext.get();
  // console.log("[haniel] usePresence collect parentContext", parentContext.current);

  if (parentContext.current === null) return [read(() => true), null] as AlwaysPresent;

  const { isPresent, onExitComplete, register } = $derived(parentContext.current);

  watch(subscribe, subscribe => {
    // console.log("[haniel] usePresence collect subscribe", register);
    if (subscribe) return register(id);
  });

  const safeToRemove: SafeToRemove | undefined =
    !subscribe || !onExitComplete ? undefined : () => onExitComplete(id);

  return [read(() => isPresent), safeToRemove] as AlwaysPresent | Present | NotPresent;
}

/**
 * Similar to `usePresence`, except `useIsPresent` simply returns whether or not the component is present.
 * There is no `safeToRemove` function.
 *
 * ```svelte
 * <script>
 * import { useIsPresent } from "framer-motion"
 *  const isPresent = useIsPresent()
 *  $effect(() => {
 *    !isPresent.current && console.log("I've been removed!")
 *  })
 * </script>
 * <div></div>
 * ```
 * @public
 */
export function useIsPresent() {
  const parentContext = PresenceContext.get();
  return read(() => isPresent(parentContext.current));
}

export function isPresent(context: PresenceContextProps | null) {
  return context === null ? true : context.isPresent;
}
