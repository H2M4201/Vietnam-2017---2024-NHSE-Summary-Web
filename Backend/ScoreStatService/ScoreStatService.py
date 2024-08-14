import pymongo
import json
import os
from flask import Flask, g, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv, find_dotenv
import ast

load_dotenv(find_dotenv())
TARGET_YEARS = ast.literal_eval(os.getenv('TARGET_YEARS'))
SUBJECTS = os.environ.get("SUBJECTS").split(',')

app = Flask(__name__)
app.config.from_mapping(SECRET_KEY='dev')
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

MONGO_HOST = os.environ.get("MONGO_HOST")
MONGO_PORT = int(os.environ.get("MONGO_PORT"))
MONGO_DATABASE = os.environ.get("MONGO_DATABASE")
MONGO_COLLECTION = os.environ.get("MONGO_COLLECTION")
DEFAULT_COLLECTION_NAME = 'ScoringStat'

class ScoreStatService:
    def __init__(self, db):
        self.collection = db[DEFAULT_COLLECTION_NAME]

    def get_score_distribution_by_year_and_province(self, year, province_code):
        pCode = '0' + str(province_code) if province_code < 10 else str(province_code)
        query_result = self.collection.find_one({"province_code": pCode})
        unused_stats = ['total', 'average', 'unqualified', 'good', 'underAverage', 'mode']

        result = {
                'province_code': pCode,
                'year': year
            }
        
        for subject in SUBJECTS:
            result[subject] = query_result[subject][str(year)]
            for stat in unused_stats:
                result[subject].pop(stat)

        return result
    
    
    def get_key_stats_by_province(self, province_code):
        pCode = '0' + str(province_code) if province_code < 10 else str(province_code)
        query_result = self.collection.find_one({"province_code": pCode})
        print(query_result['toan'])
        key_stats = ['total', 'average', 'unqualified', 'good', 'underAverage', 'mode']
        result = {}

        for subject in SUBJECTS:
            result[subject] = {}
            for stat in key_stats:
                result[subject  ][stat] = {}
                for year in TARGET_YEARS:
                    result[subject][stat][str(year)] = query_result[subject][str(year)][stat]

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

@app.route('/get_key_stat/<int:province_code>', methods=['GET'])
def update_key_stat_charts_by_province(province_code):
    service = ScoreStatService(g.db)
    data = service.get_key_stats_by_province(province_code)
    return jsonify({'success': True, 'data': data})

@app.route('/get_score_distribution/<int:year>/<int:province_code>', methods=['GET'])
def update_score_distribution_charts_by_year_and_by_province(year, province_code):
    service = ScoreStatService(g.db)
    data = service.get_score_distribution_by_year_and_province(year, province_code)
    return jsonify({'success': True, 'data': data})




if __name__ == '__main__':
    port = int(os.environ.get('PORT', 9901))
    app.run(port=port, debug=True, host='0.0.0.0')
