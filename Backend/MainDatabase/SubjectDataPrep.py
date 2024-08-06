import pymysql
import json
import os
import numpy as np
from dotenv import load_dotenv
import ast

load_dotenv()
# MySQL connection details
TARGET_YEARS = ast.literal_eval(os.getenv('TARGET_YEARS'))

# get province code
with open(os.environ.get("PROVINCE_CODE_PATH"), 'r', encoding='utf-8') as json_file:
    province_code = list(json.load(json_file).keys())
json_file.close()

subjects = ['toan', 'van', 'ngoaiNgu', 'vatLy', 'hoaHoc', 'sinhHoc', 'lichSu', 'diaLy', 'gdcd']

# done debugging and cleaning
def connect_to_sql():
    # Connect to MySQL
    connection = pymysql.connect(
        host = os.environ.get("SQL_HOST"),
        user = os.environ.get("SQL_USER"),
        passwd = os.environ.get("SQL_PASSWORD"),
        db = os.environ.get("SQL_DATABASE")
    )

    return connection

# done debugging and cleaning
def execute_query(conn, query):
    cursor = conn.cursor()
    cursor.execute(query)

    return cursor.fetchall()


def get_average_score():
    conn = connect_to_sql()
    average_score = []
    
    for pCode in province_code:
        average_score_by_province = {}

        for subject in subjects:
            average_score_by_subject = []
            for year in TARGET_YEARS:
                query = ''
                if province_code != '00':
                    query = f"""
                        SELECT ROUND(AVG({subject}), 2) FROM y{year} WHERE sbd LIKE '{pCode}%';
                    """
                else:
                    query = f"""
                        SELECT ROUND(AVG({subject}), 2) FROM y{year};
                    """



if __name__ == '__main__':
    pass