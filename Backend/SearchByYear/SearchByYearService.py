import pymysql
import json
import os
from flask import Flask, g, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv, find_dotenv
import ast
import time
import pandas as pd

load_dotenv(find_dotenv())
TARGET_YEARS = ast.literal_eval(os.getenv('TARGET_YEARS'))

app = Flask(__name__)
app.config.from_mapping(SECRET_KEY='dev')
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

df = pd.read_csv('./MainDatabase/All_score.csv', dtype = {
    'sbd': str,
    'toan': float,
    'van': float,
    'ngoaiNgu': float,
    'vatLy': float,
    'hoaHoc': float,
    'sinhHoc': float,
    'diemTBTuNhien': float,
    'diaLy': float,
    'lichSu': float,
    'gdcd': float,
    'year': int
})

@app.route('/searchStudent/<int:year>/<int:id>', methods=['GET'])
def find_student_score(year, id):
    # Ensure the 'id' (sbd) is treated as a string
    id = '0' + str(id) if id < 10000000 else str(id)


    # Filter the DataFrame using the provided 'year' and 'sbd'
    result = df[(df['year'] == year) & (df['sbd'] == id)]
    
    if result.empty:
        return jsonify({'success': False, 'error': 'ID not found'}), 404
    
    # Drop NaN values and convert the result to a dictionary
    result_dict = result.dropna(axis=1).iloc[0].to_dict()

    return jsonify({'success': True, 'data': result_dict}), 200


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 9902))
    app.run(port=port, debug=True, host='0.0.0.0')


