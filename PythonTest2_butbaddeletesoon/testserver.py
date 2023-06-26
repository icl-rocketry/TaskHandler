import socketio

sio = socketio.Server()
app = socketio.WSGIApp(sio)

@sio.event(namespace='/data_request_handler')
def get_running_tasks(sid):
    print(f'Received getRunningTasks from client {sid}')

    # Emit runningTasks event to the same namespace
    sio.emit('runningTasks', 'hi', namespace='/data_request_handler', room=sid)

if __name__ == '__main__':
    import eventlet
    import eventlet.wsgi

    # Configure the server
    server = eventlet.listen(('localhost', 1337))
    print('Server started on http://localhost:1337')

    # Start the event loop
    eventlet.wsgi.server(server, app)