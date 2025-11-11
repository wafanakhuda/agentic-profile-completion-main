#!/usr/bin/env python3
"""
Fetch student data from Google Sheets and analyze missing fields.
Outputs JSON for the API.
"""

import json
import sys
from google_sheets_reader import GoogleSheetsReader
import pandas as pd

def analyze_students(df):
    """Analyze student data and identify missing fields."""
    
    # Define mandatory fields
    mandatory_fields = [
        'student_name', 'roll_number', 'institute_name',
        'enrolled_program', 'stream', 'date_of_birth',
        'gender', 'email', 'previous_education',
        'primary_language', 'nationality'
    ]
    
    students = []
    
    for idx, row in df.iterrows():
        # Find missing fields
        missing = []
        for field in mandatory_fields:
            value = row.get(field)
            if pd.isna(value) or value is None or (isinstance(value, str) and value.strip() == ''):
                missing.append(field)
        
        # Calculate completion percentage
        completion_pct = round((len(mandatory_fields) - len(missing)) / len(mandatory_fields) * 100, 1)
        
        student = {
            'student_name': str(row.get('student_name', '')),
            'roll_number': str(row.get('roll_number', '')),
            'email': str(row.get('email', '')),
            'institute_name': str(row.get('institute_name', '')),
            'enrolled_program': str(row.get('enrolled_program', '')),
            'stream': str(row.get('stream', '')),
            'date_of_birth': str(row.get('date_of_birth', '')),
            'gender': str(row.get('gender', '')),
            'previous_education': str(row.get('previous_education', '')),
            'primary_language': str(row.get('primary_language', '')),
            'nationality': str(row.get('nationality', '')),
            'missing_fields': missing,
            'completion_percentage': completion_pct
        }
        
        students.append(student)
    
    return students

def main():
    try:
        # Read from Google Sheets
        reader = GoogleSheetsReader()
        df = reader.get_sheet_as_dataframe()
        
        # Normalize column names
        df.columns = df.columns.str.lower().str.replace(' ', '_')
        
        # Analyze students
        students = analyze_students(df)
        
        # Output as JSON
        result = {
            'success': True,
            'total_students': len(students),
            'students': students
        }
        
        print(json.dumps(result))
        
    except Exception as e:
        error_result = {
            'success': False,
            'error': str(e)
        }
        print(json.dumps(error_result))
        sys.exit(1)

if __name__ == "__main__":
    main()