<script>
  import { onMount, onDestroy } from 'svelte';
  // @ts-ignore
  import io from 'socket.io-client';

  import iclrLogo from './assets/ICLR-LOGO.png'
  import fakeJson from './assets/fakeJson.json'
  
  import NiceButton from './lib/NiceButton.svelte';
  import TasksList from './lib/TasksList.svelte'
  import JSONEditor from './lib/JSONEditor.svelte';
  
  let tasks = []
  //tasks = fakeJson
  let taskCopy = {}

  let poll_interval;
  let socket;
  let poll_time = 0
  



  function checkDeltaPoll() {
    if(Date.now() - poll_time > 10000){
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
        console.log(data)
        tasks = data
    })

  })

  onDestroy(() => {
    clearInterval(poll_interval);
  })

  function onSelectTask(event){
    console.log(event.detail.task_name)
    var taskIndex = tasks.findIndex(function(task) {return task.task_name == event.detail.task_name})
    taskCopy = {...tasks[taskIndex]}
  }
  function onRefreshTasks(){
    socket.emit('getRunningTasks')
  }

  function onNewTask(){
    var newTask = {...fakeJson[0]} //Creates a copy instead of referencing fakeJson
    newTask.task_name = "newtask_" + String(tasks.length)
    tasks.push(newTask)
    tasks = tasks
    console.log(tasks)
  }

  function onClearTasks(){
    socket.emit('clearTasks')
  }

  function onSaveTask(){
    socket.emit('saveHandlerConfig', taskCopy)
  }
  function onUpdateTask(){
    socket.emit('newTaskConfig', taskCopy)
  }

  function onDeleteTask(){
    socket.emit('deleteTaskConfig',taskCopy)
  }
</script>

<main>
  <div class='container'>
    <div class='left'>
      <div>
        <img src={iclrLogo} class="logo" alt="Vite Logo" />
      </div>
      <h1>Task Handler UI</h1>
    
      <div class="card">
        <NiceButton on:click={onRefreshTasks} text='Refresh'/>
      </div>
    
      <div class="card">
        <TasksList tasks={tasks} on:selectTask={onSelectTask}/>
      </div>
    
      <NiceButton on:click={onNewTask} text='New Task'/>
      <NiceButton on:click={onClearTasks} text='Clear Tasks'/>
    </div>
    <div class='right'>
      <JSONEditor task={taskCopy}/>
      <NiceButton on:click={onSaveTask} text='Save to disk'/>
      <NiceButton on:click={onUpdateTask} text='Update task'/>
      <NiceButton on:click={onDeleteTask} text='Delete'/>
    </div>
  </div>
</main>

<style>
  .logo {
    height: 6em;
    padding: 1.5em;
    will-change: filter;
    transition: filter 300ms;
  }
  .logo:hover {
    filter: drop-shadow(0 0 2em #646cffaa);
  }
  .container {
    display: flex;
  }
  .right {
    min-width:40vw;
  }
</style>
