from bson import ObjectId
from flask import Blueprint, request
from mongo import usersdb
from shared.status import ok

users_bp = Blueprint("users", __name__)


@users_bp.route("/users/validate", methods=["GET"])
def validate_user():
    print("hello\n\n\n", request.headers.get("Authorization"))
    user_id = ObjectId(request.headers.get("Authorization"))

    user = usersdb.find_one({"_id": user_id})

    if not user:
        return ok("User not found", False, 200)
    else:
        return ok("User found", True, 200)
