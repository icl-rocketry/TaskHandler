<script>
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
  Currently Editing: {taskname}
  <textarea bind:value spellcheck="false"></textarea>
</div>
<style>
  textarea {
    width: 100%;
    height: 61vh;
    caret-color: initial;
  }
  .jsonEditorDiv{
    padding: 20px;
  }
</style>