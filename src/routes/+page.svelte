<script>
  // Standard imports
  import { onMount, onDestroy } from "svelte";

  // Third-party imports
  import io from "socket.io-client";

  // Internal imports
  import ConsoleBox from "$lib/ConsoleBox.svelte";
  import GroupsList from "$lib/GroupsList.svelte";
  import JSONEditor from "$lib/JSONEditor.svelte";
  import NiceButton from "$lib/NiceButton.svelte";
  import StatsList from "$lib/StatsList.svelte";
  import TasksList from "$lib/TasksList.svelte";

  // Internal asset imports
  import fakeJson from "$lib/assets/fakeJson.json";
  import iclrLogo from "$lib/assets/ICLR-LOGO.png";

  // Declare list for tasks
  let tasks = [];

  // Declare reactive list for groups
  $: groups = [...new Set(tasks.map((task) => task.groups).flat())].sort();

  // Declare string for selected task contents
  let taskCopy = "Click on a task to edit it";

  // Declare socket variable
  let socket;

  // Declare connection flag
  let isConnected = false;

  // Define reactive connection status string, based on toggle state
  $: connectionStatus = isConnected ? "Connected" : "Not Connected";

  // Declare polling variables
  let poll_interval;
  let poll_time = 0;

  // Declare string for log messages
  let log = "";

  // Declare reactive statistics object
  $: statistics = {
    rxCounterTotal: tasks.map((task) => task.rxCounter).reduce(sum, 0),
    txCounterTotal: tasks.map((task) => task.txCounter).reduce(sum, 0),
    rxBytesTotal: tasks.map((task) => task.rxBytes).reduce(sum, 0),
    txBytesTotal: tasks.map((task) => task.txBytes).reduce(sum, 0),
  };

  function sum(accumulator, value) {
    // Return accumulated value
    return accumulator + value;
  }

  function checkDeltaPoll() {
    // Check if sufficient time has passed since the last poll (100 ms)
    if (Date.now() - poll_time > 100) {
      // Update last poll time
      poll_time = Date.now();

      // Emit message to request task update
      socket.emit("getRunningTasks");
    }
  }

  onMount(() => {
    // Connect to backend Socket.IO
    // TODO: update URL
    socket = io(
      "http://" +
        location.hostname +
        ":" +
        location.port +
        "/data_request_handler",
    );

    // Set connection callback
    socket.on("connect", () => {
      // Log connection
      updateLog("Connected to backend");

      // Update connection status
      isConnected = true;

      // Start polling task (repeats every 1 ms)
      poll_interval = setInterval(checkDeltaPoll, 1);
    });

    // Set connection callback
    socket.on("disconnect", () => {
      // Log disconnection
      updateLog("Disconnected from backend");

      // Update connection status
      isConnected = false;

      // Stop polling task
      clearInterval(poll_interval);

      // Clear tasks
      tasks = [];
    });

    // Set running tasks callback
    socket.on("runningTasks", (data) => {
      // Update tasks
      tasks = data;

      // Update last poll time
      poll_time = Date.now();
    });
  });

  onDestroy(() => {
    // Stop polling task
    clearInterval(poll_interval);
  });

  function onSelectTask(event) {
    // Find index of task by name
    var taskIndex = tasks.findIndex(function (task) {
      return task.task_name == event.detail.task_name;
    });

    // Update string for selected task contents
    taskCopy = JSON.stringify(tasks[taskIndex], null, 2);
  }

  function startTask(task) {
    // Skip if task is already running
    if (task.running) {
      return;
    }

    // Set task flag to started
    task.running = true;

    // Emit message to update task run state
    socket.emit("newTaskConfig", task);

    // Log task start
    updateLog("Started task " + task.task_name);
  }

  function stopTask(task) {
    // Skip if task is already stopped
    if (!task.running) {
      return;
    }

    // Set task flag to stopped
    task.running = false;

    // Emit message to update task run state
    socket.emit("newTaskConfig", task);

    // Log task stop
    updateLog("Stopped task " + task.task_name);
  }

  function toggleTask(task) {
    // Check if the task is running
    if (task.running) {
      // Stop task
      stopTask(task);
    } else {
      // Start task
      startTask(task);
    }
  }

  function onToggleTask(event) {
    // Find index of task by name
    var taskIndex = tasks.findIndex(function (task) {
      return task.task_name == event.detail.task_name;
    });

    // Extract task from task list
    var task = tasks[taskIndex];

    // Toggle the task
    toggleTask(task);
  }

  function onRefreshTasks() {
    // Emit message to request task update
    socket.emit("getRunningTasks");

    // Log task update request
    updateLog("Manually refreshing tasks");
  }

  function onNewTask() {
    // Create a copy of the default task JSON
    var newTask = { ...fakeJson[0] };

    // Update task name
    // TODO: make more resilient
    newTask.task_name = "newtask_" + String(tasks.length);

    // Update string for selected task contents
    taskCopy = JSON.stringify(newTask, null, 2);
  }

  function onClearTasks() {
    // Emit message to clear tasks
    socket.emit("clearTasks");

    // Log clearing of tasks
    updateLog("Cleared all tasks");
  }

  function onSaveTask() {
    // Parse selected task contents
    var taskObject = tryParse(taskCopy);

    // Emit message to save task contents
    socket.emit("saveHandlerConfig", taskObject);

    // Log task save
    updateLog("Saving " + taskObject.task_name);
  }

  function onUpdateTask() {
    // Parse selected task contents
    var taskObject = tryParse(taskCopy);

    // Emit message to update task configuration
    socket.emit("newTaskConfig", taskObject);

    // Log task update
    updateLog("Pushing " + taskObject.task_name + " to Ricardo Backend");
  }

  function onDeleteTask() {
    // Parse selected task contents
    var taskObject = tryParse(taskCopy);

    // Emit message to delete task configuration
    socket.emit("deleteTaskConfig", taskObject);

    // Reset selected task contents
    taskCopy = "Click on a task to edit it";

    // Log task deletion
    updateLog("Deleting " + taskObject.task_name);
  }

  function onStartAllTasks() {
    // Loop through tasks
    for (var task of tasks) {
      // Start task
      startTask(task);
    }
  }

  function onStopAllTasks() {
    // Loop through tasks
    for (var task of tasks) {
      // Stop task
      stopTask(task);
    }
  }

  function onStartGroupTasks(event) {
    // Extract group name
    const group = event.detail.group_name;

    // Loop through tasks
    for (var task of tasks) {
      // Skip if not part of group
      if (!task.groups.includes(group)) {
        continue;
      }

      // Start task
      startTask(task);
    }
  }

  function onStopGroupTasks(event) {
    // Extract group name
    const group = event.detail.group_name;

    // Loop through tasks
    for (var task of tasks) {
      // Skip if not part of group
      if (!task.groups.includes(group)) {
        continue;
      }

      // Stop task
      stopTask(task);
    }
  }

  function tryParse(data) {
    try {
      // Return parsed JSON
      return JSON.parse(data);
    } catch (error) {
      // Stringify error message
      const errorString = error.toString();

      // Log error message
      updateLog("Failed to parse JSON: " + errorString);
    }
  }

  function updateLog(message) {
    // Get current date
    const date = new Date();

    // Generate current time string
    const nowString = "[" + date.toLocaleTimeString() + "]";

    // Update log
    log = log + nowString + " " + message + "\n";
  }
</script>

<main>
  <div class="title-container">
    <div>
      <img src={iclrLogo} class="logo" alt="Vite Logo" />
    </div>
    <div class="title">
      <h1>Task Handler</h1>
    </div>
  </div>
  <div class="row">
    <div class="column">
      <div>
        <TasksList
          {tasks}
          on:selectTask={onSelectTask}
          on:toggleTask={onToggleTask}
        />
        <p class="button-row">
          <NiceButton on:click={onRefreshTasks} text="Force Refresh" />
          <NiceButton on:click={onClearTasks} text="Clear Tasks" />
        </p>
      </div>
      <div>
        <GroupsList
          {groups}
          on:startGroup={onStartGroupTasks}
          on:stopGroup={onStopGroupTasks}
        />
        <p class="button-row">
          <NiceButton on:click={onStartAllTasks} text="Start All" />
          <NiceButton on:click={onStopAllTasks} text="Stop All" />
        </p>
      </div>
      <div>
        <StatsList {statistics} />
      </div>
    </div>
    <div class="column">
      <JSONEditor bind:value={taskCopy} />
      <p class="button-row">
        <NiceButton on:click={onSaveTask} text="Save to disk" />
        <NiceButton on:click={onNewTask} text="New Task" />
        <NiceButton on:click={onUpdateTask} text="Push Task" />
        <NiceButton on:click={onDeleteTask} text="Delete" />
      </p>
    </div>
  </div>
  <div>
    <ConsoleBox value={log} />
  </div>
</main>

<style>
  .logo {
    height: 6em;

    will-change: filter;
    transition: filter 300ms;
  }
  .logo:hover {
    filter: drop-shadow(0 0 2em #646cffaa);
  }
  .title {
    margin-left: 2em;
  }
  .title-container {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1em;
  }
  .button-row {
    margin-top: 6pt;
    margin-bottom: 6pt;
  }
  .row:after {
    content: "";
    display: table;
    clear: both;
  }
  .column {
    float: left;
    width: 50%;
  }
  @media screen and (max-width: 900px) {
    .column {
      width: 100%;
    }
  }
  :root {
    font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
    font-weight: 400;

    color-scheme: light dark;
    color: rgba(255, 255, 255, 0.87);
    background-color: #242424;

    font-synthesis: none;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    -webkit-text-size-adjust: 100%;
  }
  h1 {
    font-size: 3.2em;
    line-height: 1.1;
  }
  main {
    max-width: 1280px;
    margin: 0 auto;
    padding: 1rem;
    text-align: center;
  }
</style>
