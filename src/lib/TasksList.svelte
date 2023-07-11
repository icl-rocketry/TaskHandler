<script>
  export let tasks
  import NiceButton from "./NiceButton.svelte"
  import ToggleButton from "./ToggleButton.svelte"

  import { createEventDispatcher } from "svelte"
  const dispatch = createEventDispatcher()
</script>

<div class='taskListDiv'>
  <h3>Tasks:</h3>
  <table>
    {#each tasks as task}
      <tr>
        <td>
          <NiceButton on:click={() => dispatch('selectTask', {'task_name': task.task_name})} text={task.task_name}/>
        </td>
        <td>
          <ToggleButton on:click={() => dispatch('toggleTask', {'task_name': task.task_name})} toggle={task.running}/>
        </td>
      </tr>
    {/each}
    </table>
  
</div>
<style>
  table{
    list-style-type: none;
    padding: 0;
    text-align: center;
    border: 1px solid #ccc;
    width: 100%;
  }
  td{
    width:50%;
  }
  .taskListDiv{
    border: 1px solid #ccc;
    height: 40vh;
    overflow: auto;
  }
</style>