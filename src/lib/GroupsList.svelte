<script>
  // Export groups list
  export let groups;

  // Standard imports
  import { createEventDispatcher } from "svelte";

  // Internal imports
  import NiceButton from "./NiceButton.svelte";

  // Create event dispatcher
  const dispatch = createEventDispatcher();
</script>

<div class="taskListTitle">
  <h3>Task Groups</h3>
</div>
<div class="taskListDiv">
  <table class="tasktable">
    {#each groups as group}
      <tr>
        <td>
          <NiceButton on:click={() => {}} text={group} />
        </td>
        <td>
          <NiceButton
            on:click={() => dispatch("startGroup", { group_name: group })}
            text="Start"
          />
        </td>
        <td>
          <NiceButton
            on:click={() => dispatch("stopGroup", { group_name: group })}
            text="Stop"
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
    width: 100%;
  }
  .taskListDiv {
    border: 1px solid #ccc;
    /* height: 45vh; */
    /* overflow: auto; */
    width: fit-content;
    display: inline-block;
  }
</style>
