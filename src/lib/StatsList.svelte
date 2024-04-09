<script>
  // Standard imports
  import { onMount, onDestroy } from "svelte";

  // Export statistics list
  export let statistics;

  // Declare variable for rate calculation task
  let rateCalculation;

  // Declare rate states (and initialise with current values)
  let lastUpdateTime = Date.now();
  let lastTxBytesTotal = statistics.txBytesTotal;
  let lastRxBytesTotal = statistics.rxBytesTotal;

  // Declare variables for data rates
  let txByteRate = 0;
  let rxByteRate = 0;

  function updateRate() {
    // Get current time
    const currentTime = Date.now();

    // Calculate current number of total bytes
    const currentTxBytesTotal = statistics.txBytesTotal;
    const currentRxBytesTotal = statistics.rxBytesTotal;

    // Calculate change since last update
    const deltaTxBytes = currentTxBytesTotal - lastTxBytesTotal;
    const deltaRxBytes = currentRxBytesTotal - lastRxBytesTotal;

    // Calculate number of seconds since last update
    const deltaTime = (currentTime - lastUpdateTime) * 1e-3;

    // Calculate rate
    txByteRate = deltaTxBytes / deltaTime;
    rxByteRate = deltaRxBytes / deltaTime;

    // Clamp rates above zero
    // NOTE: negative rates should happen only when a task is stopped,
    //       causing its packet count/bytes to be zeroised and reducing
    //       the total number of packets
    if (txByteRate < 0.0) {
      txByteRate = NaN;
    }
    if (rxByteRate < 0.0) {
      rxByteRate = NaN;
    }

    // Update states
    lastUpdateTime = currentTime;
    lastTxBytesTotal = currentTxBytesTotal;
    lastRxBytesTotal = currentRxBytesTotal;
  }

  function formatPacketCounter(value) {
    // Return space-delimited string
    return formatThousandDelimited(value);
  }

  function formatBytes(value) {
    // Return space-delimited string
    return formatThousandDelimited(value);
  }

  function formatDatarate(value) {
    // Find intger ceiling
    const value_ = Math.ceil(value);

    // Return dash if NaN
    if (isNaN(value_)) {
      return "-";
    }

    // Return space-delimited string
    return formatThousandDelimited(value_);
  }

  function formatThousandDelimited(value) {
    // Return value with spaces per thousand
    // Solution from: https://stackoverflow.com/a/16637170
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  }

  onMount(() => {
    // Start rate calculation task
    rateCalculation = setInterval(updateRate, 500);
  });

  onDestroy(() => {
    // Stop rate calculation task
    clearInterval(rateCalculation);
  });
</script>

<div>
  <h3>Task Statistics</h3>
</div>
<div class="taskListDiv">
  <table class="table">
    <tr>
      <td> Tx </td>
      <td class="valuecolumn">
        {formatPacketCounter(statistics.txCounterTotal)}
      </td>
      <td> - </td>
    </tr>
    <tr>
      <td> Rx </td>
      <td class="valuecolumn">
        {formatPacketCounter(statistics.rxCounterTotal)}
      </td>
      <td>- </td>
    </tr>

    <tr>
      <td> ΔTx/Rx </td>
      <td class="valuecolumn">
        {formatPacketCounter(
          statistics.rxCounterTotal - statistics.txCounterTotal,
        )}
      </td>
      <td> - </td>
    </tr>

    <tr>
      <td> Tx </td>
      <td class="valuecolumn">
        {formatBytes(statistics.txBytesTotal)}
      </td>
      <td> B </td>
    </tr>
    <tr>
      <td> Rx </td>
      <td class="valuecolumn">
        {formatBytes(statistics.rxBytesTotal)}
      </td>
      <td> B </td>
    </tr>

    <tr>
      <td> Tx </td>
      <td class="valuecolumn">
        {formatDatarate(txByteRate)}
      </td>
      <td> B/s </td>
    </tr>
    <tr>
      <td> Rx </td>
      <td class="valuecolumn">
        {formatDatarate(rxByteRate)}
      </td>
      <td> B/s </td>
    </tr>
  </table>
</div>

<style>
  .valuecolumn {
    min-width: 7.5rem;
    text-align: right;
  }
  .table {
    list-style-type: none;
    padding: 0.5em 0;
    border-spacing: 1em 0;
    text-align: left;
    width: 100%;
    background-color: #1a1a1a;
  }
  .taskListDiv {
    border: 1px solid #ccc;
    width: fit-content;
    max-width: 60%;
    display: inline-block;
  }
</style>
