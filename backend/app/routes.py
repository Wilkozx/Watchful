from flask import Blueprint, jsonify, request
import requests
def setup_routes(app):
    main = Blueprint('main', __name__)
    app.register_blueprint(main)
