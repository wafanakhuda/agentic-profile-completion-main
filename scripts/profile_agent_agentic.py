"""
TRULY AGENTIC Profile Completion Agent
Adapted for Next.js integration
"""

import os
import json
import pandas as pd
from datetime import datetime
from typing import TypedDict, List, Dict
from anthropic import Anthropic
from dotenv import load_dotenv

load_dotenv()

client = Anthropic(api_key=os.getenv('ANTHROPIC_API_KEY'))

CONFIG = {
    "excel_file": os.getenv('EXCEL_FILE_PATH', 'student_profiles.xlsx'),
    "deadline": os.getenv('PROFILE_COMPLETION_DEADLINE', '2025-12-31'),
    "form_url": os.getenv('GOOGLE_FORM_URL', 'https://forms.google.com/your-form'),
    "institute_name": "IIIT Dharwad / IIIT Raichur",
    "support_email": os.getenv('SUPPORT_EMAIL', 'support@iiitdwd.ac.in'),
}

class AgenticState(TypedDict):
    messages: List[dict]
    students_data: List[dict]
    decisions: List[dict]
    communications_sent: List[dict]
    agent_reasoning: List[str]

def read_student_data_impl(file_path: str) -> dict:
    try:
        df = pd.read_excel(file_path, engine='openpyxl')
        
        column_map = {
            'Student Name': 'student_name',
            'Roll Number': 'roll_number',
            'Institute Name': 'institute_name',
            'Enrolled program': 'enrolled_program',
            'Stream': 'stream',
            'Date of birth': 'date_of_birth',
            'Gender': 'gender',
            'email address': 'email',
            'Email': 'email',
            'previous education qualification': 'previous_education',
            'primary language': 'primary_language',
            'Nationality': 'nationality',
        }
        
        df = df.rename(columns=column_map)
        
        mandatory_fields = [
            'student_name', 'roll_number', 'institute_name', 
            'enrolled_program', 'stream', 'date_of_birth',
            'gender', 'email', 'previous_education', 
            'primary_language', 'nationality'
        ]
        
        students = []
        for idx, row in df.iterrows():
            missing = []
            for field in mandatory_fields:
                value = row.get(field)
                if pd.isna(value) or value is None or (isinstance(value, str) and value.strip() == ''):
                    missing.append(field)
            
            if missing:
                completion_pct = round((len(mandatory_fields) - len(missing)) / len(mandatory_fields) * 100, 1)
                
                student = {
                    'student_id': f"student_{idx}",
                    'student_name': str(row.get('student_name', 'Unknown')),
                    'roll_number': str(row.get('roll_number', 'N/A')),
                    'email': str(row.get('email', '')),
                    'missing_fields': missing,
                    'completion_percentage': completion_pct,
                }
                students.append(student)
        
        return {
            'success': True,
            'total_students': len(df),
            'incomplete_profiles': len(students),
            'students': students,
        }
        
    except Exception as e:
        return {
            'success': False,
            'error': str(e),
            'students': []
        }

def run_agentic_agent(excel_file: str, dry_run: bool = True):
    initial_state = AgenticState(
        messages=[{
            "role": "user",
            "content": f"Process students from {excel_file}. Analyze each student's profile completion."
        }],
        students_data=[],
        decisions=[],
        communications_sent=[],
        agent_reasoning=[]
    )
    
    return initial_state

if __name__ == "__main__":
    run_agentic_agent(CONFIG['excel_file'], dry_run=True)
