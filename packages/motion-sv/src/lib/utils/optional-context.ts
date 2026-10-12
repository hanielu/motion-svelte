import { createContext } from "svelte";

/**
 * Svelte's typed context, for providers a component may be rendered without (e.g. a motion component outside
 * AnimatePresence): `get` returns `undefined` instead of throwing when no ancestor set it.
 */
export function createOptionalContext<T>() {
	const [get, set, has] = createContext<T>();
	return [() => (has() ? get() : undefined), set] as const;
}
