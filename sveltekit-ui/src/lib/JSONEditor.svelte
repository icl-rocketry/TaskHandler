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

Currently Editing: {taskname}
<textarea bind:value spellcheck="false"></textarea>

<style>
  textarea {
    width: 100%;
    height: 70vh;
    caret-color: initial;
  }
</style>