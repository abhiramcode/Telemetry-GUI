# backend/app.py

from flask import Flask, request
from flask_socketio import SocketIO
from mavlink_listener import MavLinkListener

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")  # Allow React frontend


@app.route('/')
def hello():
    return "MAVLink SocketIO Server"


# Emits data to frontend socket
def emit_mav_data(event, data):
    # print(f"[SocketIO] Emitting {event} : data\n")  # DEBUG : Print emitted event
    socketio.emit(event, data)


# Start MAVLink Listener
mav = MavLinkListener(emit_mav_data)
mav.start()

if __name__ == '__main__':
    print("Starting Flask server")
    socketio.run(app, host='0.0.0.0', port=5000, debug=True)
