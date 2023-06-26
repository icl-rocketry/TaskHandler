<script>
  export let value
  import Prism from 'prismjs'
  import 'prismjs/components/prism-json'
  import { afterUpdate, onMount } from 'svelte'

  let textarea
  let taskname
  $:{
    try{
      taskname = JSON.parse(value).task_name
    } catch{
      taskname = "Not valid JSON"
    }

  }

  onMount(() => {
    Prism.highlightElement(textarea)
  })
  afterUpdate(() => {
    Prism.highlightElement(textarea)
  })
</script>

Currently Editing: {taskname}
<textarea bind:value bind:this={textarea} spellcheck="false"></textarea>

<style>
  textarea {
    width: 100%;
    height: 70vh;
    caret-color: initial;
  }
</style>