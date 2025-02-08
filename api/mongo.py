import os

from dotenv import load_dotenv
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure

# Load environment variables from .env file
load_dotenv()


class Mongo:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(Mongo, cls).__new__(cls)
            cls._instance._initialize()
        return cls._instance

    def _initialize(self):
        uri = os.getenv("TARTANHACKS_MONGO")
        if not uri:
            raise ValueError("TARTANHACKS_MONGO environment variable not set")
        self._client = MongoClient(uri)
        self._db = self._client.get_default_database()
        self._test_connection()

    def _test_connection(self):
        try:
            self._client.admin.command('ping')
            print("MongoDB connection successful")
        except ConnectionFailure:
            print("MongoDB connection failed")

    def get_collection(self, collection_name: str):
        return self._db[collection_name]

    def list_all_collections(self):
        return self._db.list_collection_names()

# Usage example:
# mongo_helper = MongoDBHelper()
# collection = mongo_helper.get_collection("mycollection")


usersdb = Mongo().get_collection("users")
groupsdb = Mongo().get_collection("groups")
tagsdb = Mongo().get_collection("tags")
scoresdb = Mongo().get_collection("scores")
metricsdb = Mongo().get_collection("metrics")
