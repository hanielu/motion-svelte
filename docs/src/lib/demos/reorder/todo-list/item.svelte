<script lang="ts" module>
	export interface TodoItem {
		id: number;
		text: string;
		completed: boolean;
		color: string;
	}
</script>

<script lang="ts">
	import { ReorderItem, motion, useMotionValue } from "motion-sv";

	let { value, onToggle }: { value: TodoItem; onToggle: () => void } = $props();

	const boxShadow = useMotionValue("0 1px 2px rgba(0,0,0,0.1)");
</script>

<ReorderItem {value} class="todo-item" style={{ boxShadow }}>
	<button
		class="todo-checkbox"
		aria-label={value.text}
		aria-pressed={value.completed}
		style:border-color={value.color}
		style:background-color={value.completed ? value.color : "transparent"}
		onclick={(event) => {
			event.stopPropagation();
			onToggle();
		}}
		ongotpointercapture={(event) => event.stopPropagation()}
	>
		{#if value.completed}
			<svg width="10" height="8" viewBox="0 0 12 10" fill="none" style="display: block">
				<path
					d="M1 5L4.5 8.5L11 1"
					stroke="white"
					stroke-width="2.5"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</svg>
		{/if}
	</button>
	<span class="todo-text-wrapper">
		<motion.span
			animate={{ opacity: value.completed ? 0.45 : 1 }}
			transition={{ duration: 0.4 }}
			class="todo-text"
		>
			{value.text}
		</motion.span>
		<motion.span
			initial={{ scaleX: 0 }}
			animate={{ scaleX: value.completed ? 1 : 0 }}
			transition={{ duration: 0.4, ease: "easeOut" }}
			class="todo-strikethrough"
			style={{ backgroundColor: value.color }}
		/>
	</span>
</ReorderItem>

<style>
	.todo-checkbox {
		box-sizing: content-box;
		display: flex;
		flex-shrink: 0;
		justify-content: center;
		align-items: center;
		width: 20px;
		height: 20px;
		padding: 0;
		border: 2px solid;
		border-radius: 6px;
		cursor: pointer;
		transition: background-color 0.2s;
	}

	.todo-text-wrapper {
		position: relative;
		display: inline;
	}

	.todo-text-wrapper :global(.todo-text) {
		color: #374151;
		font-size: 14px;
		font-weight: 500;
	}

	.todo-text-wrapper :global(.todo-strikethrough) {
		position: absolute;
		top: 50%;
		right: 0;
		left: 0;
		height: 1.5px;
		border-radius: 1px;
		transform-origin: left center;
		pointer-events: none;
	}
</style>
