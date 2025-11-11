#!/usr/bin/env python3
"""
Agentic Profile Completion System - Main Script
------------------------------------------------

This script runs the truly agentic AI agent that:
- Makes all strategic decisions autonomously
- Chooses which tools to use and when
- Reasons about each student individually  
- Adapts its approach based on context
- Explains all of its decisions

NO HARDCODED LOGIC - The agent is in control!

Usage:
    python main_agentic.py --file students.xlsx --preview
    python main_agentic.py --file students.xlsx --dry-run
    python main_agentic.py --file students.xlsx --send
"""

import os
import sys
import argparse
from datetime import datetime
from dotenv import load_dotenv

# Import the agentic agent
from profile_agent_agentic import run_agentic_agent, CONFIG

load_dotenv()


def print_banner():
    """Print agentic system banner."""
    banner = """
╔══════════════════════════════════════════════════════════════════════════════╗
║                                                                              ║
║              🤖 TRULY AGENTIC PROFILE COMPLETION SYSTEM                      ║
║                                                                              ║
║                     AI Agent Makes ALL Decisions                             ║
║                   No Hardcoded Rules • Full Autonomy                         ║
║                                                                              ║
╚══════════════════════════════════════════════════════════════════════════════╝
"""
    print(banner)


def parse_arguments():
    """Parse command line arguments."""
    parser = argparse.ArgumentParser(
        description='Run the Truly Agentic Profile Completion Agent',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Preview mode - see what agent would do
  python main_agentic.py --file students.xlsx --preview

  # Dry run - agent runs but doesn't send emails
  python main_agentic.py --file students.xlsx --dry-run

  # Live mode - agent sends real emails
  python main_agentic.py --file students.xlsx --send

Key Differences from Old System:
  ✅ Agent makes strategic decisions (not hardcoded if-else)
  ✅ Agent chooses which tools to use and when
  ✅ Agent reasons about each student individually
  ✅ Agent adapts approach based on context
  ✅ Agent explains all decisions transparently
        """
    )
    
    parser.add_argument(
        '--file',
        type=str,
        default=os.getenv('EXCEL_FILE_PATH', 'sample_student_profiles.xlsx'),
        help='Path to Excel file with student data'
    )
    
    mode_group = parser.add_mutually_exclusive_group()
    mode_group.add_argument(
        '--preview',
        action='store_true',
        help='Preview mode: Show what agent would do (no tools executed)'
    )
    
    mode_group.add_argument(
        '--dry-run',
        action='store_true',
        help='Dry run: Agent runs and makes decisions, but emails are simulated'
    )
    
    mode_group.add_argument(
        '--send',
        action='store_true',
        help='Live mode: Agent actually sends emails (requires confirmation)'
    )
    
    parser.add_argument(
        '--verbose',
        action='store_true',
        help='Show detailed agent reasoning and tool calls'
    )
    
    return parser.parse_args()


def check_prerequisites():
    """Check if system is properly configured."""
    issues = []
    
    # Check API key
    if not os.getenv('ANTHROPIC_API_KEY'):
        issues.append("❌ ANTHROPIC_API_KEY not set in .env file")
    else:
        print("✅ Claude API key configured")
    
    # Check Excel file
    excel_file = os.getenv('EXCEL_FILE_PATH', 'sample_student_profiles.xlsx')
    if not os.path.exists(excel_file):
        issues.append(f"❌ Excel file not found: {excel_file}")
    else:
        print(f"✅ Excel file found: {excel_file}")
    
    if issues:
        print("\n⚠️  Configuration Issues:")
        for issue in issues:
            print(f"   {issue}")
        print("\nPlease fix these issues before running.")
        return False
    
    return True


def display_agentic_features():
    """Display what makes this system truly agentic."""
    print("\n🎯 AGENTIC FEATURES ACTIVE:")
    print("="*80)
    
    features = [
        ("Strategic Decision Making", "Agent reasons about each student's situation"),
        ("Tool Selection", "Agent chooses which tools to use and when"),
        ("Adaptive Behavior", "Different approach for each student"),
        ("Conditional Workflow", "Agent controls the flow, not hardcoded paths"),
        ("Transparent Reasoning", "Agent explains every decision it makes"),
        ("Context Awareness", "Considers timing, history, urgency dynamically"),
        ("Autonomous Operation", "No human intervention needed during execution"),
        ("Learning from Data", "Agent analyzes patterns in communication history")
    ]
    
    for feature, description in features:
        print(f"   ✅ {feature:.<30} {description}")
    
    print("="*80)


def display_comparison():
    """Display comparison between old and new systems."""
    print("\n📊 OLD SYSTEM vs. NEW AGENTIC SYSTEM:")
    print("="*80)
    
    comparisons = [
        ("Decision Making", "Hardcoded if-else", "Agent reasoning"),
        ("Urgency Levels", "Fixed thresholds", "Agent analyzes context"),
        ("Tone Selection", "Rule-based", "Agent strategizes"),
        ("Tool Usage", "Predetermined", "Agent chooses"),
        ("Workflow", "Linear A→B→C", "Dynamic branching"),
        ("Adaptability", "Same for all", "Per student"),
        ("Reasoning", "None", "Fully transparent"),
        ("Control", "Python code", "AI agent")
    ]
    
    print(f"{'Aspect':<20} {'Old System':<25} {'Agentic System':<25}")
    print("-"*80)
    for aspect, old, new in comparisons:
        print(f"{aspect:<20} ❌ {old:<23} ✅ {new:<25}")
    
    print("="*80)


def run_with_mode(args):
    """Run the agent with specified mode."""
    
    if args.preview:
        print("\n👁️  PREVIEW MODE")
        print("="*80)
        print("Agent will show you what it would do without executing tools.")
        print("This is the safest mode to understand agent behavior.")
        print("="*80)
        # In preview mode, we'd need to modify the agent to not execute tools
        # For now, we'll use dry-run
        print("\n⚠️  Preview mode implementation pending. Using dry-run instead.")
        return run_agentic_agent(args.file, dry_run=True)
    
    elif args.dry_run:
        print("\n🔄 DRY RUN MODE")
        print("="*80)
        print("Agent will make real decisions and use tools,")
        print("but emails will be SIMULATED (not actually sent).")
        print("="*80)
        input("\nPress ENTER to start agent... ")
        return run_agentic_agent(args.file, dry_run=True)
    
    elif args.send:
        print("\n⚠️  LIVE MODE - REAL EMAILS WILL BE SENT!")
        print("="*80)
        print("The agent will make decisions and ACTUALLY send emails.")
        print("This will affect real students!")
        print("="*80)
        
        response = input("\nAre you sure you want to continue? (type 'yes' to proceed): ")
        if response.lower() != 'yes':
            print("❌ Cancelled by user")
            return None
        
        return run_agentic_agent(args.file, dry_run=False)
    
    else:
        # Default to dry-run
        print("\n🔄 No mode specified, using DRY RUN MODE")
        print("   Use --preview, --dry-run, or --send to specify mode")
        return run_agentic_agent(args.file, dry_run=True)


def display_results_summary(final_state):
    """Display summary of agent's actions."""
    if not final_state:
        return
    
    print("\n" + "="*80)
    print("📈 DETAILED RESULTS")
    print("="*80)
    
    # Count tool usages
    tool_usage = {}
    for msg in final_state.get('messages', []):
        if msg['role'] == 'assistant':
            for content in msg.get('content', []):
                if hasattr(content, 'type') and content.type == 'tool_use':
                    tool_name = content.name
                    tool_usage[tool_name] = tool_usage.get(tool_name, 0) + 1
    
    if tool_usage:
        print("\n🔧 Tools Used by Agent:")
        for tool, count in sorted(tool_usage.items(), key=lambda x: x[1], reverse=True):
            print(f"   {tool:.<40} {count:>3} times")
    
    # Show reasoning samples
    reasoning = final_state.get('agent_reasoning', [])
    if reasoning:
        print(f"\n💭 Agent Reasoning (showing first and last):")
        print("─"*80)
        print("First reasoning:")
        print(reasoning[0][:300] + "..." if len(reasoning[0]) > 300 else reasoning[0])
        if len(reasoning) > 1:
            print("\n" + "─"*80)
            print("Final reasoning:")
            print(reasoning[-1][:300] + "..." if len(reasoning[-1]) > 300 else reasoning[-1])
    
    print("\n" + "="*80)


def main():
    """Main execution function."""
    
    args = parse_arguments()
    
    print_banner()
    print(f"Started: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
    
    # Display what makes this agentic
    display_agentic_features()
    display_comparison()
    
    print("\n🔍 System Check:")
    print("="*80)
    if not check_prerequisites():
        sys.exit(1)
    print("="*80)
    
    print(f"\n📁 Configuration:")
    print(f"   Excel File: {args.file}")
    print(f"   Deadline: {CONFIG['deadline']}")
    print(f"   Form URL: {CONFIG['form_url']}")
    
    try:
        # Run the agent
        final_state = run_with_mode(args)
        
        # Display results
        if final_state:
            display_results_summary(final_state)
        
        print("\n" + "="*80)
        print("✅ AGENTIC SYSTEM COMPLETED SUCCESSFULLY")
        print("="*80)
        print(f"Finished: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print("="*80 + "\n")
        
    except KeyboardInterrupt:
        print("\n\n⚠️  Agent execution interrupted by user")
        sys.exit(1)
    except Exception as e:
        print(f"\n\n❌ Error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == "__main__":
    main()
