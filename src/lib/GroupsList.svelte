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
  {#if groups.length}
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
  {:else}
    <div class="errorMessage">
      <h5>No groups available</h5>
    </div>
  {/if}
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
    max-height: 45vh;
    overflow-y: scroll;
    scrollbar-width: thin;
    width: fit-content;
    display: inline-block;
  }
  .errorMessage {
    text-align: center;
    padding-left: 5rem;
    padding-right: 5rem;
  }
</style>
