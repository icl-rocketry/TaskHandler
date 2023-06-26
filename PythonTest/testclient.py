import asyncio
import socketio

sio = socketio.AsyncClient()

@sio.event
async def connect():
    print('connection established')
    await sio.emit('getRunningTasks',"testing ", namespace='/data_request_handler')

@sio.on('connect', namespace='/data_request_handler')
async def connect_special():
    print('holy fucking shit, client has connected to the namespace')
    await sio.emit('getRunningTasks',"testing ", namespace='/data_request_handler')


@sio.event
async def disconnect():
    print('disconnected from server')

@sio.event(namespace="/data_request_handler")
async def runningTasks(data):
    print(data)

async def main():
    await sio.connect('http://localhost:1337', namespaces=['/data_request_handler'])
    await sio.wait()

if __name__ == '__main__':
    asyncio.run(main())