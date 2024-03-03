<script>
  // Standard imports
  import { onMount, onDestroy } from "svelte";

  // Third-party imports
  import io from "socket.io-client";

  // Internal imports
  import ConsoleBox from "$lib/ConsoleBox.svelte";
  import JSONEditor from "$lib/JSONEditor.svelte";
  import NiceButton from "$lib/NiceButton.svelte";
  import TasksList from "$lib/TasksList.svelte";

  // Internal asset imports
  import fakeJson from "$lib/assets/fakeJson.json";
  import iclrLogo from "$lib/assets/ICLR-LOGO.png";

  // Declare list for tasks
  let tasks = [];

  // Declare string for selected task contents
  let taskCopy = "Click on a task to edit it";

  // Declare socket variable
  let socket;

  // Declare polling variables
  let poll_interval;
  let poll_time = 0;

  // Declare string for log messages
  let log = "";

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
      // Start polling task (repeats every 1 ms)
      poll_interval = setInterval(checkDeltaPoll, 1);
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

  function onToggleTask(event) {
    // Find index of task by name
    var taskIndex = tasks.findIndex(function (task) {
      return task.task_name == event.detail.task_name;
    });

    // Extract task from task list
    var taskToToggle = tasks[taskIndex];

    // Toggle run flag
    taskToToggle.running = !taskToToggle.running;

    // Emit message to update task
    socket.emit("newTaskConfig", taskToToggle);
  }

  function onRefreshTasks() {
    // Emit message to request task update
    socket.emit("getRunningTasks");

    // Log task update request
    log = log + timeString() + ` Manually sending getRunningTasks \n`;
  }

  function onNewTask() {
    // Create a copy of the default task JSON
    var newTask = { ...fakeJson[0] };

    // Update task name
    newTask.task_name = "newtask_" + String(tasks.length);

    // Update string for selected task contents
    taskCopy = JSON.stringify(newTask, null, 2);
  }

  function onClearTasks() {
    // Emit message to clear tasks
    socket.emit("clearTasks");

    // Log clearing of tasks
    log = log + timeString() + ` Cleared all tasks \n`;
  }

  function onSaveTask() {
    // Parse selected task contents
    var taskObject = tryParse(taskCopy);

    // Emit message to save task contents
    socket.emit("saveHandlerConfig", taskObject);

    // Log task save
    log = log + timeString() + ` Saving ${taskObject.task_name} \n`;
  }

  function onUpdateTask() {
    // Parse selected task contents
    var taskObject = tryParse(taskCopy);

    // Emit message to update task configuration
    socket.emit("newTaskConfig", taskObject);

    // Log task update
    log =
      log +
      timeString() +
      ` Pushing ${taskObject.task_name} to Ricardo Backend\n`;
  }

  function onDeleteTask() {
    // Parse selected task contents
    var taskObject = tryParse(taskCopy);

    // Emit message to delete task configuration
    socket.emit("deleteTaskConfig", taskObject);

    // Log task deletion
    log = log + timeString() + ` Deleting ${taskObject.task_name} \n`;

    // Reset selected task contents
    taskCopy = "Click on a task to edit it";
  }

  function tryParse(data) {
    try {
      // Return parsed JSON
      return JSON.parse(data);
    } catch (error) {
      // Stringify error message
      const errorString = error.toString();

      // Log error message
      log = log + timeString() + ` ${errorString} \n`;
    }
  }

  function timeString() {
    // Extract current time
    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes();
    const second = now.getSeconds();

    // Return current time string
    return `[${hour}:${minute}:${second}]`;
  }

  function onStartAllTasks() {
    // Loop through tasks
    for (var task of tasks) {
      // Start task
      task.running = true;

      // Emit message to update task run state
      socket.emit("newTaskConfig", task);
    }
  }

  function onStopAllTasks() {
    // Loop through tasks
    for (var task of tasks) {
      // Stop task
      task.running = false;

      // Emit message to update task run state
      socket.emit("newTaskConfig", task);
    }
  }
</script>

<main>
  <div class="container">
    <div class="left">
      <div>
        <img src={iclrLogo} class="logo" alt="Vite Logo" />
      </div>
      <h1>Task Handler UI</h1>
      <NiceButton on:click={onRefreshTasks} text="Force Refresh" />
      <NiceButton on:click={onClearTasks} text="Clear Tasks" />
      <TasksList
        {tasks}
        on:selectTask={onSelectTask}
        on:toggleTask={onToggleTask}
      />
      <NiceButton on:click={onStartAllTasks} text="Start All" />
      <NiceButton on:click={onStopAllTasks} text="Stop All" />
    </div>
    <div class="right">
      <JSONEditor bind:value={taskCopy} />
      <NiceButton on:click={onSaveTask} text="Save to disk" />
      <NiceButton on:click={onNewTask} text="New Task" />
      <NiceButton on:click={onUpdateTask} text="Push Task" />
      <NiceButton on:click={onDeleteTask} text="Delete" />
    </div>
  </div>
  <ConsoleBox value={log} />
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
  .container {
    display: flex;
  }
  .left {
    margin-right: 2vw;
    width: 40vw;
  }
  .right {
    width: 100%;
  }
  :root {
    font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
    line-height: 1.5;
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
