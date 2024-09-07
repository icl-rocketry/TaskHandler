<script>
  // Export button toggle state
  export let toggle;

  // Export button text
  export let text;

  // Export button style
  export let styles;
	
  // Define colours from styles
	$: cssVarStyles = Object.entries(styles)
		.map(([key, value]) => `--${key}:${value}`)
		.join(';');

  // Define reactive running string, based on toggle state
  $: running = toggle ? text.true : text.false;
</script>

<button on:click class={toggle}  style="{cssVarStyles}">
  {running}
</button>

<style>
  .true {
    background-color: var(--trueColour);
  }
  .false {
    background-color: var(--falseColour);
  }
  button {
    width: 100px;
    border-radius: 8px;
    border: 1px solid transparent;
    padding: 0.6em 1.2em;
    font-size: 1em;
    font-weight: 500;
    font-family: inherit;
    cursor: pointer;
    transition: border-color 0.25s;
    color: rgba(255, 255, 255, 0.87);
  }
  button:hover {
    border-color: #646cff;
  }
  button:focus,
  button:focus-visible {
    outline: 4px auto -webkit-focus-ring-color;
  }
</style>
