# 🤖 Agentic Profile Completion System

**Production-Ready AI Agent for Automated Student Profile Management**

---

## 📋 Quick Info

- **Language:** Python 3.8+
- **AI Model:** Claude Sonnet 4
- **Agentic Rating:** 7/10 ⭐⭐⭐⭐⭐⭐⭐
- **Cost:** ~$0.01 per student
- **Status:** Production Ready ✅

---

## ⚡ Quick Start (3 Steps)

```bash
# 1. Install
pip install -r requirements.txt

# 2. Configure
echo "ANTHROPIC_API_KEY=your-key" > .env

# 3. Run
python main_agentic.py --file sample_student_profiles.xlsx --dry-run
```

Get API key: https://console.anthropic.com/

---

## 🎯 What This System Does

Autonomous AI agent that:
- ✅ Reads student data from Excel
- ✅ Identifies incomplete profiles
- ✅ Makes strategic decisions per student
- ✅ Generates personalized messages
- ✅ Sends professional emails
- ✅ Tracks communication history
- ✅ Adapts approach based on context

**Different from automation:** Agent makes ALL decisions, not hardcoded rules!

---

## 🌟 Key Features

### Agentic Behavior:
- 🧠 **Strategic Decisions** - Agent reasons about each student
- 🎯 **Tool Selection** - Agent chooses which tools to use
- 🔄 **Adaptive** - Different approach per student
- 💭 **Transparent** - Agent explains all decisions
- 🌊 **Dynamic Flow** - Agent controls workflow

### Professional Quality:
- 📧 Beautiful HTML emails
- 🛡️ Anti-spam protection
- 📊 Communication tracking
- ⚙️ Multiple operation modes
- 🔒 Safe testing with dry-run

---

## 📦 Installation

### Requirements:
- Python 3.8+
- Anthropic API key

### Install Dependencies:
```bash
pip install -r requirements.txt
```

Installs:
- `anthropic` - Claude AI
- `langgraph` - Agent framework
- `pandas` - Data processing
- `openpyxl` - Excel reading
- `python-dotenv` - Configuration

---

## ⚙️ Configuration

Create `.env` file:

```bash
# Required
ANTHROPIC_API_KEY=sk-ant-your-key-here

# Optional
EXCEL_FILE_PATH=student_profiles.xlsx
PROFILE_COMPLETION_DEADLINE=2025-12-31
GOOGLE_FORM_URL=https://forms.google.com/your-form
FROM_EMAIL=noreply@college.edu
FROM_NAME=Your College
SUPPORT_EMAIL=support@college.edu
```

---

## 🚀 Usage

### Test Mode (Recommended):
```bash
python main_agentic.py --file your_students.xlsx --dry-run
```
- ✅ Agent makes decisions
- ✅ Shows what would be sent
- ❌ No actual emails sent

### Production Mode:
```bash
python main_agentic.py --file your_students.xlsx --send
```
- ⚠️ Sends real emails
- ⚠️ Requires confirmation

---

## 📧 Message Examples

### Example 1: High Completion (81.8%)

**Subject:** 📋 Reminder: Complete Your Profile - 2 Fields Missing

```
Dear Rahul Kumar,

I hope this message finds you well!

We noticed your profile is 81.8% complete. When you have a 
moment, please consider completing the remaining fields.

Missing information:
  • Previous Education Qualification
  • Nationality

Complete your profile: [link]

Best regards,
IIIT Dharwad Administration
```

**Agent's Reasoning:**
"81.8% complete, 2 non-critical fields, 49 days left, first contact → Use friendly tone with low urgency"

---

### Example 2: Medium Completion (45%)

**Subject:** ⚠️ Action Required: Complete Your Profile - 6 Fields Missing

```
Dear Student,

Your profile is 45% complete. We kindly request you to 
update the remaining information by [deadline].

Missing information:
  • [6 fields listed]

Complete your profile: [link]

Best regards,
Administration
```

**Agent's Reasoning:**
"45% complete, multiple fields, moderate deadline → Use professional tone with medium urgency"

---

## 🧠 How Agent Works

```
For Each Student:

1. ANALYZE
   ├─> Completion percentage
   ├─> Days to deadline
   ├─> Missing fields
   └─> Critical vs non-critical

2. CHECK HISTORY
   ├─> Previous contacts
   ├─> Last contact time
   └─> Contact frequency

3. REASON
   └─> "This student is X% complete, Y days left,
        contacted Z times. Best approach is..."

4. DECIDE
   ├─> Tone: Friendly / Professional / Urgent
   ├─> Urgency: Low / Medium / High
   └─> Action: Send now / Schedule / Skip

5. EXECUTE
   └─> Use tools to carry out decision

6. EXPLAIN
   └─> Provide reasoning for transparency
```

**Different students = Different decisions!**

---

## 🏗️ Architecture

```
┌─────────────────────────────────────┐
│   AGENT (Claude Sonnet 4)          │
│   - Makes ALL decisions             │
│   - Chooses tools                   │
│   - Controls workflow               │
└──────────────┬──────────────────────┘
               ↓
┌─────────────────────────────────────┐
│   TOOLS (6 available)               │
│   1. read_student_data              │
│   2. analyze_profile_status         │
│   3. check_communication_history    │
│   4. draft_message                  │
│   5. send_email                     │
│   6. schedule_for_later             │
└──────────────┬──────────────────────┘
               ↓
┌─────────────────────────────────────┐
│   DATA                              │
│   - Excel file                      │
│   - Communication logs              │
│   - Schedules                       │
└─────────────────────────────────────┘
```

---

## 💰 Costs

| Students | Cost |
|----------|------|
| 10 | $0.15 |
| 50 | $0.75 |
| 100 | $1.50 |
| 500 | $7.50 |

**Per student:** ~$0.01-0.02

Very affordable! ✅

---

## 📊 Excel File Format

Required columns:

| Column | Example |
|--------|---------|
| Student Name | Rahul Kumar |
| Roll Number | BT21CSE001 |
| Institute Name | IIIT Dharwad |
| Enrolled program | B.Tech |
| Stream | CSE |
| Date of birth | 2003-05-15 |
| Gender | Male |
| email address | student@college.edu |
| previous education qualification | 12th CBSE |
| primary language | Hindi |
| Nationality | Indian |

System handles column name variations automatically.

---

## 🔧 Troubleshooting

### "ModuleNotFoundError"
```bash
pip install -r requirements.txt
```

### "API key not found"
```bash
# Check .env file
cat .env | grep ANTHROPIC_API_KEY
```

### "Excel file not found"
```bash
# Use absolute path
python main_agentic.py --file /full/path/to/file.xlsx --dry-run
```

### "Agent making too many decisions"
- Normal! Agent is reasoning through each student
- Each student: 4-6 tool calls
- System has built-in safety limits

---

## 🎯 Performance

- **Speed:** 2-5 seconds per student
- **Quality:** High (contextual decisions)
- **Reliability:** Excellent (error handling)
- **Scalability:** Any number of students

---

## 🎓 For Academic Use

### This System Demonstrates:
- ✅ Genuine agentic AI
- ✅ LLM tool calling
- ✅ Strategic reasoning
- ✅ Autonomous decision-making
- ✅ Production-ready architecture

### Agentic Rating: 7/10
- **Agent layer:** Fully autonomous ✅
- **Tool layer:** Some hardcoded logic ⚠️
- **Overall:** Strong agentic system ✅

**Good for thesis/research!**

---

## 📁 Project Files

```
agentic-profile-system/
├── profile_agent_agentic.py    # Core agent
├── main_agentic.py             # Main script
├── requirements.txt            # Dependencies
├── .env                        # Config (create this)
├── sample_student_profiles.xlsx
└── README.md                   # This file
```

---

## 🚀 Quick Commands

```bash
# Test
python main_agentic.py --file sample_student_profiles.xlsx --dry-run

# Your data
python main_agentic.py --file your_students.xlsx --dry-run

# Production
python main_agentic.py --file your_students.xlsx --send

# Help
python main_agentic.py --help
```

---

## ✅ Pre-Flight Checklist

- [ ] Python 3.8+ installed
- [ ] Dependencies installed (`pip install -r requirements.txt`)
- [ ] `.env` file created with API key
- [ ] Excel file prepared
- [ ] Tested with sample data
- [ ] Ready to run!

---

## 🎉 Success!

Your agentic system is ready!

**Next Steps:**
1. Test with sample data
2. Review agent decisions
3. Test with your data
4. Deploy to production

**Questions?** Check troubleshooting section above.

**Ready?** Run: `python main_agentic.py --file your_data.xlsx --dry-run`

---

**Built with ❤️ using Claude Sonnet 4 and LangGraph**
