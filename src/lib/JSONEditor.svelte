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
      taskname = "None";
    }
  }
</script>

<div class="jsonTitle">
  <h3>Task Editor</h3>
  <p>Currently editing: {taskname}</p>
</div>
<div class="jsonEditorDiv">
  <CodeMirror
    bind:value
    lang={json()}
    theme={oneDark}
    styles={{
      "&": {
        width: "100%",
        height: "100vh",
      },
    }}
  />
</div>

<style>
  h3 {
    margin-bottom: 0rem;
  }
  p {
    margin-top: 0.25rem;
  }
  .jsonTitle {
    text-align: center;
  }
  .jsonEditorDiv {
    text-align: left;
    border: 1px solid #ccc;
  }
</style>
