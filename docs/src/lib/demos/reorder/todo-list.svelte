<script lang="ts">
	import { LayoutGroup, ReorderGroup } from "motion-sv";
	import Item, { type TodoItem } from "./todo-list/item.svelte";

	const COLORS = ["#ff0088", "#dd00ee", "#9911ff", "#1e75f7", "#0cdcf7", "#8df0cc"];

	let todos = $state<TodoItem[]>([
		{ id: 0, text: "Review project proposal", completed: false, color: COLORS[0] },
		{ id: 1, text: "Update documentation", completed: false, color: COLORS[1] },
		{ id: 2, text: "Schedule team meeting", completed: false, color: COLORS[2] },
		{ id: 3, text: "Test new features", completed: false, color: COLORS[3] },
		{ id: 4, text: "Deploy to staging", completed: false, color: COLORS[4] },
		{ id: 5, text: "Send weekly report", completed: false, color: COLORS[5] },
		{ id: 6, text: "Prepare presentation slides", completed: false, color: COLORS[0] },
		{ id: 7, text: "Review pull requests", completed: false, color: COLORS[1] },
	]);

	function toggleTodo(id: number) {
		todos = todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo));

		if (todos.find((todo) => todo.id === id)?.completed) {
			// Move completed to end after a delay for animation
			setTimeout(() => {
				const completed = todos.filter((todo) => todo.completed);
				const uncompleted = todos.filter((todo) => !todo.completed);
				todos = [...uncompleted, ...completed];
			}, 600);
		}
	}
</script>

<div class="todo-container">
	<LayoutGroup>
		<ReorderGroup bind:values={todos} axis="y" class="todo-list" as="ul">
			{#each todos as todo (todo.id)}
				<Item value={todo} onToggle={() => toggleTodo(todo.id)} />
			{/each}
		</ReorderGroup>
	</LayoutGroup>
</div>

<style>
	.todo-container {
		width: 100%;
		max-width: 340px;
		height: 280px;
		padding: 24px;
		border: 1px solid #e5e7eb;
		border-radius: 16px;
		background-color: #ffffff;
		box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
		overflow: auto;
		scrollbar-width: thin;
		scrollbar-color: #d1d5db transparent;
	}

	.todo-container::-webkit-scrollbar {
		width: 6px;
	}

	.todo-container::-webkit-scrollbar-track {
		background: transparent;
	}

	.todo-container::-webkit-scrollbar-thumb {
		border-radius: 3px;
		background: #d1d5db;
	}

	.todo-container :global(.todo-list) {
		display: flex;
		flex-direction: column;
		gap: 12px;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.todo-container :global(.todo-item) {
		display: flex;
		align-items: center;
		gap: 12px;
		margin: 0;
		padding: 14px 16px;
		border-radius: 10px;
		background-color: #f9fafb;
		cursor: grab;
	}
</style>
