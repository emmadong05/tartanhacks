import base64

from bson.objectid import ObjectId
from flask import Blueprint, jsonify, make_response, request
from mongo import Mongo, metricsdb
from routes.gpt_video_analyzer import start_analysis

video_bp = Blueprint('video', __name__)


@video_bp.route("/video", methods=["POST"])
def analyze_video():
    data = request.json
    if 'image' not in data:
        return make_response(jsonify({"error": "No image data"}), 400)
    # if 'user_id' not in data:
    #    return make_response(jsonify({"error": "No user id"}), 400)

    image_data = data['image']
    # print("debug image data:", image_data[0:20])
    user_id = ObjectId(request.headers.get("Authorization"))
    # user_id = ObjectId(data['user_id'])

    mydb = Mongo().get_collection('users')
    tagsdb = Mongo().get_collection('tags')
    groupdb = Mongo().get_collection('groups')
    scoresdb = Mongo().get_collection('scores')

    print(user_id)
    myuser = mydb.find_one({"_id": user_id})  # has to be valid
    # user_email = myuser['email']

    print("\n\n WORK", myuser)

    grouplist = myuser['groups']

    for group in grouplist:
        scoreupdate = 0
        # find all tags and run openai analysis on it
        print(groupdb.list_all_connections)
        smalltaglist = groupdb.find_one({'_id': ObjectId(group)})['tags']
        taglistres = []
        for item in smalltaglist:
            taglistres.append(tagsdb.find_one({'_id': item})['name'])
        print("tag list res", taglistres)

        returneddict = start_analysis(image_data, taglistres)

        for item in returneddict:
            # sum up the openais score with tags weights
            # print(item)
            foundtag = tagsdb.find_one(
                {'group_id': ObjectId(group), 'name': item})

            if returneddict[item] > 5:  # filter for small values
                scoreupdate += returneddict[item] * foundtag['score']
                print('\n\n\nAAAAAAA', foundtag['_id'], user_id)
                metricsdb.update_one(
                    {'tag_id': foundtag['_id'], 'user_id': user_id}, {'$inc': {'count': 1}})

            # print("group idea and email", group, user_email)

            filter_criteria = {
                'group': ObjectId(group),
                'user_id': user_id,
            }

            # updatescore for that user
            # print(scoresdb.find().to_list())
            oldscore = scoresdb.find_one(filter_criteria)['score']  # bug here
            newscore = oldscore + scoreupdate

        update_data = {'$set': {'score': newscore}}
        scoresdb.update_one(filter_criteria, update_data)
        mymessage = "Changed " + str(scoreupdate) + " for " + \
            myuser['username'] + ". New score is " + str(newscore)
        print("Changed", scoreupdate, "for",
              myuser['username'], ". New score is", newscore)

    # Process the image data here

    return make_response(jsonify({"status": "success", "message": mymessage}), 200)
