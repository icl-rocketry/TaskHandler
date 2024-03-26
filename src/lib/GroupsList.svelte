<script>
  // Export groups list
  export let groups;

  // Standard imports
  import { createEventDispatcher } from "svelte";

  // Internal imports
  import NiceButton from "./NiceButton.svelte";
  import TaskButton from "./TaskButton.svelte";
  import ToggleButton from "./ToggleButton.svelte";

  // Create event dispatcher
  const dispatch = createEventDispatcher();
</script>

<div class="taskListDiv">
  <h3>Task Groups</h3>
  <table class="tasktable">
    {#each groups as group}
      <tr>
        <td>
          <NiceButton
          on:click={() => {}}
          text={group}
          />
        </td>
        <td>
          <NiceButton
            on:click={() => dispatch("startGroup", { group_name: group })}
            text="Start Group"
          />
        </td>
        <td>
          <NiceButton
            on:click={() => dispatch("stopGroup", { group_name: group })}
            text="Stop Group"
          />
        </td>
      </tr>
    {/each}
  </table>
</div>

<style>
  .tasktable {
    list-style-type: none;
    padding: 0;
    text-align: center;
    border: 1px solid #ccc;
    width: 100%;
  }
  .taskListDiv {
    border: 1px solid #ccc;
    height: 40vh;
    overflow: auto;
  }
  .stats {
    font-size: 14px;
    background-color: #1a1a1a;
    display: flex;
    justify-content: flex-start;
  }
  .labelwidth {
    width: 10px;
    padding-right: 10px;
  }
  .counterwidth {
    width: 90px;
    text-align: left;
  }
</style>
