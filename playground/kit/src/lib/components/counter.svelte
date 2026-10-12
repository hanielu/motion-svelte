<script lang="ts">
  let count = $state(0);
  const increment = () => count++;
</script>

<button onclick={increment}>Clicks: {count}</button>
