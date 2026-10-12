<script lang="ts" module>
	import Provider from "./layout-motion.svelte";
	// Avoid importing Snippet here to prevent duplicate identifier complaints
	import type { MotionComponentOptions } from "../../motion.svelte";
	import type { DOMMotionComponents } from "../../../render/dom/types.js";
	import type { LayoutMotionScope as LayoutScope } from "./layout-motion-context.js";

	type MotionNamespace = typeof import("../../../render/components/motion/proxy.js") extends {
		motion: infer M;
	}
		? M
		: never;

	export type LayoutMotionNamespace = MotionNamespace & {
		update: (() => void) & {
			with: <A extends unknown[], R>(fn: (...args: A) => R) => (...args: A) => R;
		};
	};

	/**
	 * Create a layout motion namespace from an existing motion namespace.
	 * This wraps created components in a provider and forces `layout: true`.
	 * It also exposes an `update()` method to run registered snapshot callbacks
	 * synchronously (parent-first) after your state changes, before DOM commit.
	 */
	export function createLayoutMotion(base: MotionNamespace): LayoutMotionNamespace {
		const callbacks = new Set<() => void>();

		let scope: LayoutScope = {
			update: () => {
				for (const cb of callbacks) cb();
			},
			register: (fn) => {
				if (fn) callbacks.add(fn);
			},
			unregister: (fn) => {
				if (fn) callbacks.delete(fn);
			},
		};

		function update() {
			scope.update();
		}

		function updateWith<A extends unknown[], R>(fn: (...args: A) => R) {
			return (...args: A) => {
				const result = fn(...args);
				update();
				return result;
			};
		}

		update.with = updateWith;

		return new Proxy(base as LayoutMotionNamespace, {
			get(_target, key) {
				if (key === "update") return update;
				if (key === "create") {
					return (component: any, options?: MotionComponentOptions) => {
						const Component = base.create(component, options);
						return (anchor: any, props: any) => {
							return Provider(anchor, {
								children: ((a: any) => Component(a, withProp(props, "layout", true))) as any,
								scope,
							});
						};
					};
				}

				const Component = (base as any)[key as keyof DOMMotionComponents];
				return (anchor: any, props: any) => {
					return Provider(anchor, {
						children: ((a: any) => Component(a, withProp(props, "layout", true))) as any,
						scope,
					});
				};
			},
		});
	}
</script>

<script lang="ts">
	import type { Snippet } from "svelte";
	import { LayoutMotionScopeContext } from "./layout-motion-context.js";
	import { withProp } from "runed";

	interface LayoutMotionProps {
		children: Snippet;
		scope: LayoutScope;
	}

	let { children, scope }: LayoutMotionProps = $props();

	LayoutMotionScopeContext.set(scope);
</script>

{@render children()}
