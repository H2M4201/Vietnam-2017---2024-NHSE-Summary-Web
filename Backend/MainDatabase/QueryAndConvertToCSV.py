import os
from dotenv import load_dotenv
import pandas as pd
from sqlalchemy import create_engine
import ast

load_dotenv()  # Load environment variables from .env file

TARGET_YEARS = ast.literal_eval(os.getenv('TARGET_YEARS'))
CSV_FILEPATH = os.environ.get("CSV_DATABASE_PATH")

def connect_to_sql():
    host = os.environ.get("SQL_HOST")
    user = os.environ.get("SQL_USER")
    passwd = os.environ.get("SQL_PASSWORD")
    db = os.environ.get("SQL_DATABASE")
    port = int(os.environ.get("SQL_PORT"))

    connection = create_engine(f"mysql+pymysql://{user}:{passwd}@{host}:{port}/{db}")
    return connection

def read_data_from_sql_database():
    conn = connect_to_sql()
    result = []
    for year in TARGET_YEARS:
        query = f"""
            SELECT * FROM y{year}
        """
        df = pd.read_sql_query(query, conn)
        df['year'] = year

        if year == TARGET_YEARS[0]:
            result = df
        else:
            result = pd.concat([result, df])

    result.to_csv(CSV_FILEPATH, index=False)

if __name__ == '__main__':
    read_data_from_sql_database()
    
