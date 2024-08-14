import pymongo
import json
import os
import numpy as np
from dotenv import load_dotenv, find_dotenv
import ast
from time import time
import pandas as pd
from collections import Counter

load_dotenv(find_dotenv())
# MySQL connection details
TARGET_YEARS = ast.literal_eval(os.getenv('TARGET_YEARS'))

# get province code
with open(os.environ.get("PROVINCE_CODE_PATH"), 'r', encoding='utf-8') as json_file:
    province_code = list(json.load(json_file).keys())
json_file.close()

subjects = ['toan', 'van', 'ngoaiNgu', 'vatLy', 'hoaHoc', 'sinhHoc', 'lichSu', 'diaLy', 'gdcd']

MONGO_HOST = os.environ.get("MONGO_HOST")
MONGO_PORT = int(os.environ.get("MONGO_PORT"))
MONGO_DATABASE = os.environ.get("MONGO_DATABASE")
MONGO_COLLECTION = os.environ.get("MONGO_COLLECTION")
DEFAULT_COLLECTION_NAME = 'ScoringStat'


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

def connect_to_mongo_collection():
    client = pymongo.MongoClient(f"mongodb://{MONGO_HOST}:{MONGO_PORT}/{MONGO_DATABASE}")
    db = client[MONGO_DATABASE]
    collection = db[DEFAULT_COLLECTION_NAME]

    return collection

def calculate_average(score_distribution):
    new_stats = ['total', 'average', 'unqualified', 'good', 'underAverage', 'mode']
    total = 0
    weighted_sum = 0

    for score, count in score_distribution.items():
        if score not in new_stats:
            weighted_sum += float(score) * count
            total += count

    average = weighted_sum / total if total != 0 else 0
    return round(average, 3)


def calculate_mode(score_distribution):
    new_stats = ['total', 'average', 'unqualified', 'good', 'underAverage', 'mode']
    max_count = 0
    mode_scores = 0

    for score, count in score_distribution.items():
        if score not in new_stats:
            if count > max_count:
                max_count = count
                mode_scores = float(score)

    # If there's more than one mode, return all of them
    return mode_scores

def update_more_stat():
    new_stats = ['total', 'average', 'unqualified', 'good', 'underAverage', 'mode']
    collection = connect_to_mongo_collection()
    for pCode in province_code:
        query_result = collection.find_one({"province_code": pCode})
        for subject in subjects:
            for year in TARGET_YEARS:
                score_distribution = query_result[subject][str(year)]
                score_distribution['total'] = sum(count for score, count in score_distribution.items() if score not in new_stats)
                score_distribution['average'] = calculate_average(score_distribution)
                score_distribution['mode'] = calculate_mode(score_distribution)
                score_distribution['unqualified'] = \
                    sum(count for score, count in score_distribution.items() if score not in new_stats and float(score) <= 1)
                score_distribution['good'] = \
                    sum(count for score, count in score_distribution.items() if score not in new_stats and float(score) >= 9)
                score_distribution['underAverage'] = \
                    sum(count for score, count in score_distribution.items() if score not in new_stats and float(score) < 5)
            
            collection.update_one({"province_code": pCode}, {"$set": {subject: query_result[subject]}})
        print(pCode, 'updated')

                

if __name__ == '__main__':
    s = time()
    update_more_stat()
    e = time()
    print(e-s)