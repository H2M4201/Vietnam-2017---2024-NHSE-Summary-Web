from flask import Flask, g, jsonify, request
from flask_cors import CORS
import os
from dotenv import load_dotenv
import pymongo
import ast

load_dotenv()
TARGET_YEARS = ast.literal_eval(os.getenv('TARGET_YEARS'))

app = Flask(__name__)
app.config.from_mapping(SECRET_KEY='dev')
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

MONGO_HOST = os.environ.get("MONGO_HOST")
MONGO_PORT = int(os.environ.get("MONGO_PORT"))
MONGO_DATABASE = os.environ.get("MONGO_DATABASE")
MONGO_COLLECTION = os.environ.get("MONGO_COLLECTION")
DEFAULT_COLLECTION_NAME = 'ParticipationStat'


client = pymongo.MongoClient(f"mongodb://{MONGO_HOST}:{MONGO_PORT}/{MONGO_DATABASE}")
db = client[MONGO_DATABASE]

collection = db['ParticipationStat']
documents = collection.find({"province_code": '01'})
doc = documents[0]
expected_participants = doc['participation_stat']['expected']["2017"]
actual_participants = doc['participation_stat']['actual']["2017"]
print(expected_participants, actual_participants)