from flask import Flask
from flask_cors import CORS

from .routes import setup_routes


def create_app():
    app = Flask(__name__)

    CORS(app, resources={r"/*": {"origins": "*"}})

    setup_routes(app)
    return app
