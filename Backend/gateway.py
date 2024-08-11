from flask import Flask, jsonify, request, Response
import requests
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS if needed

# Define the backend service URLs
PARTICIPANT_SERVICE = "http://localhost:9900"
SCORE_STAT_SERVICE = "http://localhost:9901"
SEARCH_RESULT_SERVICE = "http://localhost:9902"


@app.route('/get_participants/<int:province_code>', methods=['GET'])
def proxy_get_participants(province_code):
    response = requests.get(f"{PARTICIPANT_SERVICE}/get_participants/{province_code}", params=request.args)
    return Response(response.content, status=response.status_code, content_type=response.headers['Content-Type'])

@app.route('/get_category/<int:province_code>', methods=['GET'])
def proxy_get_category(province_code):
    response = requests.get(f"{PARTICIPANT_SERVICE}/get_category/{province_code}", params=request.args)
    return Response(response.content, status=response.status_code, content_type=response.headers['Content-Type'])

@app.route('/get_participants_by_year/<int:year>/<int:province_code>', methods=['GET'])
def proxy_get_participants_by_year(province_code, year):
    response = requests.get(f"{PARTICIPANT_SERVICE}/get_participants_by_year/{year}/{province_code}", params=request.args)
    return Response(response.content, status=response.status_code, content_type=response.headers['Content-Type'])

@app.route('/get_category_by_year/<int:year>/<int:province_code>', methods=['GET'])
def proxy_get_category_by_year(province_code, year):
    response = requests.get(f"{PARTICIPANT_SERVICE}/get_category_by_year/{year}/{province_code}", params=request.args)
    return Response(response.content, status=response.status_code, content_type=response.headers['Content-Type'])



# Catch-all route for any undefined endpoints
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):
    return jsonify({'error': 'Not Found'}), 404

if __name__ == '__main__':
    app.run(port=8080, debug=True)