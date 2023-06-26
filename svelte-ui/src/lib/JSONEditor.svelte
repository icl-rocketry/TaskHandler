<script>
  export let task

  import { createEventDispatcher } from "svelte"
  const dispatch = createEventDispatcher()
</script>

<div><textarea> {JSON.stringify(task, null ,2)} </textarea></div>

<style>
  textarea {
    width: 100%;
    height: 70vh;
  }
</style>