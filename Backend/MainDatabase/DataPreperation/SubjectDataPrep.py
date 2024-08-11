import pymysql
import json
import os
import numpy as np
from dotenv import load_dotenv
import ast
from time import time
import pandas as pd
from collections import Counter

load_dotenv()
# MySQL connection details
TARGET_YEARS = ast.literal_eval(os.getenv('TARGET_YEARS'))

# get province code
with open(os.environ.get("PROVINCE_CODE_PATH"), 'r', encoding='utf-8') as json_file:
    province_code = list(json.load(json_file).keys())
json_file.close()

subjects = ['toan', 'van', 'ngoaiNgu', 'vatLy', 'hoaHoc', 'sinhHoc', 'lichSu', 'diaLy', 'gdcd']

df = pd.read_csv('../All_score.csv', dtype = {
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
    

class TotalRecordAnalyzer(ScoreAnalyzer):
    def build_query(self, pCode, subject, year):
        query = f"""
            SELECT COUNT({subject}) FROM y{year}
            WHERE sbd LIKE '{pCode}%' AND {subject} IS NOT NULL
        """
        if pCode == '00':
            query = query.replace(f"sbd LIKE '{pCode}%' AND", '')
        return query

    def process_result(self, query_result):
        return float(query_result[0][0])

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
        return query

    def process_result(self, query_result):
        return float(query_result[0][0])



def get_score_distribution_by_subject(df: pd.DataFrame, pCode: str, subject: str, year: int):
    if pCode != '00':
    # Filter the DataFrame to include rows where 'sbd' starts with the pCode and the subject column is not null
        filtered_df = df[(df['sbd'].str.startswith(pCode)) & (df['year'] == year) & (df[subject].notnull())]
    else:
        filtered_df = df[(df['year'] == year) & (df[subject].notnull())]

    # Group by the subject column and count the occurrences
    grouped_df = filtered_df.groupby(subject).size().reset_index(name='scoreCount')

    # Sort the grouped DataFrame by the subject column
    sorted_df = grouped_df.sort_values(by=subject)

    # Create a full range of scores from 0 to 10 with a step of 0.2
    if subject == 'toan' or subject == 'ngoaiNgu':
        full_range = pd.DataFrame({
            subject: np.round(np.arange(0, 10.2, 0.2, dtype=float), 1)
        })
    else:
        full_range = pd.DataFrame({
            subject: np.round(np.arange(0, 10.25, 0.25, dtype=float), 2)
        })

    # Merge the full range with the sorted dataframe, filling missing values with 0
    full_df = pd.merge(full_range, sorted_df, on=subject, how='left').fillna(0)

    # Ensure 'scoreCount' is of integer type
    full_df['scoreCount'] = full_df['scoreCount'].astype(int)

    # Convert the DataFrame to a dictionary
    result_dict = dict(zip(full_df[subject], full_df['scoreCount']))

    return result_dict

def get_score_distribution():
    score_distribution = []
    for pCode in province_code:
        score_dis_by_province = {
            "province_code": pCode
        }
        for subject in subjects:
            score_dis_by_province[subject] = {}
            for year in TARGET_YEARS:
                score_dis = get_score_distribution_by_subject(df, pCode, subject, year)
                score_dis_by_province[subject][str(year)] = score_dis
        score_distribution.append(score_dis_by_province)
        print(pCode, "data processed!")

    return score_distribution

def write_score_distribution_to_json_file():
    with open('../Processed_Data/score_distribution_stat.json', 'w', encoding='utf-8') as f:
        json.dump(get_score_distribution(), f)
    f.close()

if __name__ == '__main__':
    s = time()
    write_score_distribution_to_json_file()
    e = time()
    print(e-s)