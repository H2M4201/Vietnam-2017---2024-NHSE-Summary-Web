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

class ScoreAnalyzer:
    def __init__(self, province_code, subjects, target_years):
        self.conn = self.connect_to_sql()
        self.province_code = province_code
        self.subjects = subjects
        self.target_years = target_years

    def connect_to_sql(self):
        connection = pymysql.connect(
        host = os.environ.get("SQL_HOST"),
        user = os.environ.get("SQL_USER"),
        passwd = os.environ.get("SQL_PASSWORD"),
        db = os.environ.get("SQL_DATABASE")
        )

        return connection

    def execute_query(self, query):
        # Simulate executing a SQL query
        cursor = self.conn.cursor()
        cursor.execute(query)

        return cursor.fetchall()


    def analyze(self):
        result = {}
        for pCode in self.province_code:
            result_by_province = {}

            for subject in self.subjects:
                result_by_subject = {}
                for year in self.target_years:
                    query = self.build_query(pCode, subject, year)
                    query_result = self.execute_query(query)
                    result_by_subject[str(year)] = self.process_result(query_result)
                
                result_by_province[subject] = result_by_subject

            result[pCode] = result_by_province
        
        return result

    def build_query(self, pCode, subject, year):
        raise NotImplementedError("Subclasses should implement this method.")

    def process_result(self, query_result):
        raise NotImplementedError("Subclasses should implement this method.")
    

class AverageScoreAnalyzer(ScoreAnalyzer):
    def build_query(self, pCode, subject, year):
        query = f"""
            SELECT ROUND(AVG({subject}), 2) FROM y{year} WHERE sbd LIKE '{pCode}%';
        """
        if pCode == '00':
            query = query.replace(f" WHERE sbd LIKE '{pCode}%'", '')
        return query

    def process_result(self, query_result):
        return float(query_result[0][0])


class ModeScoreAnalyzer(ScoreAnalyzer):
    def build_query(self, pCode, subject, year):
        query = f"""
            SELECT {subject}, COUNT({subject}) as scoreCount 
            FROM y{year} 
            WHERE sbd LIKE '{pCode}%'
            GROUP BY {subject}
            ORDER BY scoreCount DESC
            LIMIT 1;
        """
        if pCode == '00':
            query = query.replace(f" WHERE sbd LIKE '{pCode}%'", '')
        return query

    def process_result(self, query_result):
        return float(query_result[0][0])


class FullScoreCountAnalyzer(ScoreAnalyzer):
    def build_query(self, pCode, subject, year):
        query = f"""
            SELECT COUNT({subject}) as scoreCount 
            FROM y{year} 
            WHERE sbd LIKE '{pCode}%' AND {subject} = 10;
        """
        if pCode == '00':
            query = query.replace(f"sbd LIKE '{pCode}%' AND ", '')
        return query

    def process_result(self, query_result):
        return int(query_result[0][0])

class UnqualifiedScoreCountAnalyzer(ScoreAnalyzer):
    def build_query(self, pCode, subject, year):
        query = f"""
            SELECT COUNT({subject}) as scoreCount 
            FROM y{year} 
            WHERE sbd LIKE '{pCode}%' AND {subject} <= 1;
        """
        if pCode == '00':
            query = query.replace(f"sbd LIKE '{pCode}%' AND ", '')
        return query

    def process_result(self, query_result):
        return int(query_result[0][0])
    
class UnderAverageScoreAnalyzer(ScoreAnalyzer):
    def build_query(self, pCode, subject, year):
        query = f"""
            SELECT ROUND((COUNT(CASE WHEN {subject} < 5 THEN 1 END)) * 100.0 / COUNT({subject})) AS percentage
            FROM y{year}
            WHERE sbd LIKE '{pCode}%' 
        """
        if pCode == '00':
            query = query.replace(f"WHERE sbd LIKE '{pCode}%'", '') 
        print(query)
        return query

    def process_result(self, query_result):
        return float(query_result[0][0])

# done debugging and cleaning
def execute_query(conn, query):
    cursor = conn.cursor()
    cursor.execute(query)

    return cursor.fetchall()


if __name__ == '__main__':
    x = UnderAverageScoreAnalyzer(['00', '02'], ['toan'], [2018,2019])
    print(x.analyze())