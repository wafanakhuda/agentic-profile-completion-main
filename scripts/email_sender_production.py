"""
Production Email Sender with SendGrid Integration
"""

import os
from datetime import datetime
from typing import List, Dict
from dotenv import load_dotenv

load_dotenv()

class ProductionEmailSender:
    def __init__(self, provider: str = 'auto'):
        self.provider = provider
        self.client = None
        self.from_email = os.getenv('FROM_EMAIL', 'noreply@iiitdwd.ac.in')
        self.from_name = os.getenv('FROM_NAME', 'IIIT Administration')
        self._setup_provider()
    
    def _setup_provider(self):
        if self.provider == 'auto':
            if os.getenv('SENDGRID_API_KEY'):
                self.provider = 'sendgrid'
            elif os.getenv('GMAIL_ADDRESS') and os.getenv('GMAIL_APP_PASSWORD'):
                self.provider = 'gmail'
            return
        
        if self.provider == 'sendgrid':
            self._setup_sendgrid()
        elif self.provider == 'gmail':
            self._setup_gmail()
    
    def _setup_sendgrid(self):
        try:
            import sendgrid
            api_key = os.getenv('SENDGRID_API_KEY')
            if api_key:
                self.client = sendgrid.SendGridAPIClient(api_key=api_key)
        except ImportError:
            pass
    
    def _setup_gmail(self):
        self.gmail_address = os.getenv('GMAIL_ADDRESS')
        self.gmail_password = os.getenv('GMAIL_APP_PASSWORD')
    
    def create_html_email(self, student_name: str, message_body: str, 
                         missing_fields: List[str], completion_pct: float,
                         form_url: str) -> str:
        
        missing_fields_html = ''.join([f'<li>{field}</li>' for field in missing_fields])
        progress_color = '#ef4444' if completion_pct < 50 else '#f59e0b' if completion_pct < 75 else '#10b981'
        
        return f"""<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="font-family: Arial; background: #f3f4f6; margin: 0; padding: 20px;">
    <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 12px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px;">
            <h1>📋 Profile Completion Required</h1>
        </div>
        <div style="padding: 30px;">
            <p>Dear {student_name},</p>
            <p>{message_body}</p>
        </div>
    </div>
</body>
</html>"""

if __name__ == "__main__":
    sender = ProductionEmailSender()
    print(f"Email provider: {sender.provider}")
