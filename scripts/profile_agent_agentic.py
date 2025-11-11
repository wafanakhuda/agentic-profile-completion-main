"""
TRULY AGENTIC Profile Completion Agent
---------------------------------------

This is a genuinely agentic system where the AI agent:
- Makes strategic decisions about each student
- Chooses which tools to use and when
- Reasons about urgency, tone, and timing
- Adapts its approach based on individual circumstances
- Controls the workflow through its decisions

NO HARDCODED RULES - Agent decides everything!

Author: Wafa (Agentic Version)
Date: November 2025
"""

import os
import json
import pandas as pd
from datetime import datetime, timedelta
from typing import TypedDict, List, Dict, Annotated, Literal
from langgraph.graph import StateGraph, START, END
from langgraph.prebuilt import ToolNode
from anthropic import Anthropic
from dotenv import load_dotenv

load_dotenv()

# Initialize Claude
client = Anthropic(api_key=os.getenv('ANTHROPIC_API_KEY'))

# Configuration
CONFIG = {
    "excel_file": os.getenv('EXCEL_FILE_PATH', 'student_profiles.xlsx'),
    "deadline": os.getenv('PROFILE_COMPLETION_DEADLINE', '2025-12-31'),
    "form_url": os.getenv('GOOGLE_FORM_URL', 'https://forms.google.com/your-form'),
    "institute_name": "IIIT Dharwad / IIIT Raichur",
    "support_email": os.getenv('SUPPORT_EMAIL', 'support@iiitdwd.ac.in'),
}


# ============================================================================
# STATE DEFINITION
# ============================================================================

class AgenticState(TypedDict):
    """State that the agent maintains throughout its workflow."""
    messages: List[dict]  # Conversation with agent
    students_data: List[dict]  # All student records
    current_student_index: int  # Which student we're processing
    decisions: List[dict]  # Agent's decisions for each student
    communications_sent: List[dict]  # Record of sent messages
    agent_reasoning: List[str]  # Agent's explanations
    should_continue: bool  # Whether to process more students
    error_log: List[str]  # Any errors encountered


# ============================================================================
# TOOL IMPLEMENTATIONS
# ============================================================================

def read_student_data_impl(file_path: str) -> dict:
    """
    Read student data from Excel file.
    Returns student records and metadata.
    """
    try:
        df = pd.read_excel(file_path, engine='openpyxl')
        
        # Column mapping
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
        
        # Define mandatory fields
        mandatory_fields = [
            'student_name', 'roll_number', 'institute_name', 
            'enrolled_program', 'stream', 'date_of_birth',
            'gender', 'email', 'previous_education', 
            'primary_language', 'nationality'
        ]
        
        students = []
        for idx, row in df.iterrows():
            # Calculate missing fields
            missing = []
            for field in mandatory_fields:
                value = row.get(field)
                if pd.isna(value) or value is None or (isinstance(value, str) and value.strip() == ''):
                    missing.append(field)
            
            # Only include students with missing fields
            if missing:
                completion_pct = round((len(mandatory_fields) - len(missing)) / len(mandatory_fields) * 100, 1)
                
                student = {
                    'student_id': f"student_{idx}",
                    'student_name': row.get('student_name', 'Unknown'),
                    'roll_number': row.get('roll_number', 'N/A'),
                    'email': row.get('email', ''),
                    'institute_name': row.get('institute_name', ''),
                    'enrolled_program': row.get('enrolled_program', ''),
                    'stream': row.get('stream', ''),
                    'missing_fields': missing,
                    'completion_percentage': completion_pct,
                    'total_fields': len(mandatory_fields),
                    'row_index': idx
                }
                students.append(student)
        
        return {
            'success': True,
            'total_students': len(df),
            'incomplete_profiles': len(students),
            'students': students,
            'message': f"Found {len(students)} students with incomplete profiles out of {len(df)} total"
        }
        
    except Exception as e:
        return {
            'success': False,
            'error': str(e),
            'students': []
        }


def check_communication_history_impl(student_id: str) -> dict:
    """
    Check past communications with a student.
    Returns history of when and what was sent.
    """
    tracking_file = 'email_tracking.json'
    
    try:
        if os.path.exists(tracking_file):
            with open(tracking_file, 'r') as f:
                tracking_data = json.load(f)
        else:
            tracking_data = {}
        
        history = tracking_data.get(student_id, [])
        
        if not history:
            return {
                'contacted_before': False,
                'last_contact': None,
                'contact_count': 0,
                'message': 'No previous communications found'
            }
        
        last_contact = max(history, key=lambda x: x['timestamp'])
        last_time = datetime.fromisoformat(last_contact['timestamp'])
        hours_since = (datetime.now() - last_time).total_seconds() / 3600
        
        return {
            'contacted_before': True,
            'last_contact': last_contact['timestamp'],
            'hours_since_last_contact': round(hours_since, 1),
            'contact_count': len(history),
            'recent_subjects': [h['subject'] for h in history[-3:]],
            'message': f"Contacted {len(history)} times, last {round(hours_since, 1)} hours ago"
        }
        
    except Exception as e:
        return {
            'error': str(e),
            'contacted_before': False
        }


def analyze_profile_status_impl(student_data: dict) -> dict:
    """
    Deep analysis of a student's profile completion status.
    Provides context for agent decision-making.
    """
    try:
        completion_pct = student_data.get('completion_percentage', 0)
        missing_count = len(student_data.get('missing_fields', []))
        
        # Calculate days to deadline
        try:
            deadline = datetime.strptime(CONFIG['deadline'], '%Y-%m-%d')
            days_remaining = (deadline - datetime.now()).days
        except:
            days_remaining = 30
        
        # Critical missing fields (most important)
        critical_fields = ['email', 'roll_number', 'student_name']
        missing_critical = [f for f in student_data.get('missing_fields', []) 
                          if f in critical_fields]
        
        analysis = {
            'completion_percentage': completion_pct,
            'missing_fields_count': missing_count,
            'missing_fields': student_data.get('missing_fields', []),
            'critical_missing': missing_critical,
            'days_to_deadline': days_remaining,
            'deadline_status': 'critical' if days_remaining < 7 else 'urgent' if days_remaining < 14 else 'normal',
            'completion_status': 'critical' if completion_pct < 40 else 'needs_attention' if completion_pct < 70 else 'almost_complete',
            'has_email': bool(student_data.get('email')),
            'message': f"{completion_pct}% complete with {missing_count} missing fields, {days_remaining} days remaining"
        }
        
        return analysis
        
    except Exception as e:
        return {'error': str(e)}


def draft_message_impl(student_name: str, student_data: dict, tone: str, urgency: str, reasoning: str) -> dict:
    """
    Draft a personalized message based on agent's strategic decision.
    The agent has already decided tone and urgency - we just format it nicely.
    """
    try:
        missing_fields = student_data.get('missing_fields', [])
        completion_pct = student_data.get('completion_percentage', 0)
        
        # Field display names
        field_names = {
            'student_name': 'Student Name',
            'roll_number': 'Roll Number',
            'institute_name': 'Institute Name',
            'enrolled_program': 'Enrolled Program',
            'stream': 'Stream',
            'date_of_birth': 'Date of Birth',
            'gender': 'Gender',
            'email': 'Email Address',
            'previous_education': 'Previous Education Qualification',
            'primary_language': 'Primary Language',
            'nationality': 'Nationality'
        }
        
        missing_display = [field_names.get(f, f) for f in missing_fields]
        missing_list = '\n'.join([f"  • {field}" for field in missing_display])
        
        # Tone variations
        greeting_map = {
            'friendly': f"Dear {student_name},\n\nI hope this message finds you well!",
            'professional': f"Dear {student_name},",
            'urgent': f"Dear {student_name},\n\nThis is an important reminder.",
            'gentle': f"Hello {student_name},\n\nHope you're doing great!"
        }
        
        urgency_message = {
            'high': f"Your profile is currently at {completion_pct}% completion with only {CONFIG['deadline']} as the deadline. Immediate action is required.",
            'medium': f"Your profile is {completion_pct}% complete. We kindly request you to update the remaining information soon.",
            'low': f"We noticed your profile is {completion_pct}% complete. When you have a moment, please consider completing the remaining fields."
        }
        
        greeting = greeting_map.get(tone.lower(), greeting_map['professional'])
        urgency_text = urgency_message.get(urgency.lower(), urgency_message['medium'])
        
        message_body = f"""{greeting}

{urgency_text}

To ensure you have seamless access to all university services and resources, please update the following information:

{missing_list}

You can complete your profile here:
{CONFIG['form_url']}

If you encounter any issues or have questions, please don't hesitate to contact our support team at {CONFIG['support_email']}.

Best regards,
{CONFIG['institute_name']} Administration

---
Agent's Reasoning: {reasoning}"""
        
        subject_urgency = {
            'high': '🔴 URGENT',
            'medium': '⚠️ Action Required',
            'low': '📋 Reminder'
        }
        
        subject = f"{subject_urgency.get(urgency.lower(), 'Action Required')}: Complete Your Profile - {len(missing_fields)} Fields Missing"
        
        return {
            'success': True,
            'subject': subject,
            'message_body': message_body,
            'tone_used': tone,
            'urgency_used': urgency,
            'character_count': len(message_body)
        }
        
    except Exception as e:
        return {
            'success': False,
            'error': str(e)
        }


def send_email_impl(student_email: str, subject: str, message_body: str, student_id: str, dry_run: bool = True) -> dict:
    """
    Send email to student or simulate sending in dry-run mode.
    """
    if not student_email:
        return {
            'success': False,
            'error': 'No email address provided'
        }
    
    if dry_run:
        return {
            'success': True,
            'sent': False,
            'dry_run': True,
            'message': f'[DRY RUN] Would send email to {student_email}',
            'subject': subject
        }
    
    # In production, this would actually send via SendGrid or Gmail
    # For now, we'll simulate success
    try:
        # Log the communication
        tracking_file = 'email_tracking.json'
        
        if os.path.exists(tracking_file):
            with open(tracking_file, 'r') as f:
                tracking_data = json.load(f)
        else:
            tracking_data = {}
        
        if student_id not in tracking_data:
            tracking_data[student_id] = []
        
        tracking_data[student_id].append({
            'timestamp': datetime.now().isoformat(),
            'subject': subject,
            'status': 'sent',
            'recipient': student_email
        })
        
        with open(tracking_file, 'w') as f:
            json.dump(tracking_data, f, indent=2)
        
        return {
            'success': True,
            'sent': True,
            'dry_run': False,
            'message': f'Email sent successfully to {student_email}',
            'timestamp': datetime.now().isoformat()
        }
        
    except Exception as e:
        return {
            'success': False,
            'error': str(e)
        }


def schedule_for_later_impl(student_id: str, days_to_wait: int, reason: str) -> dict:
    """
    Schedule a student to be contacted later.
    """
    try:
        schedule_file = 'scheduled_contacts.json'
        
        if os.path.exists(schedule_file):
            with open(schedule_file, 'r') as f:
                scheduled = json.load(f)
        else:
            scheduled = []
        
        contact_date = datetime.now() + timedelta(days=days_to_wait)
        
        scheduled.append({
            'student_id': student_id,
            'scheduled_for': contact_date.isoformat(),
            'reason': reason,
            'created_at': datetime.now().isoformat()
        })
        
        with open(schedule_file, 'w') as f:
            json.dump(scheduled, f, indent=2)
        
        return {
            'success': True,
            'scheduled_for': contact_date.strftime('%Y-%m-%d'),
            'days_to_wait': days_to_wait,
            'message': f'Scheduled contact for {days_to_wait} days from now'
        }
        
    except Exception as e:
        return {
            'success': False,
            'error': str(e)
        }


# ============================================================================
# TOOL DEFINITIONS FOR CLAUDE
# ============================================================================

TOOLS = [
    {
        "name": "read_student_data",
        "description": "Read student profile data from Excel file. Use this first to get the list of students who need to complete their profiles. Returns all students with incomplete profiles and their details.",
        "input_schema": {
            "type": "object",
            "properties": {
                "file_path": {
                    "type": "string",
                    "description": "Path to the Excel file containing student data"
                }
            },
            "required": ["file_path"]
        }
    },
    {
        "name": "check_communication_history",
        "description": "Check if and when this student was previously contacted. Use this before deciding to send a message to avoid spamming students. Returns history of past communications.",
        "input_schema": {
            "type": "object",
            "properties": {
                "student_id": {
                    "type": "string",
                    "description": "Unique identifier for the student"
                }
            },
            "required": ["student_id"]
        }
    },
    {
        "name": "analyze_profile_status",
        "description": "Perform deep analysis of a student's profile completion status. Provides detailed context including completion percentage, missing fields, days to deadline, and criticality. Use this to understand the student's situation before making decisions.",
        "input_schema": {
            "type": "object",
            "properties": {
                "student_data": {
                    "type": "object",
                    "description": "Student data object from read_student_data"
                }
            },
            "required": ["student_data"]
        }
    },
    {
        "name": "draft_message",
        "description": "Draft a personalized message for a student based on your strategic analysis. Specify the tone and urgency level you've decided on, along with your reasoning.",
        "input_schema": {
            "type": "object",
            "properties": {
                "student_name": {
                    "type": "string",
                    "description": "Student's name"
                },
                "student_data": {
                    "type": "object",
                    "description": "Student data object"
                },
                "tone": {
                    "type": "string",
                    "enum": ["friendly", "professional", "urgent", "gentle"],
                    "description": "The tone you've strategically chosen for this student"
                },
                "urgency": {
                    "type": "string",
                    "enum": ["low", "medium", "high"],
                    "description": "The urgency level you've determined"
                },
                "reasoning": {
                    "type": "string",
                    "description": "Your reasoning for choosing this tone and urgency"
                }
            },
            "required": ["student_name", "student_data", "tone", "urgency", "reasoning"]
        }
    },
    {
        "name": "send_email",
        "description": "Send the drafted email to the student. Only use this after drafting a message and deciding the student should be contacted now.",
        "input_schema": {
            "type": "object",
            "properties": {
                "student_email": {
                    "type": "string",
                    "description": "Student's email address"
                },
                "subject": {
                    "type": "string",
                    "description": "Email subject line"
                },
                "message_body": {
                    "type": "string",
                    "description": "Email body content"
                },
                "student_id": {
                    "type": "string",
                    "description": "Student identifier for tracking"
                },
                "dry_run": {
                    "type": "boolean",
                    "description": "If true, simulate sending without actually sending"
                }
            },
            "required": ["student_email", "subject", "message_body", "student_id"]
        }
    },
    {
        "name": "schedule_for_later",
        "description": "Schedule a student to be contacted later instead of now. Use this when the student was recently contacted or when waiting would be more strategic.",
        "input_schema": {
            "type": "object",
            "properties": {
                "student_id": {
                    "type": "string",
                    "description": "Student identifier"
                },
                "days_to_wait": {
                    "type": "integer",
                    "description": "Number of days to wait before next contact"
                },
                "reason": {
                    "type": "string",
                    "description": "Your reasoning for scheduling later"
                }
            },
            "required": ["student_id", "days_to_wait", "reason"]
        }
    }
]


# ============================================================================
# TOOL EXECUTION FUNCTION
# ============================================================================

def execute_tool(tool_name: str, tool_input: dict) -> dict:
    """Execute a tool and return results."""
    
    tool_map = {
        'read_student_data': lambda inp: read_student_data_impl(inp['file_path']),
        'check_communication_history': lambda inp: check_communication_history_impl(inp['student_id']),
        'analyze_profile_status': lambda inp: analyze_profile_status_impl(inp['student_data']),
        'draft_message': lambda inp: draft_message_impl(
            inp['student_name'], 
            inp['student_data'], 
            inp['tone'], 
            inp['urgency'],
            inp['reasoning']
        ),
        'send_email': lambda inp: send_email_impl(
            inp['student_email'],
            inp['subject'],
            inp['message_body'],
            inp['student_id'],
            inp.get('dry_run', True)
        ),
        'schedule_for_later': lambda inp: schedule_for_later_impl(
            inp['student_id'],
            inp['days_to_wait'],
            inp['reason']
        )
    }
    
    if tool_name in tool_map:
        try:
            result = tool_map[tool_name](tool_input)
            return result
        except Exception as e:
            return {'error': f"Tool execution failed: {str(e)}"}
    else:
        return {'error': f"Unknown tool: {tool_name}"}


# ============================================================================
# SYSTEM PROMPT FOR THE AGENT
# ============================================================================

AGENT_SYSTEM_PROMPT = """You are an intelligent student engagement agent responsible for helping students complete their profile information.

YOUR MISSION:
Get students to complete their profiles effectively while being thoughtful, strategic, and respectful of their time.

YOUR CAPABILITIES (Tools Available):
1. read_student_data - Load student information from Excel
2. check_communication_history - See if/when we've contacted a student before
3. analyze_profile_status - Deep analysis of a student's completion status
4. draft_message - Create personalized messages
5. send_email - Send messages to students
6. schedule_for_later - Delay contact for strategic reasons

YOUR DECISION-MAKING FRAMEWORK:

🎯 STRATEGIC PRINCIPLES:
1. **Avoid Spam**: ALWAYS check communication history before deciding to send
2. **Personalize Approach**: Different students need different strategies
3. **Consider Context**: Completion %, deadline proximity, previous contacts
4. **Be Thoughtful**: Sometimes NOT contacting is the right move
5. **Explain Reasoning**: Always explain WHY you made each decision

📊 ANALYSIS FACTORS TO CONSIDER:
- **Completion Percentage**: <40% = critical, 40-70% = needs attention, >70% = almost there
- **Days to Deadline**: <7 = urgent, 7-14 = important, >14 = normal
- **Previous Contacts**: 0 = first time, 1-2 = follow-up, 3+ = might be annoying
- **Time Since Last Contact**: <48hrs = too soon!, 48-72hrs = maybe, >72hrs = okay
- **Missing Fields Count**: Many missing = more urgent, few missing = gentle reminder

🎭 TONE SELECTION STRATEGY:
- **Friendly**: First contact, high completion (>70%)
- **Professional**: Standard follow-up, medium completion (40-70%)
- **Urgent**: Low completion (<40%) + deadline approaching
- **Gentle**: Student contacted multiple times already

⚡ URGENCY LEVELS:
- **High**: <40% complete AND <7 days to deadline, OR critical fields missing
- **Medium**: 40-70% complete OR 7-14 days to deadline
- **Low**: >70% complete AND >14 days remaining

🚦 DECISION RULES (Guidelines, not hard rules):
- If contacted <48 hours ago → Schedule for later (wait 3-5 days)
- If contacted 3+ times already → Be more gentle, consider waiting longer
- If >90% complete → Low priority, gentle reminder
- If <30% complete + deadline <7 days → High priority, urgent tone
- If no email address → Skip (can't contact)

YOUR WORKFLOW:
1. Read student data
2. For EACH student:
   a. Analyze their profile status
   b. Check communication history
   c. REASON about what to do:
      - Should I contact them now?
      - What tone and urgency is appropriate?
      - Or should I schedule for later?
   d. Execute your decision with tools
3. Keep track of your decisions and reasoning

IMPORTANT:
- You are autonomous - make decisions, don't ask for permission
- ALWAYS explain your reasoning
- Use tools in a logical sequence
- Adapt your strategy per student
- Sometimes the best action is NO action (wait/skip)

Current Configuration:
- Deadline: {deadline}
- Form URL: {form_url}
- Institute: {institute}

Begin by reading the student data, then process each student strategically!"""


# ============================================================================
# AGENT NODE - THE BRAIN
# ============================================================================

def agent_node(state: AgenticState) -> AgenticState:
    """
    The agent reasoning node - where Claude makes decisions.
    This is where the REAL agentic behavior happens!
    """
    
    messages = state["messages"]
    
    # Call Claude with tools
    response = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=8000,
        system=AGENT_SYSTEM_PROMPT.format(
            deadline=CONFIG['deadline'],
            form_url=CONFIG['form_url'],
            institute=CONFIG['institute_name']
        ),
        tools=TOOLS,
        messages=messages
    )
    
    # Add response to messages
    state["messages"].append({
        "role": "assistant",
        "content": response.content
    })
    
    # Extract any reasoning from the response
    for content in response.content:
        if hasattr(content, 'type') and content.type == 'text':
            state["agent_reasoning"].append(content.text)
    
    return state


# ============================================================================
# TOOL EXECUTION NODE
# ============================================================================

def tool_execution_node(state: AgenticState) -> AgenticState:
    """
    Execute the tools that the agent decided to use.
    """
    
    last_message = state["messages"][-1]
    tool_results = []
    
    # Execute all tool calls in the last message
    for content in last_message["content"]:
        if hasattr(content, 'type') and content.type == 'tool_use':
            tool_name = content.name
            tool_input = content.input
            
            print(f"\n🔧 Agent using tool: {tool_name}")
            print(f"   Input: {json.dumps(tool_input, indent=2)}")
            
            # Execute the tool
            result = execute_tool(tool_name, tool_input)
            
            print(f"   Result: {json.dumps(result, indent=2)[:200]}...")
            
            tool_results.append({
                "type": "tool_result",
                "tool_use_id": content.id,
                "content": json.dumps(result)
            })
    
    # Add tool results to messages
    if tool_results:
        state["messages"].append({
            "role": "user",
            "content": tool_results
        })
    
    return state


# ============================================================================
# DECISION ROUTER
# ============================================================================

def should_continue(state: AgenticState) -> Literal["tools", "end"]:
    """
    Let the AGENT decide if it needs to use more tools or if it's done.
    This is agent-driven flow control!
    """
    
    last_message = state["messages"][-1]
    
    # Safety: Stop if too many iterations
    if len(state["messages"]) > 40:
        print("\n⚠️  Iteration limit reached. Stopping.")
        return "end"
    
    # Check if the agent called any tools
    if last_message["role"] == "assistant":
        for content in last_message["content"]:
            if hasattr(content, 'type') and content.type == 'tool_use':
                return "tools"  # Agent wants to use tools
    
    # Agent is done
    return "end"


# ============================================================================
# BUILD AGENTIC WORKFLOW
# ============================================================================

def build_agentic_workflow():
    """
    Build a workflow where the AGENT controls the flow.
    
    Key differences from your old system:
    1. Agent decides which tools to use
    2. Agent decides when to stop
    3. Conditional edges based on agent decisions
    4. No predetermined path!
    """
    
    workflow = StateGraph(AgenticState)
    
    # Add nodes
    workflow.add_node("agent", agent_node)
    workflow.add_node("tools", tool_execution_node)
    
    # Start with agent reasoning
    workflow.add_edge(START, "agent")
    
    # AGENT DECIDES: Continue with tools or end?
    workflow.add_conditional_edges(
        "agent",
        should_continue,  # Agent-driven decision!
        {
            "tools": "tools",  # Agent chose to use tools
            "end": END         # Agent decided it's done
        }
    )
    
    # After tools, let agent reason again
    workflow.add_edge("tools", "agent")
    
    return workflow.compile()


# ============================================================================
# MAIN EXECUTION
# ============================================================================

def run_agentic_agent(excel_file: str, dry_run: bool = True):
    """
    Run the truly agentic profile completion agent.
    
    Args:
        excel_file: Path to Excel file with student data
        dry_run: If True, simulate sending emails
    """
    
    print("\n" + "="*80)
    print("🤖 TRULY AGENTIC PROFILE COMPLETION AGENT")
    print("="*80)
    print(f"\n📊 Configuration:")
    print(f"   Excel File: {excel_file}")
    print(f"   Deadline: {CONFIG['deadline']}")
    print(f"   Mode: {'DRY RUN (simulation)' if dry_run else 'LIVE (actual sending)'}")
    print(f"   Agent: Claude Sonnet 4")
    print("\n" + "="*80)
    
    # Initial task for the agent
    initial_task = f"""Process students from the Excel file: {excel_file}

For EACH student with an incomplete profile:
1. Analyze their situation thoroughly
2. Check if they've been contacted before
3. Make a strategic decision:
   - Should I contact them now? (consider timing, previous contacts)
   - What tone and urgency is appropriate? (based on completion%, deadline)
   - Or should I wait/schedule for later? (if contacted recently)

Execute your decisions using the available tools.

IMPORTANT: 
- Be strategic, not mechanical
- Explain your reasoning for each decision
- Dry run mode: {'ENABLED' if dry_run else 'DISABLED'}
- After processing ALL students, provide a summary and STOP

Begin!"""
    
    # Initialize state
    initial_state = AgenticState(
        messages=[{
            "role": "user",
            "content": initial_task
        }],
        students_data=[],
        current_student_index=0,
        decisions=[],
        communications_sent=[],
        agent_reasoning=[],
        should_continue=True,
        error_log=[]
    )
    
    # Build and run the agentic workflow
    print("\n🚀 Starting agentic workflow...\n")
    workflow = build_agentic_workflow()
    
    final_state = workflow.invoke(
        initial_state,
        {"recursion_limit": 100}  # Increased limit
    )
    
    # Display results
    print("\n" + "="*80)
    print("📊 AGENT EXECUTION SUMMARY")
    print("="*80)
    
    print(f"\n💭 Agent Reasoning Blocks: {len(final_state['agent_reasoning'])}")
    print(f"📝 Decisions Made: {len(final_state['decisions'])}")
    print(f"✉️  Communications: {len(final_state['communications_sent'])}")
    
    if final_state['agent_reasoning']:
        print("\n🧠 Agent's Final Thoughts:")
        print("─" * 80)
        # Show last reasoning block
        print(final_state['agent_reasoning'][-1][:500] + "...")
    
    print("\n" + "="*80)
    print("✅ AGENTIC WORKFLOW COMPLETED")
    print("="*80)
    
    return final_state


if __name__ == "__main__":
    import sys
    import argparse
    
    parser = argparse.ArgumentParser()
    parser.add_argument('--file', type=str, help='Excel file path')
    parser.add_argument('--source', type=str, choices=['file', 'google-sheets'], default='file')
    parser.add_argument('--dry-run', action='store_true', help='Dry run mode')
    parser.add_argument('--send', action='store_true', help='Live send mode')
    
    args = parser.parse_args()
    
    # Determine dry run mode
    dry_run = not args.send if args.send else True
    
    # Determine data source
    if args.source == 'google-sheets':
        print("\n📊 Using Google Sheets as data source")
        from google_sheets_reader import GoogleSheetsReader
        
        try:
            reader = GoogleSheetsReader()
            excel_file = reader.export_to_excel('temp_student_data.xlsx')
            print(f"✅ Downloaded data from Google Sheets: {excel_file}")
        except Exception as e:
            print(f"❌ Failed to read from Google Sheets: {e}")
            sys.exit(1)
    else:
        excel_file = args.file or CONFIG['excel_file']
    
    print(f"\n🚀 Starting agent with:")
    print(f"   File: {excel_file}")
    print(f"   Mode: {'DRY RUN' if dry_run else 'LIVE'}")
    print(f"   Source: {args.source}")
    
    run_agentic_agent(excel_file=excel_file, dry_run=dry_run)