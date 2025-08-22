export function useUnmountEffect(callback: () => void) {
  $effect(() => () => callback());
}
