<script lang="ts">
	import { motion } from "motion-sv";

	/**
	 * Test for ref forwarding behavior in motion components.
	 * Tests:
	 * 1. RefObject forwarding (`bind:ref`) - the bound value should be set to the DOM element
	 * 2. Callback ref forwarding (an attachment, Svelte's callback ref) - called with the DOM element on mount
	 * 3. Callback ref cleanup - the attachment's cleanup function should be called on unmount
	 */
	let mounted = $state(true);
	let results = $state({
		refObjectMounted: false,
		refObjectValue: "none",
		callbackRefMountCalled: false,
		callbackRefMountValue: "none",
		callbackRefUnmountCalled: false,
		callbackRefUnmountValue: "none",
		cleanupCalled: false,
	});

	// Test 1: RefObject
	let refObject = $state<HTMLElement | SVGElement | null>(null);

	// Test 2: Callback ref
	const callbackRef = (instance: Element | null) => {
		if (instance) {
			results.callbackRefMountCalled = true;
			results.callbackRefMountValue = instance.tagName;
			// Return cleanup function
			return () => {
				results.cleanupCalled = true;
			};
		} else {
			results.callbackRefUnmountCalled = true;
			results.callbackRefUnmountValue = "null";
		}
	};

	// Check refObject after mount
	const checkRefObject = () => {
		results.refObjectMounted = true;
		results.refObjectValue = refObject?.tagName || "null";
	};
</script>

<div style="padding: 20px">
	<h2>Motion Ref Forwarding Test</h2>

	<button id="toggle" onclick={() => (mounted = !mounted)}>
		{mounted ? "Unmount" : "Mount"}
	</button>
	<button id="check-ref" onclick={checkRefObject}>Check RefObject</button>

	{#if mounted}
		<motion.div
			id="ref-object-target"
			bind:ref={refObject}
			style={{
				width: 100,
				height: 100,
				background: "blue",
				margin: 10,
			}}
		>
			RefObject Target
		</motion.div>

		<motion.div
			id="callback-ref-target"
			{@attach callbackRef}
			style={{
				width: 100,
				height: 100,
				background: "green",
				margin: 10,
			}}
		>
			Callback Ref Target
		</motion.div>
	{/if}

	<div id="results" style="margin-top: 20px; font-family: monospace">
		<div id="ref-object-mounted" data-value={results.refObjectMounted.toString()}>
			refObject checked: {results.refObjectMounted.toString()}
		</div>
		<div id="ref-object-value" data-value={results.refObjectValue}>
			refObject.current?.tagName: {results.refObjectValue}
		</div>
		<div id="callback-mount-called" data-value={results.callbackRefMountCalled.toString()}>
			callback ref mount called: {results.callbackRefMountCalled.toString()}
		</div>
		<div id="callback-mount-value" data-value={results.callbackRefMountValue}>
			callback ref mount value: {results.callbackRefMountValue}
		</div>
		<div id="callback-unmount-called" data-value={results.callbackRefUnmountCalled.toString()}>
			callback ref unmount called: {results.callbackRefUnmountCalled.toString()}
		</div>
		<div id="cleanup-called" data-value={results.cleanupCalled.toString()}>
			cleanup function called: {results.cleanupCalled.toString()}
		</div>
	</div>
</div>
