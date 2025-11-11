"""
Production Email Sender
-----------------------

Sends emails via SendGrid or Gmail SMTP with professional templates.
"""

import os
import json
from datetime import datetime
from typing import List, Dict
from dotenv import load_dotenv

load_dotenv()


class ProductionEmailSender:
    """
    Production-ready email sender with multiple provider support.
    """
    
    def __init__(self, provider: str = 'auto'):
        """
        Initialize email sender.
        
        Args:
            provider: 'sendgrid', 'gmail', or 'auto' (auto-detect based on env vars)
        """
        self.provider = provider
        self.client = None
        self.from_email = os.getenv('FROM_EMAIL', 'noreply@iiitdwd.ac.in')
        self.from_name = os.getenv('FROM_NAME', 'IIIT Administration')
        
        self._setup_provider()
    
    def _setup_provider(self):
        """Auto-detect and setup email provider."""
        if self.provider == 'auto':
            # Try SendGrid first
            if os.getenv('SENDGRID_API_KEY'):
                self.provider = 'sendgrid'
            elif os.getenv('GMAIL_ADDRESS') and os.getenv('GMAIL_APP_PASSWORD'):
                self.provider = 'gmail'
            else:
                print("âš ï¸  No email provider configured!")
                print("   Set either SENDGRID_API_KEY or GMAIL credentials in .env")
                return
        
        if self.provider == 'sendgrid':
            self._setup_sendgrid()
        elif self.provider == 'gmail':
            self._setup_gmail()
    
    def _setup_sendgrid(self):
        """Setup SendGrid client."""
        try:
            import sendgrid
            api_key = os.getenv('SENDGRID_API_KEY')
            if not api_key:
                print("âŒ SENDGRID_API_KEY not found in environment")
                return
            
            self.client = sendgrid.SendGridAPIClient(api_key=api_key)
            print("âœ… SendGrid email service initialized")
        except ImportError:
            print("âŒ SendGrid not installed. Run: pip install sendgrid")
    
    def _setup_gmail(self):
        """Setup Gmail SMTP."""
        self.gmail_address = os.getenv('GMAIL_ADDRESS')
        self.gmail_password = os.getenv('GMAIL_APP_PASSWORD')
        
        if not self.gmail_address or not self.gmail_password:
            print("âŒ Gmail credentials not found in environment")
            return
        
        print("âœ… Gmail SMTP service initialized")
    
    def create_html_email(self, student_name: str, message_body: str, 
                         missing_fields: List[str], completion_pct: float,
                         form_url: str) -> str:
        """Create professional HTML email template."""
        
        missing_fields_html = ''.join([f'<li>{field}</li>' for field in missing_fields])
        
        # Progress bar
        progress_color = '#ef4444' if completion_pct < 50 else '#f59e0b' if completion_pct < 75 else '#10b981'
        
        html = f"""<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {{
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #1f2937;
            background-color: #f3f4f6;
            margin: 0;
            padding: 20px;
        }}
        .container {{
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }}
        .header {{
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }}
        .header h1 {{
            margin: 0;
            font-size: 24px;
            font-weight: 600;
        }}
        .progress-section {{
            padding: 20px 30px;
            background: #f9fafb;
            border-bottom: 1px solid #e5e7eb;
        }}
        .progress-label {{
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
            font-size: 14px;
            color: #6b7280;
        }}
        .progress-bar {{
            width: 100%;
            height: 24px;
            background: #e5e7eb;
            border-radius: 12px;
            overflow: hidden;
        }}
        .progress-fill {{
            height: 100%;
            background: {progress_color};
            border-radius: 12px;
            transition: width 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: 600;
            font-size: 12px;
        }}
        .content {{
            padding: 30px;
        }}
        .greeting {{
            font-size: 18px;
            color: #1f2937;
            margin-bottom: 20px;
        }}
        .message {{
            color: #4b5563;
            line-height: 1.8;
            margin-bottom: 25px;
        }}
        .missing-fields {{
            background: #fef3c7;
            border-left: 4px solid #f59e0b;
            padding: 20px;
            border-radius: 8px;
            margin: 25px 0;
        }}
        .missing-fields h3 {{
            margin: 0 0 15px 0;
            color: #92400e;
            font-size: 16px;
        }}
        .missing-fields ul {{
            margin: 0;
            padding-left: 20px;
        }}
        .missing-fields li {{
            color: #78350f;
            margin: 8px 0;
        }}
        .cta-button {{
            display: inline-block;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 14px 32px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            margin: 20px 0;
            transition: transform 0.2s;
        }}
        .cta-button:hover {{
            transform: translateY(-2px);
        }}
        .footer {{
            padding: 25px 30px;
            background: #f9fafb;
            border-top: 1px solid #e5e7eb;
            text-align: center;
        }}
        .footer p {{
            margin: 5px 0;
            font-size: 13px;
            color: #6b7280;
        }}
        .deadline {{
            background: #fee2e2;
            border: 2px solid #fca5a5;
            padding: 15px;
            border-radius: 8px;
            margin: 20px 0;
            text-align: center;
        }}
        .deadline strong {{
            color: #991b1b;
            font-size: 16px;
        }}
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>ðŸŽ“ Profile Completion Required</h1>
        </div>
        
        <div class="progress-section">
            <div class="progress-label">
                <span>Profile Completion</span>
                <span><strong>{completion_pct:.0f}%</strong></span>
            </div>
            <div class="progress-bar">
                <div class="progress-fill" style="width: {completion_pct}%;">
                    {completion_pct:.0f}%
                </div>
            </div>
        </div>
        
        <div class="content">
            <div class="greeting">Dear {student_name},</div>
            
            <div class="message">
                {message_body.replace(chr(10), '<br>')}
            </div>
            
            <div class="missing-fields">
                <h3>âš ï¸ Missing Information ({len(missing_fields)} fields)</h3>
                <ul>
                    {missing_fields_html}
                </ul>
            </div>
            
            <div style="text-align: center;">
                <a href="{form_url}" class="cta-button">
                    ðŸ“ Complete Your Profile Now
                </a>
            </div>
            
            <p style="margin-top: 25px; color: #6b7280; font-size: 14px;">
                If the button doesn't work, copy this link to your browser:<br>
                <a href="{form_url}" style="color: #667eea;">{form_url}</a>
            </p>
        </div>
        
        <div class="footer">
            <p><strong>IIIT Dharwad / IIIT Raichur</strong></p>
            <p>This is an automated message. Please do not reply to this email.</p>
            <p>For support, contact: {os.getenv('SUPPORT_EMAIL', 'support@iiitdwd.ac.in')}</p>
            <p style="margin-top: 15px;">Â© {datetime.now().year} IIIT. All rights reserved.</p>
        </div>
    </div>
</body>
</html>"""
        
        return html
    
    def send_email(self, to: str, subject: str, html_body: str, 
                   plain_body: str = None) -> bool:
        """
        Send email via configured provider.
        
        Args:
            to: Recipient email address
            subject: Email subject
            html_body: HTML formatted email body
            plain_body: Plain text fallback (optional)
            
        Returns:
            bool: True if sent successfully
        """
        if not self.provider or self.provider == 'auto':
            print(f"âŒ No email provider configured")
            return False
        
        try:
            if self.provider == 'sendgrid':
                return self._send_via_sendgrid(to, subject, html_body, plain_body)
            elif self.provider == 'gmail':
                return self._send_via_gmail(to, subject, html_body, plain_body)
        except Exception as e:
            print(f"âŒ Error sending email to {to}: {e}")
            return False
    
    def _send_via_sendgrid(self, to: str, subject: str, 
                          html_body: str, plain_body: str = None) -> bool:
        """Send email via SendGrid."""
        try:
            from sendgrid.helpers.mail import Mail, Email, To, Content
            
            message = Mail(
                from_email=Email(self.from_email, self.from_name),
                to_emails=To(to),
                subject=subject,
                plain_text_content=Content("text/plain", plain_body or "Please view in HTML"),
                html_content=Content("text/html", html_body)
            )
            
            response = self.client.send(message)
            
            if response.status_code in [200, 201, 202]:
                print(f"âœ… Email sent to {to}")
                return True
            else:
                print(f"âŒ SendGrid error: {response.status_code}")
                return False
                
        except Exception as e:
            print(f"âŒ SendGrid error: {e}")
            return False
    
    def _send_via_gmail(self, to: str, subject: str, 
                       html_body: str, plain_body: str = None) -> bool:
        """Send email via Gmail SMTP."""
        try:
            import smtplib
            from email.mime.text import MIMEText
            from email.mime.multipart import MIMEMultipart
            
            msg = MIMEMultipart('alternative')
            msg['Subject'] = subject
            msg['From'] = f"{self.from_name} <{self.gmail_address}>"
            msg['To'] = to
            
            # Add both plain and HTML versions
            if plain_body:
                msg.attach(MIMEText(plain_body, 'plain'))
            msg.attach(MIMEText(html_body, 'html'))
            
            with smtplib.SMTP_SSL('smtp.gmail.com', 465) as server:
                server.login(self.gmail_address, self.gmail_password)
                server.send_message(msg)
            
            print(f"âœ… Email sent to {to} via Gmail")
            return True
            
        except Exception as e:
            print(f"âŒ Gmail SMTP error: {e}")
            return False
    
    def send_batch_emails(self, students: List[Dict], 
                         dry_run: bool = False) -> Dict[str, int]:
        """
        Send emails to multiple students.
        
        Args:
            students: List of student dictionaries with email data
            dry_run: If True, don't actually send emails
            
        Returns:
            dict: Statistics {'sent': int, 'failed': int, 'skipped': int}
        """
        stats = {'sent': 0, 'failed': 0, 'skipped': 0}
        
        for student in students:
            email = student.get('email')
            if not email:
                print(f"âš ï¸  Skipping {student.get('student_name')} - no email address")
                stats['skipped'] += 1
                continue
            
            subject = student.get('message_subject', 'Profile Completion Required')
            plain_body = student.get('final_message', '')
            
            # Create HTML email
            html_body = self.create_html_email(
                student_name=student.get('student_name', 'Student'),
                message_body=plain_body,
                missing_fields=student.get('missing_fields', []),
                completion_pct=student.get('completion_percentage', 0),
                form_url=os.getenv('GOOGLE_FORM_URL', 'https://forms.google.com')
            )
            
            if dry_run:
                print(f"[DRY RUN] Would send to {email}")
                stats['sent'] += 1
            else:
                success = self.send_email(email, subject, html_body, plain_body)
                if success:
                    stats['sent'] += 1
                else:
                    stats['failed'] += 1
        
        return stats


# Tracking sent emails
class EmailTracker:
    """Track sent emails to avoid duplicates and spam."""
    
    def __init__(self, tracking_file: str = 'email_tracking.json'):
        self.tracking_file = tracking_file
        self.tracking_data = self._load_tracking()
    
    def _load_tracking(self) -> Dict:
        """Load tracking data from file."""
        try:
            with open(self.tracking_file, 'r') as f:
                return json.load(f)
        except FileNotFoundError:
            return {}
    
    def _save_tracking(self):
        """Save tracking data to file."""
        with open(self.tracking_file, 'w') as f:
            json.dump(self.tracking_data, f, indent=2)
    
    def log_email_sent(self, recipient_id: str, subject: str):
        """Log that an email was sent."""
        if recipient_id not in self.tracking_data:
            self.tracking_data[recipient_id] = []
        
        self.tracking_data[recipient_id].append({
            'timestamp': datetime.now().isoformat(),
            'subject': subject,
            'status': 'sent'
        })
        
        self._save_tracking()
    
    def can_send_email(self, recipient_id: str, min_hours: int = 48) -> bool:
        """Check if enough time has passed since last email."""
        if recipient_id not in self.tracking_data:
            return True
        
        last_email = max(
            self.tracking_data[recipient_id],
            key=lambda x: x['timestamp']
        )
        
        last_time = datetime.fromisoformat(last_email['timestamp'])
        hours_since = (datetime.now() - last_time).total_seconds() / 3600
        
        return hours_since >= min_hours
    
    def get_send_count(self, recipient_id: str) -> int:
        """Get number of emails sent to recipient."""
        return len(self.tracking_data.get(recipient_id, []))


if __name__ == "__main__":
    # Test email sender
    sender = ProductionEmailSender()
    
    # Test with sample data
    test_student = {
        'student_name': 'Test Student',
        'email': 'test@example.com',
        'missing_fields': ['Roll Number', 'Date of Birth', 'Nationality'],
        'completion_percentage': 73,
        'final_message': 'This is a test message.',
        'message_subject': 'Test: Profile Completion'
    }
    
    print("\nTesting email creation...")
    html = sender.create_html_email(
        student_name=test_student['student_name'],
        message_body=test_student['final_message'],
        missing_fields=test_student['missing_fields'],
        completion_pct=test_student['completion_percentage'],
        form_url='https://forms.google.com/test'
    )
    
    print("âœ… HTML email created successfully")
    print(f"   Provider: {sender.provider}")
