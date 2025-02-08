from flask import Blueprint, jsonify, make_response, request
from mongo import Mongo
from shared.status import err, ok

auth_bp = Blueprint("auth", __name__)

# temp database
users_db = []

users_db = Mongo().get_collection('users')


@auth_bp.route("/register", methods=["POST"])
def register():
    print("we were here -post")
    data = request.json
    if "email" not in data or "username" not in data or "password" not in data:
        return make_response(jsonify({"error": "Email, Username, and Password are required."}), 400)

    email = data["email"]
    username = data["username"]
    password = data["password"]

    found_user = users_db.find_one(
        {'email': email}
    )
    if found_user is not None:
        return make_response(jsonify({"error": "Email is already registered"}), 400)
    else:
        users_db.insert_one(
            {"email": email, "username": username,
                "password": password, 'groups': []}
        )

    return make_response(jsonify({"status": "success", "message": "Registration successful"}), 201)


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.json
    if "email" not in data or "password" not in data:
        return make_response(jsonify({"error": "Email and Password are required."}), 400)

    email = data["email"]
    password = data["password"]

    found_user = users_db.find_one(
        {'email': email,
         'password': password
         }
    )

    if found_user is not None:
        token = str(found_user['_id'])
        return ok("Login succesful", {"token": token}, 200)
    else:
        return err("Invalid email or password", 401)
