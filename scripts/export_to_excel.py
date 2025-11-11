#!/usr/bin/env python3
"""
Export Google Sheets data to Excel file.
"""

import sys
from google_sheets_reader import GoogleSheetsReader

def main():
    try:
        reader = GoogleSheetsReader()
        output_file = reader.export_to_excel('student_data.xlsx')
        print(f"✅ Exported to {output_file}")
    except Exception as e:
        print(f"❌ Export failed: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()