<script lang="ts">
  import { AnimatePresence, motion } from "motion";
  import { css } from "runed";

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
      background:
        "repeating-linear-gradient(180deg,#e5e7eb, #e5e7eb 3px, #f3f4f6 3px, #f3f4f6 6px)",
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
    // { id: 3, text: "Ship it" },
  ]);
  let nextId = $state(4);
  let draft = $state("");
  let filter = $state("");

  const filtered = $derived(items.filter(x => x.text.toLowerCase().includes(filter.toLowerCase())));

  function add() {
    const t = draft.trim();
    if (!t) return;
    items.unshift({ id: nextId, text: t });
    // console.log("[haniel] add", items);
    // console.log("[haniel] filtered", JSON.stringify(filtered, null, 2));
    nextId += 1;
    draft = "";
  }

  function removeById(id: number) {
    const i = items.findIndex(x => x.id === id);
    if (i > -1) items.splice(i, 1);
  }

  function shuffle() {
    for (let i = items.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [items[i], items[j]] = [items[j], items[i]];
    }
  }

  function clear() {
    items.length = 0;
  }

  function logOrder(idx: number, key: string | number) {
    console.log("[haniel] template log order", idx, "for key", key);
  }
</script>

<div style={css(styles.app)}>
  <div style={css(styles.headingRow)}>
    <h1 style={css(styles.heading)}>AnimatePresence list</h1>
    <span style={css(styles.small)}>{items.length} items</span>
  </div>

  <div style={css(styles.row)}>
    <input
      style={css(styles.input)}
      bind:value={draft}
      placeholder="Add item"
      onkeydown={e => {
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

  <motion.ul style={css(styles.list)} layoutRoot layoutDependency={filtered.length}>
    <AnimatePresence initial={false}>
      {#each filtered as item, idx (item.id)}
        <!-- {logOrder(idx, item.text)} -->
        <motion.li
          key={item.id}
          style={css(styles.item)}
          initial={{ opacity: 0, y: -8, scale: 0.98 }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
            transition: { type: "spring", stiffness: 500, damping: 30 },
          }}
          exit={{ opacity: 0, y: 8, scale: 0.98, transition: { duration: 0.18 } }}
          layout
        >
          <div style={css(styles.left)}>
            <div style={css(styles.handle)}></div>
            <div>
              <p style={css(styles.title)}>{item.text}</p>
              <span style={css(styles.small)}>id: {item.id}</span>
            </div>
          </div>
          <button
            style={css({ ...styles.ghostBtn, ...styles.danger })}
            onclick={() => removeById(item.id)}
          >
            Remove
          </button>
        </motion.li>
      {/each}
    </AnimatePresence>
  </motion.ul>

  <!-- <AnimatePresence>
    {#if filtered.length === 0}
      <motion.div
        style={css(styles.empty)}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        key="empty"
      >
        Empty. Add an item or clear the filter.
      </motion.div>
    {/if}
  </AnimatePresence> -->
</div>
