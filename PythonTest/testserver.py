import eventlet
import socketio

class TestPythonServer():
    def __init__(self):
        sio = socketio.Server()
        app = socketio.WSGIApp(sio)

        @sio.event
        def connect(sid, environ):
            print('connect ', sid)

        @sio.on('connect', namespace='/data_request_handler')
        def connect_special(sid, environ):
            print('SERVER: Connected to data request handler', sid)

        @sio.event
        def my_message(sid, data):
            print('message ', data)

        @sio.event
        def disconnect(sid):
            print('disconnect ', sid)


        @sio.event(namespace="/data_request_handler") 
        def getRunningTasks(sid, data): 
            print("SERVER: getRunningTasks recieved, will now emit runningTasks") 
            sio.emit('runningTasks',"runningtasksjson should be here, but this shows that runningTasks has been emitted to the client", namespace="/data_request_handler") 

        if __name__ == '__main__':
            eventlet.wsgi.server(eventlet.listen(('', 1337)), app)


if __name__ == '__main__':
    testpythonserver = TestPythonServer()