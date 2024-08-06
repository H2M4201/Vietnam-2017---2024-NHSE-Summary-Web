import pymysql
import json
import os
from dotenv import load_dotenv
import ast
import pymongo

load_dotenv()
# MySQL connection details
TARGET_YEARS = ast.literal_eval(os.getenv('TARGET_YEARS'))


# get province code
with open(os.environ.get("PROVINCE_CODE_PATH"), 'r', encoding='utf-8') as json_file:
    province_code = list(json.load(json_file).keys())
json_file.close()

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

#----------------------------------------------
# done debugging and cleaning
# done debugging and cleaming
def get_expected_student_distribution():
    conn = connect_to_sql()
    expected_total_students = {}
    expected_students_nationwide = [0 for i in range(len(TARGET_YEARS))]

    # find expected students of all provinces in all years
    for pCode in province_code:
        expected_total_students_by_province = []
        if pCode == '00':
            continue

        for i in range(len(TARGET_YEARS)):
            query = f"""
                SELECT MAX(sbd) FROM y{TARGET_YEARS[i]} WHERE sbd LIKE '{pCode}%' 
            """
            query_result = execute_query(conn, query)
            query_result = int(query_result[0][0][2:])
            expected_total_students_by_province.append(query_result)
            expected_students_nationwide[i] += query_result
        
        expected_total_students[pCode] = expected_total_students_by_province

    # add total (nationwide) expected students for all years
    expected_total_students['00'] = expected_students_nationwide

    conn.close()

    return expected_total_students


def get_actual_student_distribution():
    conn = connect_to_sql()
    actual_total_students = {}

    for pCode in province_code:
        actual_total_students_by_province = []

        for year in TARGET_YEARS:
            query = f"""
                SELECT COUNT(*) FROM y{year}
            """
            if pCode != '00':
                query = query + ' ' + f""" WHERE sbd LIKE '{pCode}%'"""
            query_result = execute_query(conn, query)[0][0]
            actual_total_students_by_province.append(query_result)
            
        actual_total_students[pCode] = actual_total_students_by_province

    conn.close()

    return actual_total_students


# done debugging and cleaning
def get_student_category():
    conn = connect_to_sql()
    student_category = {}
    
    for pCode in province_code:
        student_category_by_province = {
            'science': [],
            'social': [],
            'both': [],
            'independent': []
        }

        for year in TARGET_YEARS:
            query_for_science_and_social_attendant = f"""
            SELECT COUNT(DISTINCT(sbd)) FROM y{year} WHERE 
            toan IS NOT NULL
                AND van IS NOT NULL
                AND vatLy IS NOT NULL
                AND hoaHoc IS NOT NULL
                AND sinhHoc IS NOT NULL
                AND lichSu IS NOT NULL
                AND diaLy IS NOT NULL
                AND gdcd IS NOT NULL
            """

            query_for_science_attendant = f"""
            SELECT COUNT(DISTINCT(sbd)) FROM y{year} WHERE 
                toan IS NOT NULL
                AND van IS NOT NULL
                AND vatLy IS NOT NULL
                AND hoaHoc IS NOT NULL
                AND sinhHoc IS NOT NULL
            """

            query_for_social_attendant = f"""
            SELECT COUNT(DISTINCT(sbd)) FROM y{year} WHERE 
                toan IS NOT NULL
                AND van IS NOT NULL
                AND lichSu IS NOT NULL
                AND diaLy IS NOT NULL
                AND gdcd IS NOT NULL
            """

            query_for_independent_attendant = f"""
            SELECT COUNT(DISTINCT(sbd))
            FROM y{year}
            WHERE 
            ( toan IS NULL OR van IS NULL
                OR ( vatLy IS NULL OR hoaHoc IS NULL OR sinhHoc IS NULL)
                AND (lichSu IS NULL OR diaLy IS NULL OR gdcd IS NULL)
            )
            """

            queries = [query_for_science_attendant, query_for_social_attendant, \
                    query_for_science_and_social_attendant, query_for_independent_attendant]
            
            if pCode != '00':
                # filter by province
                province_conditioning = f""" 
                AND sbd LIKE '{pCode}%'
                """
                queries = [query + ' ' + province_conditioning for query in queries]

            query_result = [execute_query(conn, query)[0][0] for query in queries]
            print(query_result)

            student_category_by_province['science'].append(query_result[0])
            student_category_by_province['social'].append(query_result[1])
            student_category_by_province['both'].append(query_result[2])
            student_category_by_province['independent'].append(query_result[3])

        student_category[pCode] = student_category_by_province

    conn.close()

    return student_category

def convert_result_array_to_dict(arr):
    result = {}
    for i in range(len(TARGET_YEARS)):
        result[TARGET_YEARS[i]] = arr[i]

    return result

# done debugging and cleaning
def get_participation_stat_and_save_to_json():
    # getting data for provinces
    expected_participants = get_expected_student_distribution()
    actual_participants = get_actual_student_distribution()
    student_category = get_student_category()

    participation_stat = []
    for pCode in province_code:
        province_stat = {'province_code': pCode, 'participation_stat': {
            'expected': convert_result_array_to_dict(expected_participants[pCode]),
            'actual': convert_result_array_to_dict(actual_participants[pCode]),
            'category': convert_result_array_to_dict(student_category[pCode])
        }}
        participation_stat.append(province_stat)

    with open('participant_stat.json', 'w', encoding='utf-8') as f:
        json.dump(participation_stat, f)
    f.close()

    return participation_stat


def write_participation_stat_to_mongodb(stat):
    client = pymongo.MongoClient('localhost', 27017)
    db = client["THPT"]


if __name__ == "__main__":
    x = get_participation_stat_and_save_to_json()
    print(x)
