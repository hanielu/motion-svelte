<script lang="ts">
	import { mountedStates } from '@/state/index.js';
	import { doneCallbacks, removeDoneCallback, useAnimatePresence } from './presence.svelte.js';
	import type { AnimatePresenceProps } from './types.js';
	import { usePopLayout } from './use-pop-layout.js';
	import { delay } from '@/utils/delay.js';
	import type { Snippet } from 'svelte';

	let {
		mode = 'sync',
		initial = true,
		anchorX = 'left',
		as,
		custom,
		onExitComplete,
		children,
	}: AnimatePresenceProps & { children: Snippet } = $props();

	// TODO: (haniel) maybe these don't need to be getters?
	useAnimatePresence({
		mode,
		initial,
		get custom() {
			return custom;
		},
		get anchorX() {
			return anchorX;
		},
	});

	const { addPopStyle, removePopStyle, styles } = usePopLayout({
		get mode() {
			return mode;
		},
		get anchorX() {
			return anchorX;
		},
	});

	function findMotionElement(el: Element): Element | null {
		let current = el;

		while (current) {
			if (mountedStates.get(current)) {
				return current;
			}
			current = current.firstElementChild;
		}
		return null;
	}

	function enter(el: HTMLElement) {
		const state = mountedStates.get(el);
		if (!state) {
			return;
		}
		removePopStyle(state);
		state.isVShow = true;
		removeDoneCallback(el);
		/**
		 * Delay to ensure animations read the latest state before triggering.
		 * This allows the animation system to capture updated values after component updates.
		 */
		delay(() => {
			state.setActive('exit', false);
		});
	}

	const exitDom = new Map<Element, boolean>();

	$effect(() => {
		return () => {
			exitDom.clear();
		};
	});

	function exit(el: Element, done: VoidFunction) {
		// Find Motion element
		const motionEl = findMotionElement(el);
		const state = mountedStates.get(motionEl);
		// Handle cases where Motion element or state is not found
		if (!motionEl || !state) {
			done();
			if (exitDom.size === 0) {
				onExitComplete?.();
			}
			return;
		}

		exitDom.set(motionEl, true);
		removeDoneCallback(motionEl);
		addPopStyle(state);

		function doneCallback(e?: any) {
			if (e?.detail?.isExit) {
				const projection = state.visualElement.projection;
				// @ts-expect-error - animationProgress exists at runtime
				if (projection?.animationProgress > 0 && !state.isSafeToRemove && !state.isVShow) {
					return;
				}
				removeDoneCallback(motionEl);
				exitDom.delete(motionEl);
				if (exitDom.size === 0) {
					onExitComplete?.();
				}
				if (!styles.has(state)) {
					state.willUpdate('done');
				} else {
					removePopStyle(state);
				}
				done();
				if (!motionEl.isConnected) {
					state.unmount(true);
				}
			}
		}

		delay(() => {
			state.setActive('exit', true);
			doneCallbacks.set(motionEl, doneCallback);
			motionEl.addEventListener('motioncomplete', doneCallback);
		});
	}

	const transitionProps = $derived.by(() => {
		if (mode !== 'wait') {
			return {
				tag: as,
			};
		}
		return {
			mode: mode === 'wait' ? 'out-in' : undefined,
		};
	});
</script>

{#if transitionProps.tag}
	<svelte:element this={transitionProps.tag}>
		{@render children?.()}
	</svelte:element>
{:else}
	{@render children()}
{/if}
