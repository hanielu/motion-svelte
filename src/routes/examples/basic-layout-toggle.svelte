<script lang="ts">
  const container = {
    width: 100,
    height: 50,
    backgroundColor: "var(--hue-3-transparent)",
    borderRadius: 50,
    cursor: "pointer",
    display: "flex",
    padding: 10,
  };

  const handle = {
    width: 50,
    height: 50,
    backgroundColor: "#9911ff",
    borderRadius: "50%",
  };

  import { motion } from "motion";
  import { css } from "runed";

  let isOn = $state(false);
</script>

<!-- very odd scenario, but nested layout animation works -->
<!-- <motion.div onclick={() => (isOn = !isOn)}>
  <button
    style={css({
      ...container,
      justifyContent: "flex-" + (isOn ? "start" : "end"),
      marginTop: 50,
    })}
  >
    <motion.div
      style={handle}
      layout
      layoutDependency={isOn}
      transition={{
        type: "spring",
        visualDuration: 0.2,
        bounce: 0.2,
      }}
    />
  </button>
</motion.div> -->

<!-- nested layout animation works -->
<motion.button
  style={{ ...container, justifyContent: "flex-" + (isOn ? "start" : "end"), marginTop: 50 }}
  onclick={() => (isOn = !isOn)}
  layoutRoot
>
  <motion.div
    style={handle}
    layout
    layoutDependency={isOn}
    transition={{
      type: "spring",
      visualDuration: 0.2,
      bounce: 0.2,
    }}
  />
</motion.button>

<!-- nested layout animation does not work, as expected -->
<!-- <motion.ul
  style={{ ...container, justifyContent: "flex-" + (!isOn ? "start" : "end"), marginTop: 50 }}
  onclick={() => (isOn = !isOn)}
>
  <motion.li
    style={handle}
    layout
    layoutDependency={isOn}
    transition={{
      type: "spring",
      visualDuration: 0.2,
      bounce: 0.2,
    }}
  />
</motion.ul> -->
