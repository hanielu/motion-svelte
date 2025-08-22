<script lang="ts">
	import type { LayoutMotionNamespace } from "motion-sv";
	import { css } from "runed";
	import type { Snippet } from "svelte";

	interface AnimatedProps {
		title: string;
		update: LayoutMotionNamespace["update"];
		children: Snippet<
			[
				props: {
					filtered: { id: number; text: string }[];
					styles: Record<string, any>;
					actions: {
						removeById: (id: number) => void;
						shuffle: () => void;
						clear: () => void;
					};
				},
			]
		>;
	}

	let { title, children, update }: AnimatedProps = $props();

	// Inline style objects
	const styles = {
		app: {
			fontFamily: "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell",
			padding: 24,
			maxWidth: 560,
			margin: "40px auto",
			background: "#f9fafb",
			borderRadius: 12,
			boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
		},
		headingRow: {
			display: "flex",
			alignItems: "center",
			justifyContent: "space-between",
			marginBottom: 12,
		},
		heading: { fontSize: 20, margin: 0 },
		row: { display: "flex", gap: 8, marginBottom: 12 },
		input: {
			flex: 1,
			padding: 10,
			border: "1px solid #e5e7eb",
			borderRadius: 8,
			outline: "none",
			background: "white",
		},
		button: {
			padding: "10px 12px",
			border: "1px solid #e5e7eb",
			borderRadius: 8,
			background: "white",
			cursor: "pointer",
			userSelect: "none",
		},
		list: { listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 8 },
		item: {
			background: "white",
			border: "1px solid #e5e7eb",
			borderRadius: 8,
			padding: 12,
			display: "flex",
			alignItems: "center",
			justifyContent: "space-between",
			gap: 12,
		},
		left: { display: "flex", alignItems: "center", gap: 8 },
		handle: {
			width: 8,
			alignSelf: "stretch",
			background: "repeating-linear-gradient(180deg,#e5e7eb, #e5e7eb 3px, #f3f4f6 3px, #f3f4f6 6px)",
			borderRadius: 4,
			opacity: 0.9,
		},
		title: { fontSize: 14, margin: 0 },
		small: { fontSize: 12, color: "#6b7280" },
		danger: { color: "#ef4444" },
		ghostBtn: { border: "none", background: "transparent", cursor: "pointer", padding: 6 },
		empty: {
			padding: 16,
			textAlign: "center",
			border: "1px dashed #e5e7eb",
			borderRadius: 8,
			color: "#6b7280",
			background: "#fff",
		},
	};

	// Svelte 5 state via runes
	let items = $state([
		{ id: 1, text: "Buy milk" },
		{ id: 2, text: "Read docs" },
		{ id: 3, text: "Ship it" },
	]);
	let nextId = $state(4);
	let draft = $state("");
	let filter = $state("");

	const filtered = $derived(items.filter((x) => x.text.toLowerCase().includes(filter.toLowerCase())));

	const add = update.with(() => {
		const t = draft.trim();
		if (!t) return;
		items.unshift({ id: nextId, text: t });
		nextId += 1;
		draft = "";
	});

	const removeById = update.with((id: number) => {
		const i = items.findIndex((x) => x.id === id);
		if (i > -1) items.splice(i, 1);
	});

	const shuffle = update.with(() => {
		for (let i = items.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[items[i], items[j]] = [items[j], items[i]];
		}
	});

	const clear = update.with(() => (items.length = 0));
</script>

<div style={css(styles.app)}>
	<div style={css(styles.headingRow)}>
		<h1 style={css(styles.heading)}>{title}</h1>
		<span style={css(styles.small)}>{items.length} items</span>
	</div>

	<div style={css(styles.row)}>
		<input
			style={css(styles.input)}
			bind:value={draft}
			placeholder="Add item"
			onkeydown={(e) => {
				if (e.key === "Enter") add();
			}}
		/>
		<button style={css(styles.button)} onclick={add}>Add</button>
	</div>

	<div style={css(styles.row)}>
		<input style={css(styles.input)} bind:value={filter} placeholder="Filter" />
		<button style={css(styles.button)} onclick={shuffle}>Shuffle</button>
		<button style={css(styles.button)} onclick={clear}>Clear</button>
	</div>

	{@render children({ filtered, styles, actions: { removeById, shuffle, clear } })}
</div>
