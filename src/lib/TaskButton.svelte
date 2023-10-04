<script>
  export let text
  export let connected
</script>

<button on:click class={connected}>
  {text}
</button>

<style>
  .false {
    animation: blinking .5s infinite;
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
  background-color: #1a1a1a;
}
button:hover {
  border-color: #646cff;
}
button:focus,
button:focus-visible {
  outline: 4px auto -webkit-focus-ring-color;
}
@keyframes blinking {
  0% {
    border: 1px solid #fff;
  background-color: #470101;

  }
  100% {
    border: 1px solid #000;

  }
}
</style>