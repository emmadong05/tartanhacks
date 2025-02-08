import os

from dotenv import load_dotenv
from flask import Blueprint, jsonify, make_response, request
from mongo import Mongo
from openai import OpenAI
from pinecone import Pinecone
from shared.status import ok

load_dotenv()
client = OpenAI()
pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
mongo = Mongo()

metadata_bp = Blueprint('metadata', __name__)


def get_embedding(text: str):
    response = client.embeddings.create(
        input=[text],
        model="text-embedding-3-large"
    )
    return response.data[0].embedding


@metadata_bp.route("/metadata", methods=["POST"])
def transcript():
    # Unpack data
    user_id = request.headers.get("Authorization")
    data = request.json
    text = data['text']

    user = mongo.get_collection("users").find_one({"_id": user_id})

    if not user:
        return make_response(jsonify({"error": "User not found."}), 404)

    for group_id in user["groups"]:
        # Get embedding and score against existing tags
        embedding = get_embedding(text)
        index = pc.Index("tartanhacks")
        response = index.query(
            namespace=group_id,
            vector=embedding,
            top_k=3,
            include_values=False,
            include_metadata=True,
        )

        # Generate total score given top tags
        total = 0
        tag_scores = [(match.metadata['text'], match.score)
                      for match in response['matches']]
        for tag, score in tag_scores:
            result = mongo.get_collection("tags").find_one({
                "tag": tag,
                "group_id": group_id
            })
            if result:
                total += result["score"] * score

        print("\n\n\n ADDED: \n\n\n", )
        # Update user score
        mongo.get_collection("scores").update_one(
            {"user_id": user_id, "group_id": group_id},
            {"$inc": {"score": total}}
        )

    return ok("Transcript analyzed", 200)
