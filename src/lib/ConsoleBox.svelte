<script>
  export let value
  import { beforeUpdate, afterUpdate } from "svelte"
  let div
  let autoscroll = false
  beforeUpdate(() => {
    if (div) {
      const scrollableDistance = div.scrollHeight - div.offsetHeight;
      autoscroll = div.scrollTop > scrollableDistance - 20;
    }
  });

  afterUpdate(() => {
    if (autoscroll) {
      div.scrollTo(0, div.scrollHeight);
    }
  });
  </script>
  
  <h3>Log</h3>
  <div class='errorListDiv' bind:this={div}>
    <pre>{value}</pre>    
  </div>
  <style>
    .errorListDiv{
        border: 1px solid #ccc;
        height: 10vh;
        overflow: auto;
        color: white;
        text-align:left;
    }
  </style>