<script>
  // Export task
  export let value;

  // Third-party imports
  import CodeMirror from "svelte-codemirror-editor";
  import { json } from "@codemirror/lang-json";
  import { oneDark } from "@codemirror/theme-one-dark";

  // Declare task name
  let taskname;

  // Declare reactive component, based on task
  $: {
    try {
      // Parse task name
      taskname = JSON.parse(value).task_name;
    } catch {
      // Set error task name
      taskname = "Not valid JSON";
    }
  }
</script>

<div class="jsonEditorDiv">
  <div class="jsonTitle">Currently Editing: {taskname}</div>
  <CodeMirror
    bind:value
    lang={json()}
    theme={oneDark}
    styles={{
      "&": {
        width: "40vw",
        height: "70vh",
      },
    }}
  />
</div>

<style>
  .jsonTitle {
    text-align: center;
    margin-bottom: 6pt;
  }
  .jsonEditorDiv {
    padding: 20px;
    text-align: left;
  }
</style>
