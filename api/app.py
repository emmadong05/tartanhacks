import os

import openai
from dotenv import load_dotenv
from flask import Flask, make_response
from flask_cors import CORS
from routes.auth import auth_bp
from routes.groups import groups_bp
from routes.metadata import metadata_bp
from routes.scores import scores_bp
from routes.users import users_bp
from routes.video import video_bp

# Load environment variables from .env file
load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")
if not openai.api_key:
    raise ValueError("OPENAI_API_KEY environment variable not set.")

app = Flask(__name__)

# Enable CORS for all routes
# CORS(app, resources={r"/*": {"origins": "*", "allow_headers": ["Content-Type", "Authorization"], "methods": [
#      "GET", "POST", "PUT", "DELETE", "OPTIONS"], "supports_credentials": True}})
CORS(app, resources={r"/*": {"origins": "*"}})

# Register routes
app.register_blueprint(video_bp)
app.register_blueprint(auth_bp)
app.register_blueprint(users_bp)
app.register_blueprint(groups_bp)
app.register_blueprint(scores_bp)
app.register_blueprint(metadata_bp)


@app.route("/")
def index():
    return make_response({"status": "success"}, 200)


if __name__ == "__main__":
    app.run(port=4000, debug=True)
