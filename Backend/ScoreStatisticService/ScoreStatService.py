import pymongo
import json
import os
from flask import Flask, g, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv
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
DEFAULT_COLLECTION_NAME = 'ScoreStat'

class ScoreStatService:
    def __init__(self, db):
        self.collection = db[DEFAULT_COLLECTION_NAME]

    def get_participants(self, province_code):
        pCode = '0' + str(province_code) if province_code < 10 else str(province_code)
        query_result = self.collection.find_one({"province_code": pCode})

        result = []
        for year in TARGET_YEARS:
            expected_participants = query_result['participation_stat']['expected'][str(year)]
            actual_participants = query_result['participation_stat']['actual'][str(year)]

            result.append({
                'year': year,
                'expected': expected_participants,
                'actual': actual_participants
            })

        return result

    def get_category(self, province_code):
        pCode = '0' + str(province_code) if province_code < 10 else str(province_code)
        query_result = self.collection.find_one({"province_code": pCode})

        result = []
        for year in TARGET_YEARS:
            science_participants = query_result['participation_stat']['category']['science'][str(year)]
            social_participants = query_result['participation_stat']['category']['social'][str(year)]
            both_participants = query_result['participation_stat']['category']['both'][str(year)]
            independent_participants = query_result['participation_stat']['category']['independent'][str(year)]
            
            result.append({
                'year': year,
                'science': science_participants,
                'social': social_participants,
                'both': both_participants,
                'independent': independent_participants
            })

        return result

    def get_subject_statistic(self, province_code):
        pCode = '0' + str(province_code) if province_code < 10 else str(province_code)
        query_result = self.collection.find_one({"province_code": pCode})

        result = []
        for year in TARGET_YEARS:
            science_participants = query_result['participation_stat']['category']['science'][str(year)]
            social_participants = query_result['participation_stat']['category']['social'][str(year)]
            both_participants = query_result['participation_stat']['category']['both'][str(year)]
            independent_participants = query_result['participation_stat']['category']['independent'][str(year)]

            result.append({
                'year': year,
                'science': science_participants,
                'social': social_participants,
                'both': both_participants,
                'independent': independent_participants
            })

        return result

def get_db():
    if 'db' not in g:
        client = pymongo.MongoClient(f"mongodb://{MONGO_HOST}:{MONGO_PORT}/{MONGO_DATABASE}")
        g.db = client[MONGO_DATABASE]
    return g.db

@app.before_request
def before_request():
    get_db()

@app.teardown_request
def teardown_db(exception):
    db = g.pop('db', None)
    if db is not None:
        db.client.close()

@app.route('/get_participants/<int:province_code>', methods=['GET'])
def update_total_participants_chart_by_province(province_code):
    service = ParticipationStatService(g.db)
    data = service.get_participants(province_code)
    return jsonify({'success': True, 'data': data})

@app.route('/get_category/<int:province_code>', methods=['GET'])
def update_participant_category_chart_by_province(province_code):
    service = ParticipationStatService(g.db)
    data = service.get_category(province_code)
    return jsonify({'success': True, 'data': data})

@app.route('/get_subject_statistic/<int:province_code>', methods=['GET'])
def update_subject_statistic_chart_by_province(province_code):
    service = ParticipationStatService(g.db)
    data = service.get_subject_statistic(province_code)
    return jsonify({'success': True, 'data': data})

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 9900))
    app.run(port=port, debug=True, host='0.0.0.0')
