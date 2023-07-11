<script>
    import { onMount, onDestroy } from 'svelte';
    import io from 'socket.io-client';
  
    import iclrLogo from '$lib/assets/ICLR-LOGO.png'
    import fakeJson from '$lib/assets/fakeJson.json'
    
    import NiceButton from '$lib/NiceButton.svelte';
    import TasksList from '$lib/TasksList.svelte'
    import JSONEditor from '$lib/JSONEditor.svelte';
    import ConsoleBox from '$lib/ConsoleBox.svelte';
    
    let tasks = []
    //tasks = fakeJson
    let taskCopy = "Click on a task to edit it"
  
    let poll_interval;
    let socket;
    let poll_time = 0
    let log = ""
    
  
  
  
    function checkDeltaPoll() {
      if(Date.now() - poll_time > 100){
        poll_time = Date.now()
        socket.emit('getRunningTasks')  
      }
    }
  
    onMount(() => {
      socket = io('http://localhost:1337/data_request_handler')
  
      socket.on('connect', () => {
        poll_interval = setInterval(checkDeltaPoll, 1);
      })
      socket.on('runningTasks', (data) => {
          tasks = data
      })
  
    })
  
    onDestroy(() => {
      clearInterval(poll_interval);
    })
  
    function onSelectTask(event){
      var taskIndex = tasks.findIndex(function(task) {return task.task_name == event.detail.task_name})
      taskCopy = JSON.stringify(tasks[taskIndex],null,2)
    }

    function onToggleTask(event){
      var taskIndex = tasks.findIndex(function(task) {return task.task_name == event.detail.task_name})
      var taskToToggle = tasks[taskIndex]
      taskToToggle.running = !taskToToggle.running
      socket.emit('newTaskConfig', taskToToggle)
    }

    function onRefreshTasks(){
      socket.emit('getRunningTasks')
      log = log + timeString() + ` Manually sending getRunningTasks \n`
    }
  
    function onNewTask(){
      var newTask = {...fakeJson[0]} //Creates a copy instead of referencing fakeJson
      newTask.task_name = "newtask_" + String(tasks.length)
      taskCopy = JSON.stringify(newTask, null, 2)
    }
  
    function onClearTasks(){
      socket.emit('clearTasks')
      log = log + timeString() + ` Cleared all tasks \n`
    }
  
    function onSaveTask(){
      var taskObject = tryParse(taskCopy)
      socket.emit('saveHandlerConfig', taskObject)
      log = log + timeString() + ` Saving ${taskObject.task_name} \n`
    }
    function onUpdateTask(){
      var taskObject = tryParse(taskCopy)
      socket.emit('newTaskConfig', taskObject)
      log = log + timeString() + ` Pushing ${taskObject.task_name} to Ricardo Backend\n`
    }
  
    function onDeleteTask(){
      var taskObject = tryParse(taskCopy)
      socket.emit('deleteTaskConfig', taskObject)
      log = log + timeString() + ` Deleting ${taskObject.task_name} \n`
      taskCopy = "Click on a task to edit it"
    }
    function tryParse(data){
      try{
        return JSON.parse(data)
      } catch(error){
        const errorString = error.toString()

  
        log = log + timeString() + ` ${errorString} \n`
      }
    }
    function timeString(){
      const now = new Date();
      const hour = now.getHours();
      const minute = now.getMinutes();
      const second = now.getSeconds();
      return `[${hour}:${minute}:${second}]`
    }
</script>
  
<main>
  <div class='container'>
    <div class='left'>
      <div>
        <img src={iclrLogo} class="logo" alt="Vite Logo" />
      </div>
      <h1>Task Handler UI</h1>
      <NiceButton on:click={onRefreshTasks} text='Force Refresh'/>
      <NiceButton on:click={onClearTasks} text='Clear Tasks'/>
      <TasksList tasks={tasks} on:selectTask={onSelectTask} on:toggleTask={onToggleTask}/>
    </div>
    <div class='right'>
      <JSONEditor bind:value={taskCopy}/>
      <NiceButton on:click={onSaveTask} text='Save to disk'/>
      <NiceButton on:click={onNewTask} text='New Task'/>
      <NiceButton on:click={onUpdateTask} text='Push Task'/>
      <NiceButton on:click={onDeleteTask} text='Delete'/>
    </div>
  </div>
  <ConsoleBox value={log}/>
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
