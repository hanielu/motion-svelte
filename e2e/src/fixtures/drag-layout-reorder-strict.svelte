<script lang="ts">
	import { createLayoutMotion, motion, useMotionValue, type MotionValue } from "motion-sv";

	/**
	 * Reproduction for issue #3169:
	 * Drag + layout + memoized components
	 *
	 * Simulates Ant Design Tree's memoization: in React, FileItem is wrapped in React.memo so it doesn't re-render
	 * when parent state changes. When a folder expands during drag, new DOM nodes are inserted, shifting the dragged
	 * file's layout. The projection system must compensate even though the file's willUpdate() was never called.
	 *
	 * motion-sv: layout elements use createLayoutMotion + an explicit `layout.update()` after the state change.
	 * FileItem stays a plain `<motion.div layout>` outside that scope, so (like the memoized React component)
	 * `layout.update()` never snapshots it.
	 */

	let folderHoveredId = $state<string | null>(null);
	let expandedFolders = $state.raw(new Set(["Folder2"]));

	const layout = createLayoutMotion();

	// Expose to the spec
	Object.assign(window, {
		hoverFolder: layout.update.with((name: string | null) => {
			folderHoveredId = name;
		}),
		expandFolder: layout.update.with((name: string) => {
			expandedFolders = new Set([...expandedFolders, name]);
		}),
		collapseFolder: layout.update.with((name: string) => {
			const next = new Set(expandedFolders);
			next.delete(name);
			expandedFolders = next;
		}),
	});

	// FileItem's `useMotionValue(0)`, one per file.
	const fileY: Record<string, MotionValue<number>> = {
		File1: useMotionValue(0),
		File2: useMotionValue(0),
		File3: useMotionValue(0),
	};
</script>

{#snippet folderTitle(name: string, isHovered: boolean, isExpanded: boolean)}
	<layout.div
		data-testid={`folder-title-${name}`}
		style={{
			padding: "8px 10px",
			background: isHovered ? "#555" : "#333",
			color: "white",
		}}
	>
		{isExpanded ? "▼" : "▶"}
		{name}
	</layout.div>
{/snippet}

<!-- Memoized file item — simulates rc-tree's internal memoization. -->
{#snippet fileItem(name: string)}
	<motion.div
		data-testid={`file-${name}`}
		drag="y"
		layout
		dragMomentum={false}
		dragSnapToOrigin
		whilePress={{ scale: 1.05 }}
		style={{
			y: fileY[name],
			height: 35,
			background: "#0099ff",
			color: "white",
			display: "flex",
			alignItems: "center",
			padding: "0 20px",
			marginBottom: 2,
		}}
	>
		{name}
	</motion.div>
{/snippet}

{#snippet placeholderFile(name: string)}
	<layout.div
		data-testid={`placeholder-${name}`}
		style={{
			height: 35,
			background: "#666",
			color: "white",
			display: "flex",
			alignItems: "center",
			padding: "0 20px",
			marginBottom: 2,
		}}
	>
		{name}
	</layout.div>
{/snippet}

<div style="padding: 50px; width: 300px">
	<!-- Folder 1 — starts collapsed, expanding inserts content
		ABOVE the draggable files in Folder 2 -->
	<div style="margin-bottom: 2px">
		{@render folderTitle("Folder1", folderHoveredId === "Folder1", expandedFolders.has("Folder1"))}
		{#if expandedFolders.has("Folder1")}
			{@render placeholderFile("Existing1a")}
			{@render placeholderFile("Existing1b")}
			{@render placeholderFile("Existing1c")}
		{/if}
	</div>

	<!-- Folder 2 — starts expanded with draggable files -->
	<div style="margin-bottom: 2px">
		{@render folderTitle("Folder2", folderHoveredId === "Folder2", expandedFolders.has("Folder2"))}
		{#if expandedFolders.has("Folder2")}
			{@render fileItem("File1")}
			{@render fileItem("File2")}
			{@render fileItem("File3")}
		{/if}
	</div>

	<!-- Folder 3 — empty target -->
	<div style="margin-bottom: 2px">
		{@render folderTitle("Folder3", folderHoveredId === "Folder3", expandedFolders.has("Folder3"))}
	</div>

	<div id="result" data-hovered={folderHoveredId || ""} data-expanded={[...expandedFolders].join(",")}></div>
</div>
