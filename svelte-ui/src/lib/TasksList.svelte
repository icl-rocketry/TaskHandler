<script>
  export let tasks
  import NiceButton from "./NiceButton.svelte";

  import { createEventDispatcher } from "svelte"
  const dispatch = createEventDispatcher()
</script>

<div>
  <h1>Tasks:</h1>
  <ol>
    {#each tasks as task}
      <li>
        <NiceButton on:click={() => dispatch('selectTask', {'task_name': task.task_name})} text={task.task_name}/>
      </li>
    {/each}
  </ol>
  
</div>
<style>
  ol{
    list-style-type: none;
    padding: 0;
    text-align: center;
  }
</style>