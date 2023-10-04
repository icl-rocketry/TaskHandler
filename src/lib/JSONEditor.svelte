<script>
  import CodeMirror from "svelte-codemirror-editor";
  import { json } from "@codemirror/lang-json";
  import { oneDark } from "@codemirror/theme-one-dark";
  export let value
  let taskname
  $:{
    try{
      taskname = JSON.parse(value).task_name
    } catch{
      taskname = "Not valid JSON"
    }
  }
</script>

<div class="jsonEditorDiv">
  <div class="jsonTitle">Currently Editing: {taskname}</div>
  <CodeMirror bind:value lang={json()} theme={oneDark} 
    styles={{
      "&": {
        width: "50vw",
        height: "61vh"
      },
    }}
  />
</div>
<style>
  .jsonTitle{
    text-align:  center;
  }
  .jsonEditorDiv{
    padding: 20px;
    text-align: left;
  }
</style>