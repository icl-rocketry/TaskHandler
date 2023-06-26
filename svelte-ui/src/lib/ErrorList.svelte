<script>
    export let value
  </script>
  
  <h3>Errors</h3>
  <div class='errorListDiv'>
    <pre>{value}</pre>    
  </div>
  <style>
    .errorListDiv{
        border: 1px solid #ccc;
        height: 10vh;
        overflow: auto;
        color: rgb(235, 64, 52);
    }
  </style>