<script>
  // Define console box string
  export let value;

  // Standard imports
  import { beforeUpdate, afterUpdate } from "svelte";

  // Define div variable
  let div;

  // Declare autoscroll boolean
  let autoscroll = false;

  beforeUpdate(() => {
    // Check for div
    if (div) {
      // Calculate scrollable distance
      const scrollableDistance = div.scrollHeight - div.offsetHeight;

      // Update autoscroll based on distance
      autoscroll = div.scrollTop > scrollableDistance - 20;
    }
  });

  afterUpdate(() => {
    // Check if autoscroll is enabled
    if (autoscroll) {
      // Scroll to current scroll height
      div.scrollTo(0, div.scrollHeight);
    }
  });
</script>

<h3>Log</h3>
<div class="errorListDiv" bind:this={div}>
  <pre>{value}</pre>
</div>

<style>
  .errorListDiv {
    border: 1px solid #ccc;
    height: 10vh;
    overflow: auto;
    color: white;
    text-align: left;
  }
</style>
