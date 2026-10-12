<script lang="ts" module>
	import Provider from "./layout-motion.svelte";
	import type { MotionCreateOptions, MotionNameSpace } from "./utils.js";
	import type { MotionState } from "#lib/state/motion-state.js";
	import type { Component, Snippet } from "svelte";
	import { withProp } from "#lib/vendor/runed/index.js";
	import { createOptionalContext } from "#lib/utils/optional-context.js";
	import { motion } from "./instance.js";
	import { frame } from "motion-dom";

	type MotionComponent = Component<Record<string, unknown>>;

	/** The motion states rendered through one createLayoutMotion() namespace, which its update() snapshots. */
	export const [getLayoutMotionScope, setLayoutMotionScope] = createOptionalContext<Set<MotionState>>();

	/**
	 * Return this from a function wrapped with `update.with` to skip the update, e.g. when nothing changed.
	 */
	export const STOP_UPDATE = Symbol("STOP_UPDATE");

	export type LayoutMotionNamespace = MotionNameSpace & {
		/**
		 * Snapshot the layout of this namespace's motion components before a state change, so they animate to their
		 * new layout once it renders.
		 */
		update: {
			(): void;
			/**
			 * Wrap a function so it runs `update()` after it, e.g.
			 *
			 * ```ts
			 * const layout = createLayoutMotion(motion);
			 * const deleteAll = layout.update.with(() => (items = []));
			 * ```
			 */
			with: <A extends unknown[], R>(fn: (...args: A) => R) => (...args: A) => R;
		};
	};

	/**
	 * Create a motion namespace whose components animate their layout changes. Svelte has no hook that runs before a
	 * component's DOM updates (https://github.com/sveltejs/svelte/issues/16648#issuecomment-3201964832), so the
	 * layout is snapshotted explicitly, by calling `update()` right after the state change that moves the components.
	 *
	 * @param base - The motion namespace (`motion` or `m`) to render the components with
	 */
	export function createLayoutMotion(base: MotionNameSpace = motion): LayoutMotionNamespace {
		const scope = new Set<MotionState>();

		function update() {
			// Insertion order, which is parent-first.
			scope.forEach((state) => state.beforeUpdate());
			// Usually a motion component whose props change with the update finishes the layout pass. When only plain
			// markup changes, nothing does, so finish it once the change is in the DOM (a no-op if it already ran).
			const [state] = scope;
			const root = state?.visualElement?.projection?.root;
			if (root) frame.read(() => root.didUpdate());
		}

		update.with =
			<A extends unknown[], R>(fn: (...args: A) => R) =>
			(...args: A) => {
				const result = fn(...args);
				if (result !== STOP_UPDATE) update();
				return result;
			};

		/** Render the component with `layout`, inside this namespace's scope. */
		const withScope =
			(component: MotionComponent): MotionComponent =>
			(anchor, props) =>
				Provider(anchor, {
					scope,
					children: ((childAnchor: typeof anchor) =>
						component(childAnchor, withProp(props, "layout", true))) as Snippet,
				});

		const components = new Map<PropertyKey, MotionComponent>();

		return new Proxy(base as LayoutMotionNamespace, {
			get(target, key) {
				if (key === "update") return update;
				if (key === "create") {
					return (component: Component, options?: MotionCreateOptions) =>
						withScope(target.create(component, options) as MotionComponent);
				}

				let component = components.get(key);
				if (!component) {
					component = withScope(target[key as keyof MotionNameSpace] as MotionComponent);
					components.set(key, component);
				}
				return component;
			},
		});
	}
</script>

<script lang="ts">
	interface LayoutMotionProps {
		children: Snippet;
		scope: Set<MotionState>;
	}

	let { children, scope }: LayoutMotionProps = $props();

	// svelte-ignore state_referenced_locally - each namespace renders its components through its own fixed scope
	setLayoutMotionScope(scope);
</script>

{@render children()}
