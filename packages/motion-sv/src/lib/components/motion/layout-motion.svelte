<script lang="ts" module>
	import Provider from './layout-motion.svelte';
	import type { MotionCreateOptions, MotionNameSpace } from './utils.js';
	import type { MotionState } from '@/state/motion-state.js';
	import type { Snippet } from 'svelte';
	import { Context } from 'runed';

	export interface LayoutMotionScope {
		states: Set<MotionState>;
		register: (state: MotionState) => void;
		unregister: (state: MotionState) => void;
	}

	export const LayoutMotionScopeContext = new Context<LayoutMotionScope>('LayoutMotionScope');

	export type LayoutMotionNamespace = MotionNameSpace & {
		/**
		 * Expose update that runs beforeUpdate on registered states in parent-first order
		 */
		update: () => void;
	};

	/**
	 * Create a layout motion namespace
	 * The reason this exists is because svelte doesn't have a lifecycle hook
	 * that gets the snapshot of a component before DOM mutations are made/committed
	 * https://github.com/sveltejs/svelte/issues/16648#issuecomment-3201964832
	 * so we have to allow a user to trigger a beforeUpdate manually after they make
	 * a state change that's affect the layout of the component they want animated
	 * @param base - The base motion namespace to create a layout motion namespace from
	 */
	export function createLayoutMotion(base: MotionNameSpace): LayoutMotionNamespace {
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

		return new Proxy(base as LayoutMotionNamespace, {
			get(target, key) {
				if (key === 'update') return update;
				if (key === 'create') {
					return (component: any, options?: MotionCreateOptions) => {
						const Component = target.create(component, options);
						return (anchor: any, props: any) => {
							return Provider(anchor, {
								children: ((a: any) => Component(a, props)) as Snippet,
								scope,
							});
						};
					};
				}

				const Component = target[key as keyof MotionNameSpace];
				return (anchor: any, props: any) => {
					return Provider(anchor, {
						children: ((a: any) => Component(a, props)) as Snippet,
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
