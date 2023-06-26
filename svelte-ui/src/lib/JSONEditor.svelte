<script>
  export let value
  import Prism from 'prismjs'
  import 'prismjs/components/prism-json'
  import { afterUpdate, onMount } from 'svelte'

  let textarea

  onMount(() => {
    Prism.highlightElement(textarea)
  })
  afterUpdate(() => {
    Prism.highlightElement(textarea)
  })
</script>

<textarea bind:value bind:this={textarea}></textarea>

<style>
  textarea {
    width: 100%;
    height: 70vh;
    
  }
</style>