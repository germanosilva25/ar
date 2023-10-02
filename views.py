from flask import render_template
from flask_app import FlaskApp


app = FlaskApp(__name__)

app.setup()

@app.route("/")
def index():
    return render_template("index.html")