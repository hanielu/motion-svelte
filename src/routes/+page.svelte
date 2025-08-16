<script lang="ts">
  const container2 = {
    display: "flex",
    flexDirection: "column",
    width: 100,
    height: 160,
    position: "relative",
  };

  const box = {
    width: 100,
    height: 100,
    backgroundColor: "#0cdcf7",
    borderRadius: "10px",
  };

  const button = {
    backgroundColor: "#0cdcf7",
    borderRadius: "10px",
    padding: "10px 20px",
    color: "#0f1115",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  };

  import { AnimatePresence, motion } from "motion";
  import { styleToStr, Previous } from "runed";
  import WorkingExamples from "./working-examples.svelte";

  let isVisible = $state(true);
  const wasVisible = new Previous(() => isVisible);

  $effect(() => {
    console.log("[haniel] wasVisible", wasVisible.current);
  });
</script>

<div style={styleToStr(container2)}>
  <AnimatePresence initial={false}>
    {#if isVisible}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1, backgroundColor: wasVisible.current ? "red" : "blue" }}
        exit={{ opacity: 0, scale: 0 }}
        style={box}
        whileHover={{ scale: 1.1 }}
        key="box"
      />
    {/if}
  </AnimatePresence>
  <motion.button style={button} onclick={() => (isVisible = !isVisible)} whileTap={{ y: 1 }}>
    {isVisible ? "Hide" : "Show"}
  </motion.button>
</div>

<!-- <WorkingExamples /> -->
