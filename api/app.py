import base64
import os

import openai
from dotenv import load_dotenv
from flask import Flask, flash, jsonify, redirect, render_template, request, url_for
from openai import OpenAI

app = Flask(__name__)


@app.route("/")
def index():
    return "hello world"
    # return render_template("index.html", posts=posts)


# Set your OpenAI API key (best practice is to store this in an environment variable)
# Get the key from environment variables
openai.api_key = os.getenv("OPENAI_API_KEY")
if not openai.api_key:
    raise ValueError("OPENAI_API_KEY environment variable not set.")


@app.route("/analyze", methods=["POST"])
def analyze_blob():
    data = request.json
    if 'image' not in data:
        return jsonify({"error": "No image data"}), 400

    image_data = base64.b64decode(data['image'])

    return "success"


if __name__ == "__main__":
    app.run(debug=True)  # Set debug=False in production

"""
@app.route("/about")
def about():
    return render_template("about.html")


@app.route("/contact", methods=["GET", "POST"])
def contact():
    if request.method == "POST":
        name = request.form.get("name")
        email = request.form.get("email")
        message = request.form.get("message")

        # Process the form data (e.g., send an email, store in a database)
        # Placeholder
        print(f"Name: {name}, Email: {email}, Message: {message}")

        flash("Message sent successfully!")  # Display a success message
        # Redirect to prevent form resubmission
        return redirect(url_for("contact"))

    return render_template("contact.html")


@app.route("/create", methods=["GET", "POST"])
def create_post():
    if request.method == "POST":
        title = request.form.get("title")
        content = request.form.get("content")

        if title and content:  # Basic validation
            # In a real app, you would interact with a database here.
            posts.append({"title": title, "content": content})
            flash("Post created successfully!")
            # Redirect to the home page after creating a post
            return redirect(url_for("index"))
        else:
            # Display an error message
            flash("Title and content are required.")

    return render_template("create.html")

"""
if __name__ == "__main__":
    # load dotenv
    load_dotenv()
    app.run(debug=True)  # Set debug=False in production
