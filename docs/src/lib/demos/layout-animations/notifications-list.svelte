<script lang="ts">
	import { AnimatePresence, createLayoutMotion } from "motion-sv";

	let notifications = $state([0]);
	let newIndex = 0;
	// The list changes in place, so depend on its length
	const layout = createLayoutMotion(() => notifications.length);

	function addNotification() {
		notifications.push(++newIndex);
	}

	function removeNotification(id: number) {
		notifications.splice(notifications.indexOf(id), 1);
	}
</script>

<div class="notifications">
	<layout.ul>
		<AnimatePresence initial={false} mode="popLayout">
			{#each notifications as id (id)}
				<layout.li
					initial={{ opacity: 0, y: 50, scale: 0.3 }}
					animate={{ opacity: 1, y: 0, scale: 1 }}
					exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
				>
					<div class="placeholder-title"></div>
					<div class="placeholder-message"></div>
					<button class="close" aria-label="Close" onclick={() => removeNotification(id)}>
						<svg width="18" height="18" viewBox="0 0 23 23">
							<path
								d="M 3 16.5 L 17 2.5"
								fill="transparent"
								stroke-width="3"
								stroke="#7f7f7f"
								stroke-linecap="round"
							/>
							<path
								d="M 3 2.5 L 17 16.346"
								fill="transparent"
								stroke-width="3"
								stroke="#7f7f7f"
								stroke-linecap="round"
							/>
						</svg>
					</button>
				</layout.li>
			{/each}
		</AnimatePresence>
	</layout.ul>
	<button class="add" onclick={addNotification}>Add notification +</button>
</div>

<style>
	.notifications {
		position: relative;
		display: flex;
		flex-direction: column;
		width: 100%;
		height: 500px;
		pointer-events: none;
	}

	.notifications :global(ul) {
		position: absolute;
		bottom: 0;
		left: calc(50% - 150px);
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		gap: 10px;
		width: 300px;
		margin: 0;
		padding: 10px;
		list-style: none;
	}

	.notifications :global(li) {
		position: relative;
		display: flex;
		flex: 0 0 100px;
		flex-direction: column;
		gap: 10px;
		margin: 0;
		padding: 20px 80px 20px 20px;
		border: 1px solid rgb(127 127 127 / 0.25);
		border-radius: 10px;
		background: rgb(127 127 127 / 0.12);
		pointer-events: all;
	}

	.placeholder-title {
		width: 200px;
		height: 24px;
		border-radius: 5px;
		background: rgb(127 127 127);
	}

	.placeholder-message {
		width: 150px;
		height: 14px;
		border-radius: 5px;
		background: rgb(127 127 127);
		opacity: 0.5;
	}

	button {
		padding: 0;
		border: none;
		background: none;
		cursor: pointer;
		pointer-events: all;
	}

	.add {
		position: absolute;
		bottom: 10px;
		left: 10px;
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 10px 12px;
		border-radius: 10px;
		background: #8df0cc;
		color: #0f1115;
		font: inherit;
		font-size: 18px;
		line-height: normal;
	}

	.close {
		position: absolute;
		top: 15px;
		right: 10px;
	}
</style>
