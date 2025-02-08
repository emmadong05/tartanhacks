from bson import ObjectId
from flask import Blueprint, jsonify, make_response, request
from flask_cors import CORS
from mongo import groupsdb, metricsdb, scoresdb, tagsdb, usersdb
from shared.objectid import objectid_to_str
from shared.status import err, ok

scores_bp = Blueprint("scores", __name__)

CORS(scores_bp)

# aggregae by group name, pull uid and score


@scores_bp.route("/scores", methods=["GET"])
def get_scores():
    group_id = ObjectId(request.args.get("group_id"))
    if not group_id:
        return make_response(jsonify({"error": "Group ID is required."}), 400)

    scores = scoresdb.aggregate([
        {
            "$match": {"group": group_id}
        },
        {
            "$lookup": {
                "from": "users",
                "localField": "user_id",
                "foreignField": "_id",
                "as": "user"
            }
        },
        {
            "$addFields": {
                "user": {"$arrayElemAt": ["$user", 0]}
            }
        },
        {
            "$sort": {"score": -1}
        }
    ]).to_list()

    return ok("Scores found", [objectid_to_str(score) for score in scores], 200)

    # groups = list(groupsdb.aggregate([
    #     {
    #         "$match": {"_id": {"$in": user.get("groups", [])}}
    #     },
    #     {
    #         "$lookup": {
    #             "from": "tags",
    #             "localField": "tags",
    #             "foreignField": "_id",
    #             "as": "tags"
    #         }
    #     }
    # ]))

    # return ok("Groups found", list([objectid_to_str(group) for group in groups]), 200)


@scores_bp.route("/metrics", methods=["GET"])
def get_metrics():
    user_id = ObjectId(request.headers.get("Authorization"))
    group_id = ObjectId(request.args.get("group_id"))

    print("GID", group_id)
    if not group_id:
        return err("Group ID is required", 400)

    metrics = groupsdb.aggregate([
        {
            "$match": {"_id": group_id}
        },
        {
            "$lookup": {
                "from": "tags",
                "localField": "tags",
                "foreignField": "_id",
                "as": "tags"
            }
        },
        {
            "$unwind": "$tags"
        },
        {
            "$lookup": {
                "from": "metrics",
                "localField": "tags._id",
                "foreignField": "tag_id",
                "as": "metrics"
            }
        },
        {
            "$unwind": "$metrics"
        },
        {
            "$match": {"metrics.user_id": user_id}
        },
        {
            "$project": {
                "tag": "$tags.name",
                "count": "$metrics.count"
            }
        }]
    ).to_list()

    return ok("Metrics found", list([objectid_to_str(metric) for metric in metrics]), 200)


# @scores_bp.route("/groups/join", methods=["POST"])
# def join():
#     user_id = ObjectId(request.headers.get("Authorization"))
#     data = request.json
#     print("D", data)
#     if "group_id" not in data:
#         return make_response(jsonify({"error": "Group Id is required."}), 400)

#     group_id = ObjectId(data["group_id"])

#     groupsdb.update_one({"_id": group_id}, {
#                         "$push": {"users": user_id}})
#     usersdb.update_one({"_id": user_id}, {
#                        "$push": {"groups": group_id}})
#     score_id = ObjectId()

#     # scoresdb.update_one({"_id": score_id, email=})
#     return ok("Group joined successfully", str(group_id), 200)


# @scores_bp.route("/groups/create", methods=["POST"])
# def create():
#     user_id = ObjectId(request.headers.get("Authorization"))
#     data = request.json
#     if "group_name" not in data:
#         return make_response(jsonify({"error": "Group Name is required."}), 400)
#     if "group_description" not in data:
#         return make_response(jsonify({"error": "Group Description is required."}), 400)
#     if "tags" not in data:
#         return make_response(jsonify({"error": "Tags are required."}), 400)
#     group_name = data["group_name"]
#     group_description = data["group_description"]
#     tags = data["tags"]

#     inserted_group = groupsdb.insert_one(
#         {
#             "name": group_name,
#             "description": group_description,
#             "users": [user_id],
#             "tags": []
#         }
#     )

#     inserted_tags = tagsdb.insert_many(
#         [
#             {"name": tag["name"], "group_id": inserted_group.inserted_id,
#                 "score": tag["score"]}
#             for tag in tags
#         ]
#     ).inserted_ids

#     groupsdb.update_one({"_id": inserted_group.inserted_id}, {
#                         "$set": {"tags": inserted_tags}})

#     usersdb.update_one({"_id": user_id}, {
#                        "$push": {"groups": inserted_group.inserted_id}})

#     return ok("Group created successfully", str(inserted_group.inserted_id), 200)
