<script lang="ts">
	import { LayoutGroup } from "motion-sv";
	import Content from "./sidebar/content.svelte";
	import SideNav from "./sidebar/side-nav.svelte";
</script>

<div class="window">
	<LayoutGroup>
		<SideNav />
		<Content />
	</LayoutGroup>
</div>

<style>
	.window {
		display: flex;
		gap: 8px;
		width: 460px;
		height: 200px;
	}

	.window :global(.side-nav) {
		display: flex;
		flex-direction: column;
		gap: 8px;
		width: 80px;
		padding: 10px;
		background: rgb(153 17 255 / 0.15);
		box-sizing: border-box;
		overflow: hidden;
	}

	.window :global(.side-nav.open) {
		width: 180px;
	}

	.window :global(.toggle) {
		padding: 6px 0;
		border: none;
		border-radius: 8px;
		background: #9911ff;
		color: white;
		font: inherit;
		font-size: 14px;
		cursor: pointer;
	}

	.window :global(.link) {
		display: flex;
		align-items: center;
		gap: 10px;
		height: 32px;
		padding: 0 8px;
		font-size: 14px;
		white-space: nowrap;
	}

	.window :global(.icon) {
		flex: none;
		width: 16px;
		height: 16px;
		border-radius: 5px;
		background: #9911ff;
	}

	.window :global(.content) {
		display: flex;
		flex: 1;
		flex-direction: column;
		gap: 12px;
		padding: 20px;
		background: rgb(255 62 0 / 0.15);
	}

	.window :global(.line) {
		height: 14px;
		background: rgb(255 62 0 / 0.5);
	}
</style>
