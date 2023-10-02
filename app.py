import os

from socket_io import socketio
from views import app

def string_to_bool(s):
    return s.lower() == "true"

if __name__ == "__main__":
    host = os.getenv("FLASK_RUN_HOST", "0.0.0.0")
    port = int(os.getenv("FLASK_RUN_PORT", 5001))

    socketio.run(app, host=host, port=port)