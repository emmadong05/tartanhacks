import os

from bson import ObjectId
from flask import Blueprint, jsonify, make_response, request
from flask_cors import CORS
from mongo import groupsdb, metricsdb, scoresdb, tagsdb, usersdb
from openai import OpenAI
from pinecone import Pinecone
from shared.objectid import objectid_to_str
from shared.status import err, ok

groups_bp = Blueprint("groups", __name__)
pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
index = pc.Index("tartanhacks")

client = OpenAI()


def embed(text: str, tag_id: ObjectId, group_id: ObjectId):
    response = client.embeddings.create(
        input=[text],
        model="text-embedding-3-large",
        encoding_format="float"
    )
    embedding = response.data[0].embedding
    index.upsert(
        vectors=[
            {
                "id": str(tag_id),
                "values": embedding,
                "metadata": {
                    "text": text
                }
            },
        ],
        namespace=str(group_id)
    )


@groups_bp.route("/groups", methods=["GET"])
def get_groups():
    user_id = ObjectId(request.headers.get("Authorization"))
    user = usersdb.find_one({"_id": user_id})
    if not user:
        return err("Not authorized", 403)

    groups = list(groupsdb.aggregate([
        {
            "$match": {"_id": {"$in": user.get("groups", [])}}
        },
        {
            "$lookup": {
                "from": "tags",
                "localField": "tags",
                "foreignField": "_id",
                "as": "tags"
            }
        }
    ]))

    return ok("Groups found", list([objectid_to_str(group) for group in groups]), 200)


@groups_bp.route("/groups/join", methods=["POST"])
def join():
    user_id = ObjectId(request.headers.get("Authorization"))
    data = request.json
    if "group_id" not in data:
        return make_response(jsonify({"error": "Group Id is required."}), 400)

    group_id = ObjectId(data["group_id"])

    # preexisting = groupsdb.find_one({"_id": group_id})
    # if preexisting is None:
    #     return make_response(jsonify({'error': 'This group does not exist'}))
    # if user_id in preexisting["users"]:
    #     return make_response(jsonify({'error': 'This user is already in the group'}))

    group = groupsdb.find_one({"_id": group_id})
    if not group:
        return err("Group not found", 404)

    if user_id in group["users"]:
        return err("User already in group", 400)

    groupsdb.update_one({"_id": group_id}, {
                        "$push": {"users": user_id}})
    usersdb.update_one({"_id": user_id}, {
                       "$push": {"groups": group_id}})
    user_email = usersdb.find_one({'_id': user_id})['email']
    scoresdb.insert_one({'email': user_email,
                        'group': group_id, 'score': 0, 'user_id': user_id})

    tags = tagsdb.find({"group_id": group_id})
    metricsdb.insert_many([
        {"tag_id": tag["_id"], "user_id": user_id, "count": 0}
        for tag in tags])

    return ok("Group joined successfully", str(group_id), 200)


@groups_bp.route("/groups/create", methods=["POST"])
def create():
    user_id = ObjectId(request.headers.get("Authorization"))
    data = request.json
    if "group_name" not in data:
        return make_response(jsonify({"error": "Group Name is required."}), 400)
    if "group_description" not in data:
        return make_response(jsonify({"error": "Group Description is required."}), 400)
    if "tags" not in data:
        return make_response(jsonify({"error": "Tags are required."}), 400)

    group_name = data["group_name"]
    group_description = data["group_description"]
    tags = data["tags"]

    inserted_group = groupsdb.insert_one(
        {
            "name": group_name,
            "description": group_description,
            "users": [user_id],
            "tags": []
        }
    )

    inserted_tags = tagsdb.insert_many(
        [
            {"name": tag["name"], "group_id": inserted_group.inserted_id,
                "score": tag["score"]}
            for tag in tags
        ]
    ).inserted_ids

    for tag_id, tag in zip(inserted_tags, tags):
        embed(tag["name"], tag_id, inserted_group.inserted_id)

    groupsdb.update_one({"_id": inserted_group.inserted_id}, {
                        "$set": {"tags": inserted_tags}})

    usersdb.update_one({"_id": user_id}, {
                       "$push": {"groups": inserted_group.inserted_id}})
    user_email = usersdb.find_one({'_id': user_id})['email']
    scoresdb.insert_one(
        {'email': user_email, 'group': inserted_group.inserted_id, 'score': 0, 'user_id': user_id})

    metricsdb.insert_many([
        {"tag_id": tag_id, "user_id": user_id, "count": 0} for tag_id in inserted_tags
    ])

    return ok("Group created successfully", str(inserted_group.inserted_id), 200)
