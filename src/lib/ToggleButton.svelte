<script>
    export let toggle
    $: running = toggle ? "Running" : "Not Running"
  </script>
  
  <button on:click class={toggle}>
    {running}
  </button>
  
  <style>
    .true {
      background-color: green;
    }
    .false {
      background-color: red;
    }
    button {
    width: 150px;
    border-radius: 8px;
    border: 1px solid transparent;
    padding: 0.6em 1.2em;
    font-size: 1em;
    font-weight: 500;
    font-family: inherit;
    cursor: pointer;
    transition: border-color 0.25s;
  }
  button:hover {
    border-color: #646cff;
  }
  button:focus,
  button:focus-visible {
    outline: 4px auto -webkit-focus-ring-color;
  }
  </style>