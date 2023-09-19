<script>
  export let tasks
  import NiceButton from "./NiceButton.svelte"
  import ToggleButton from "./ToggleButton.svelte"

  import { createEventDispatcher } from "svelte"
  const dispatch = createEventDispatcher()
</script>

<div class='taskListDiv'>
  <h3>Tasks</h3>
  <table class='tasktable'>
    {#each tasks as task}
      <tr>
        <td>
          <NiceButton on:click={() => dispatch('selectTask', {'task_name': task.task_name})} text={task.task_name}/>
        </td>
        <td>
          <ToggleButton on:click={() => dispatch('toggleTask', {'task_name': task.task_name})} toggle={task.running}/>
        </td>
        <td>
          <div class='stats'>
            <div class="labelwidth">
              tx 
              <br>
              rx 
            </div>
            <div class="counterwidth">
              {task.txCounter}
              <br>
              {task.rxCounter}
            </div>
          </div>
        </td>
      </tr>
    {/each}
    </table>
  
</div>
<style>
  .tasktable{
    list-style-type: none;
    padding: 0;
    text-align: center;
    border: 1px solid #ccc;
    width: 100%;
  }
  .taskListDiv{
    border: 1px solid #ccc;
    height: 40vh;
    overflow: auto;
  }
  .stats{
    font-size: 20px;
    background-color: #1a1a1a;
    display: flex;
    justify-content: flex-start;
  }
  .labelwidth{
    width: 10px;
    padding-right: 10px;
  }
  .counterwidth{
    width: 90px;
    text-align: left;
  }
</style>