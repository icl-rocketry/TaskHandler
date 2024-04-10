<script>
  // Export tasks list
  export let tasks;

  // Standard imports
  import { createEventDispatcher } from "svelte";

  // Internal imports
  import TaskButton from "./TaskButton.svelte";
  import ToggleButton from "./ToggleButton.svelte";

  // Create event dispatcher
  const dispatch = createEventDispatcher();

  function formatThousandDelimited(value) {
    // Return value with spaces per thousand
    // Solution from: https://stackoverflow.com/a/16637170
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  }
</script>

<div>
  <h3>Tasks</h3>
</div>
<div class="taskListDiv">
  {#if tasks.length}
    <table class="tasktable">
      {#each tasks as task}
        <tr>
          <td>
            <TaskButton
              on:click={() =>
                dispatch("selectTask", { task_name: task.task_name })}
              text={task.task_name}
              connected={task.connected}
            />
          </td>
          <td>
            <ToggleButton
              on:click={() =>
                dispatch("toggleTask", { task_name: task.task_name })}
              toggle={task.running}
            />
          </td>
          <td>
            <table class="statsTable">
              <tr>
                <td> Tx </td>
                <td class="statsColumn">
                  {formatThousandDelimited(task.txCounter)}
                </td>
              </tr>
              <tr>
                <td> Rx </td>
                <td class="statsColumn">
                  {formatThousandDelimited(task.rxCounter)}
                </td>
              </tr>
            </table>
          </td>
        </tr>
      {/each}
    </table>
  {:else}
    <div class="errorMessage">
      <h5>No tasks available</h5>
    </div>
  {/if}
</div>

<style>
  .tasktable {
    background-color: #282c34;
    list-style-type: none;
    padding: 0.2rem;
    text-align: center;
    width: 100%;
  }
  .taskListDiv {
    border: 1px solid #ccc;
    max-height: 45vh;
    overflow-y: scroll;
    scrollbar-width: thin;
    width: fit-content;
    display: inline-block;
  }
  .statsColumn {
    min-width: 6rem;
    width: 100%;
    text-align: right;
  }
  .statsTable {
    font-size: 14px;
    background-color: #1a1a1a;
    text-align: left;
    border-radius: 8px;
    border-spacing: 0.1rem 0;
  }
  .errorMessage {
    text-align: center;
    padding-left: 5rem;
    padding-right: 5rem;
  }
</style>
