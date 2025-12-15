<script lang="ts" module>
	import Provider from "./layout-motion.svelte";
	import type { MotionCreateOptions, MotionNameSpace } from "./utils.js";
	import type { MotionState } from "@/state/motion-state.js";
	import type { Snippet } from "svelte";
	import { Context, withProp } from "runed";
	import { motion } from "./instance.js";

	export interface LayoutMotionScope {
		states: Set<MotionState>;
		register: (state: MotionState) => void;
		unregister: (state: MotionState) => void;
	}

	export const LayoutMotionScopeContext = new Context<LayoutMotionScope>("LayoutMotionScope");
	/**
	 * Symbol to indicate that the update should not be run
	 * This is useful for cases where you want to update the layout
	 * but not run the update function
	 */
	export const STOP_UPDATE = Symbol("STOP_UPDATE");

	export type LayoutMotionNamespace = MotionNameSpace & {
		/**
		 * Expose update that runs beforeUpdate on registered states in parent-first order
		 */
		update: () => void;
	} & {
		update: {
			/**
			 * Allows you to pass a function that will be called to run the update
			 * e.g
			 *
			 * ```ts
			 * const layout = createLayoutMotion(motion);
			 * const fn = layout.update.with(() => deleteAll());
			 * // called in an event handler or something
			 * fn();
			 * ```
			 *
			 * instead of
			 *
			 * ```ts
			 * const layout = createLayoutMotion(motion);
			 * const fn = () => {
			 * 	deleteAll();
			 * 	layout.update();
			 * }
			 * // called in an event handler or something
			 * fn();
			 * ```
			 */
			with: <A extends unknown[], R>(fn: (...args: A) => R) => (...args: A) => R;
		};
	};

	/**
	 * Create a layout motion namespace
	 * The reason this exists is because svelte doesn't have a lifecycle hook
	 * that gets the snapshot of a component before DOM mutations are made/committed
	 * https://github.com/sveltejs/svelte/issues/16648#issuecomment-3201964832
	 * so we have to allow a user to trigger a beforeUpdate manually after they make
	 * a state change that's affect the layout of the component they want animated
	 *
	 * @param base - The base motion namespace to create a layout motion namespace from
	 */
	export function createLayoutMotion(base: MotionNameSpace = motion): LayoutMotionNamespace {
		const scope: LayoutMotionScope = {
			states: new Set<MotionState>(),
			register(state: MotionState) {
				this.states.add(state);
			},
			unregister(state: MotionState) {
				this.states.delete(state);
			},
		};

		// Expose update that runs beforeUpdate on registered states in parent-first order
		function update() {
			// Parent-to-child: states were linked via MotionState.parent
			// We approximate by running in insertion order which should be parent-first.
			scope.states.forEach((state) => {
				state.beforeUpdate();
			});
		}

		function updateWith<A extends unknown[], R>(fn: (...args: A) => R): (...args: A) => R {
			return (...args: A) => {
				const result = fn(...args);
				if (result !== STOP_UPDATE) {
					update();
					return result;
				}
			};
		}

		update.with = updateWith;

		return new Proxy(base as LayoutMotionNamespace, {
			get(target, key) {
				if (key === "update") return update;
				if (key === "create") {
					return (component: any, options?: MotionCreateOptions) => {
						const Component = target.create(component, options);
						return (anchor: any, props: any) => {
							return Provider(anchor, {
								children: ((a: any) => Component(a, withProp(props, "layout", true))) as Snippet,
								scope,
							});
						};
					};
				}

				const Component = target[key as keyof MotionNameSpace];
				return (anchor: any, props: any) => {
					return Provider(anchor, {
						children: ((a: any) => Component(a, withProp(props, "layout", true))) as Snippet,
						scope,
					});
				};
			},
		});
	}
</script>

<script lang="ts">
	interface LayoutMotionProps {
		children: Snippet;
		scope: LayoutMotionScope;
	}

	let { children, scope }: LayoutMotionProps = $props();

	LayoutMotionScopeContext.set(scope);
</script>

{@render children()}
