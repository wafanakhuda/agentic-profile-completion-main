"""
Google Sheets Data Reader
-------------------------
Reads student data from Google Sheets (Google Form responses)
"""

import os
import gspread
from google.oauth2.service_account import Credentials
from dotenv import load_dotenv

load_dotenv()

class GoogleSheetsReader:
    """Read data from Google Sheets."""
    
    def __init__(self):
        self.sheet_id = os.getenv('GOOGLE_SHEET_ID')
        self.creds_file = os.getenv('GOOGLE_CREDENTIALS_FILE', 'credentials.json')
        self.client = None
        self._authenticate()
    
    def _authenticate(self):
        """Authenticate with Google Sheets API."""
        try:
            scopes = [
                'https://www.googleapis.com/auth/spreadsheets.readonly',
                'https://www.googleapis.com/auth/drive.readonly'
            ]
            
            credentials = Credentials.from_service_account_file(
                self.creds_file,
                scopes=scopes
            )
            
            self.client = gspread.authorize(credentials)
            print("✅ Google Sheets API authenticated")
            
        except Exception as e:
            print(f"❌ Failed to authenticate with Google Sheets: {e}")
            raise
    
    def read_sheet_data(self, sheet_name: str = None):
        """
        Read all data from Google Sheet.
        
        Args:
            sheet_name: Name of the sheet tab (default: first sheet)
            
        Returns:
            list: List of dictionaries with student data
        """
        try:
            # Open the spreadsheet
            spreadsheet = self.client.open_by_key(self.sheet_id)
            
            # Get the first sheet or specified sheet
            if sheet_name:
                sheet = spreadsheet.worksheet(sheet_name)
            else:
                sheet = spreadsheet.sheet1
            
            # Get all records as list of dictionaries
            records = sheet.get_all_records()
            
            print(f"✅ Read {len(records)} records from Google Sheets")
            
            return records
            
        except Exception as e:
            print(f"❌ Error reading Google Sheets: {e}")
            raise
    
    def get_sheet_as_dataframe(self):
        """Get sheet data as pandas DataFrame."""
        import pandas as pd
        
        records = self.read_sheet_data()
        df = pd.DataFrame(records)
        
        return df
    
    def export_to_excel(self, output_file: str = 'student_data.xlsx'):
        """Export Google Sheets data to Excel file."""
        df = self.get_sheet_as_dataframe()
        df.to_excel(output_file, index=False)
        print(f"✅ Exported to {output_file}")
        return output_file


if __name__ == "__main__":
    # Test the reader
    reader = GoogleSheetsReader()
    data = reader.read_sheet_data()
    
    print(f"\n📊 Found {len(data)} students")
    if data:
        print("\nFirst student:")
        print(data[0])