# 🔄 Daily Workflow Orchestrator & Agents

## Role

The Daily Workflow Orchestrator is a scheduled automation pipeline (triggered daily, e.g., at 11 PM via N8N) that coordinates a multi-agent team to evaluate patient health trends. Rather than utilizing a single generic LLM, it decomposes the analysis into four specialized sub-agents. These sub-agents compile data from chat logs, wearables, and medical scans, then output a consolidated summary on the patient's profile page and feed questions to the Check-In Agent.

---

## Agent Pipeline Architecture

```
                       Daily Trigger (11 PM)
                                │
                                ▼
                   Daily Workflow Orchestrator
                                │
         ┌──────────────────────┼──────────────────────┐
         ▼                      ▼                      ▼
    Chat Summary            Medicine               Medical Info
   Analyzer Agent       Adherence Agent        Change Tracker Agent
         │                      │                      │
         └──────────────────────┼──────────────────────┘
                                │
                                ▼
                   Profile Summarizer Agent
                                │
                                ├──► Save consolidated summary to Profile Page
                                │
                                ▼
                       Check-In Q&A Agent
                 (Build daily check-in questions)
```

---

## The Four Specialized Agents

### 1. Chat Summary Analyzer Agent
- **Role**: Analyzes the conversational transcripts and daily chat summaries compiled by the Sarvam Chatbot.
- **Objective**: Identifies persistent complaints, worsening symptoms, or recurring issues reported during conversations.
- **Example finding**: *"User reported severe headache on Monday, Tuesday, and Wednesday. Mentioned sudden fatigue."*

### 2. Medicine Adherence Tracker Agent
- **Role**: Audits the medicine tracker database logs and check-in confirmation answers.
- **Objective**: Evaluates medication compliance over the last 24 hours and detects missed dose streaks.
- **Example finding**: *"Missed both morning and evening doses of Amlodipine 5mg. Adherence has fallen below 70% this week."*

### 3. Medical Info Change Agent
- **Role**: Tracks structural edits in the profile, new vitals data, or data parsed from medical scans (blood tests, prescriptions) over the day.
- **Objective**: Flags updates to baseline indicators like blood pressure trends, SpO2 averages, body weight, or blood glucose.
- **Example finding**: *"Weight registered a 2.5 kg drop over the last 14 days. SpO2 average dropped to 92% overnight."*

### 4. Profile Summarizer Agent
- **Role**: Acts as the compiler agent, taking the structured reports from the Chat Analyzer, Adherence Agent, and Info Change Tracker.
- **Objective**: Formulates a clear, high-level clinical overview written in natural language, which is displayed directly on the patient's profile dashboard and the doctor's morning briefing card.
- **Example output**: *"User experiencing headache for three days. The weight has also dropped by 2.5 kg and adherence to Amlodipine is down to 70%."*

---

## Downstream Check-In Generation

The orchestrator forwards the profile summary and flagged issues to the **Check-In Agent**. The Check-In Agent uses this context to design specific, multi-question check-ins (e.g., follow-ups on headaches, medication side effects, or weight loss verification) for the following morning.

---

## Safety Rules

- **Deterministic Fallbacks** — If any sub-agent fails to run, the orchestrator defaults to a standard template, logging a warning to prevent the dashboard from displaying stale info.
- **No Diagnostic Labels** — The Profile Summarizer must only summarize observations (e.g., *"Weight loss and fatigue noted"*), never labeling the pattern as a specific disease (e.g., *"Suggests diabetes"*).
- **Data Grounding** — Every claim in the profile summary must correspond to a logged symptom, weight entry, or medication log in the database.
