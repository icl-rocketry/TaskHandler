import socketio

sio = socketio.Client()

@sio.event
def connect():
    print('Connected to server')

    # Emit getRunningTasks event to the /data_request_handler namespace
    sio.emit('getRunningTasks', namespace='/data_request_handler')

@sio.event(namespace='/data_request_handler')
def runningTasks(data):
    print(f'Received runningTasks event: {data}')

@sio.event
def disconnect():
    print('Disconnected from server')

if __name__ == '__main__':
    # Connect to the server
    sio.connect('http://localhost:1337', namespaces=['/data_request_handler'])

    # Start the event loop
    sio.wait()