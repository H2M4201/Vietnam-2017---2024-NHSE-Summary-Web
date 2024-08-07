import pytest
from unittest.mock import patch, MagicMock
from MainDatabase.DataPreperation.SubjectDataPrep import *

@pytest.fixture
def province_code():
    return ['00', '02']

@pytest.fixture
def subjects():
    return ['Toan', 'Van']

@pytest.fixture
def target_years():
    return [2018, 2019]

def get_average_score(province_code, subjects, target_years):
    average_score_analyzer = AverageScoreAnalyzer(province_code, subjects, target_years)
    return average_score_analyzer.analyze()

def get_mode_score(province_code, subjects, target_years):
    mode_score_analyzer = ModeScoreAnalyzer(province_code, subjects, target_years)
    return mode_score_analyzer.analyze()

def get_full_score_count(province_code, subjects, target_years):
    average_score_analyzer = FullScoreCountAnalyzer(province_code, subjects, target_years)
    return average_score_analyzer.analyze()

def get_unqualified_score_count(province_code, subjects, target_years):
    mode_score_analyzer = UnqualifiedScoreCountAnalyzer(province_code, subjects, target_years)
    return mode_score_analyzer.analyze()

def get_under_average_score_percentage(province_code, subjects, target_years):
    mode_score_analyzer = UnderAverageScoreAnalyzer(province_code, subjects, target_years)
    return mode_score_analyzer.analyze()



def test_get_average_score(province_code, subjects, target_years):
    # Mock the return values of execute_query
    expected_output = {
        '00': {
            'Toan': {'2018': 4.85, '2019': 5.64},
            'Van': {'2018': 5.45, '2019': 5.48}
        },
        '02': {
            'Toan': {'2018': 5.41, '2019': 6.35},
            'Van': {'2018': 5.39, '2019': 5.97}
        }
    }

    result = get_average_score(province_code, subjects, target_years)

    assert result == expected_output


def test_get_mode_score(province_code, subjects, target_years):
    # Mock the return values of execute_query
    expected_output = {
        '00': {
            'Toan': {'2018': 5.4, '2019': 6.4},
            'Van': {'2018': 6.00, '2019': 6.00}
        },
        '02': {
            'Toan': {'2018': 5.60, '2019': 6.60},
            'Van': {'2018': 5.50, '2019': 6.00}
        }
    }

    result = get_mode_score(province_code, subjects, target_years)
    
    assert result == expected_output


def test_get_unqualified_score_count(province_code, subjects, target_years):
    # Mock the return values of execute_query
    expected_output ={'00': {'toan': {'2018': 1537, '2019': 455}}, '02': {'toan': {'2018': 538, '2019': 3}}}
    result = get_unqualified_score_count(province_code, subjects, target_years)
    assert result == expected_output


def test_get_under_average_score_percentage(province_code, subjects, target_years):
    # Mock the return values of execute_query
    expected_output ={'00': {'toan': {'2018': 50.0, '2019': 34.0}}, '02': {'toan': {'2018': 31.0, '2019': 14.0}}}

    result = get_under_average_score_percentage(province_code, subjects, target_years)
    
    assert result == expected_output


def test_get_full_score_count(province_code, subjects, target_years):
    # Mock the return values of execute_query
    expected_output ={'00': {'toan': {'2018': 2, '2019': 12}}, '02': {'toan': {'2018': 1, '2019': 0}}}

    result = get_full_score_count(province_code, subjects, target_years)
    
    assert result == expected_output
