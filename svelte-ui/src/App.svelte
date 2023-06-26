<script>
  import { onMount, onDestroy } from 'svelte';
  import io from 'socket.io-client';

  import iclrLogo from './assets/ICLR-LOGO.png'
  import fakeJson from './assets/fakeJson.json'
  
  import NiceButton from './lib/NiceButton.svelte';
  import TasksList from './lib/TasksList.svelte'
  import JSONEditor from './lib/JSONEditor.svelte';
  import ErrorList from './lib/ErrorList.svelte';
  
  let tasks = []
  //tasks = fakeJson
  let taskCopy = "Click on a task to edit it"
  $: console.log("Changed")

  let poll_interval;
  let socket;
  let poll_time = 0
  let errors = ""
  



  function checkDeltaPoll() {
    if(Date.now() - poll_time > 1000){
      poll_time = Date.now()
      socket.emit('getRunningTasks')  
    }
  }

  onMount(() => {
    socket = io('http://localhost:1337/data_request_handler')

    socket.on('connect', () => {
      poll_interval = setInterval(checkDeltaPoll, 100);
    })
    socket.on('runningTasks', (data) => {
        tasks = data
    })

  })

  onDestroy(() => {
    clearInterval(poll_interval);
  })

  function onSelectTask(event){
    console.log(event.detail.task_name)
    var taskIndex = tasks.findIndex(function(task) {return task.task_name == event.detail.task_name})
    taskCopy = JSON.stringify(tasks[taskIndex],null,2)
  }
  function onRefreshTasks(){
    socket.emit('getRunningTasks')
  }

  function onNewTask(){
    var newTask = {...fakeJson[0]} //Creates a copy instead of referencing fakeJson
    newTask.task_name = "newtask_" + String(tasks.length)
    taskCopy = JSON.stringify(newTask, null, 2)
  }

  function onClearTasks(){
    socket.emit('clearTasks')
  }

  function onSaveTask(){
    socket.emit('saveHandlerConfig', tryParse(taskCopy))
  }
  function onUpdateTask(){
    socket.emit('newTaskConfig', tryParse(taskCopy))
  }

  function onDeleteTask(){
    socket.emit('deleteTaskConfig',tryParse(taskCopy))
    taskCopy = ""
  }
  function tryParse(data){
    try{
      return JSON.parse(data)
    } catch(error){
      const errorString = error.toString()
      const now = new Date();
      const hour = now.getHours();
      const minute = now.getMinutes();
      const second = now.getSeconds();

      errors = errors + (`[${hour}:${minute}:${second}] ${errorString} \n`)
    }
  }
</script>

<main>
  <div class='container'>
    <div class='left'>
      <div>
        <img src={iclrLogo} class="logo" alt="Vite Logo" />
      </div>
      <h1>Task Handler UI</h1>
      <NiceButton on:click={onRefreshTasks} text='Manually Refresh'/>
      <NiceButton on:click={onClearTasks} text='Clear Tasks'/>
      <TasksList tasks={tasks} on:selectTask={onSelectTask}/>
    </div>
    <div class='right'>
      <JSONEditor bind:value={taskCopy}/>
      <NiceButton on:click={onSaveTask} text='Save to disk'/>
      <NiceButton on:click={onNewTask} text='New Task'/>
      <NiceButton on:click={onUpdateTask} text='Update task'/>
      <NiceButton on:click={onDeleteTask} text='Delete'/>
    </div>
  </div>
  <ErrorList value={errors}/>
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
  .left{
    margin-right: 100px;
    max-width: 400px;
  }
  .right {
    min-width:40vw;
  }
</style>
