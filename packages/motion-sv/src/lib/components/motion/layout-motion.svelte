<script lang="ts" module>
	import Provider from "./layout-motion.svelte";
	import type { MotionCreateOptions, MotionNameSpace } from "./utils.js";
	import type { MotionState } from "#lib/state/motion-state.js";
	import { flushSync, type Component, type Snippet } from "svelte";
	import { createOptionalContext } from "#lib/utils/optional-context.js";
	import { motion } from "./instance.js";
	import type { IProjectionNode } from "motion-dom";
	import { watch } from "#lib/vendor/runed/index.js";

	type MotionComponent = Component<Record<string, unknown>>;

	/** The props, with a live `layout` that defaults to `true`. */
	const withLayout = (props: Record<string, unknown>) =>
		Object.defineProperties(
			{},
			{
				...Object.getOwnPropertyDescriptors(props),
				layout: { get: () => props.layout ?? true, enumerable: true, configurable: true },
			}
		) as Record<string, unknown>;

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

	/** A getter for the state a layout depends on. Like `$derived`, the state it reads is tracked. */
	export type LayoutDependency = () => unknown;

	/**
	 * Create a motion namespace whose components animate their layout changes. Svelte has no hook that runs before a
	 * component's DOM updates (https://github.com/sveltejs/svelte/issues/16648#issuecomment-3201964832), so the
	 * namespace needs to know when a layout change is coming:
	 *
	 * - Pass a `dependency`, a getter for the state the layout depends on. Whenever that state changes, the namespace
	 *   measures its components before the DOM updates, wherever the change comes from (an event, a timer, a prop).
	 *   Create the namespace in the component whose markup changes the layout, or above it, at the top of its script.
	 * - Or call `update()` right after the state change that moves the components.
	 *
	 * ```ts
	 * let isOn = $state(false);
	 * const layout = createLayoutMotion(() => isOn);
	 * ```
	 *
	 * @param base - The motion namespace (`motion` or `m`) to render the components with
	 * @param dependency - A getter for the state the layout depends on
	 */
	export function createLayoutMotion(dependency?: LayoutDependency): LayoutMotionNamespace;
	export function createLayoutMotion(base: MotionNameSpace, dependency?: LayoutDependency): LayoutMotionNamespace;
	export function createLayoutMotion(
		...args: [dependency?: LayoutDependency] | [base: MotionNameSpace, dependency?: LayoutDependency]
	): LayoutMotionNamespace {
		// The namespaces are proxies of plain objects, so a function is always the dependency.
		const [base = motion, dependency] = typeof args[0] === "function" ? [undefined, args[0]] : args;
		const scope = new Set<MotionState>();

		function update() {
			// Insertion order, which is parent-first.
			scope.forEach((state) => state.beforeUpdate());

			// A motion component whose props change with the state change finishes the layout pass when it updates.
			// When only plain markup changes (e.g. a keyed list reorders), nothing does, so apply the change and finish
			// the pass in a microtask: before the browser paints the new layout, as React's componentDidUpdate does.
			const [state] = scope;
			const root: IProjectionNode | undefined = state?.visualElement?.projection?.root;
			if (!root) return;
			queueMicrotask(() => {
				flushSync();
				if (root.isUpdating) root.didUpdate();
			});
		}

		update.with =
			<A extends unknown[], R>(fn: (...args: A) => R) =>
			(...args: A) => {
				const result = fn(...args);
				if (result !== STOP_UPDATE) update();
				return result;
			};

		// A pre effect runs before the DOM updates of the component that creates it, and of everything it renders.
		if (dependency) watch.pre(dependency, () => update(), { lazy: true });

		/** Render the component inside this namespace's scope, with `layout` on unless it's set (e.g. to "position"). */
		const withScope =
			(component: MotionComponent): MotionComponent =>
			(anchor, props) =>
				Provider(anchor, {
					scope,
					children: ((childAnchor: typeof anchor) => component(childAnchor, withLayout(props))) as Snippet,
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
