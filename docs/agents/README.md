# 🤖 Swasthya AI — Agents Overview

This folder documents every AI agent in the Swasthya AI platform. Each agent is a distinct LLM-powered module responsible for a specific task or conversation flow. Agents are served by the FastAPI backend and called by either the patient mobile app or the doctor web dashboard.

---

## Agent Index

| Agent | File | Used By | Primary Role |
|---|---|---|---|
| **Onboarding Agent** | [`onboarding-agent.md`](file:///d:/college/PROJECTS/Swasthya-AI/docs/agents/onboarding-agent.md) | Patient App | Conversational health profile collection and validation |
| **Sarvam Chatbot Agent** | [`sarvam-chat-agent.md`](file:///d:/college/PROJECTS/Swasthya-AI/docs/agents/sarvam-chat-agent.md) | Patient App | Multilingual chat, symptom extraction, and daily summaries |
| **Daily Workflow Orchestrator** | [`daily-workflow-orchestrator.md`](file:///d:/college/PROJECTS/Swasthya-AI/docs/agents/daily-workflow-orchestrator.md) | Backend | Runs daily sub-agents (Chat, Adherence, Info Change, Profile Summarizer) |
| **Check-In Agent** | [`checkin-agent.md`](file:///d:/college/PROJECTS/Swasthya-AI/docs/agents/checkin-agent.md) | Patient App | Personalised Q&A generation for unresolved/concerning symptoms |
| **Medicine Reminder & Jan Aushadhi Agent** | [`medicine-reminder-agent.md`](file:///d:/college/PROJECTS/Swasthya-AI/docs/agents/medicine-reminder-agent.md) | Both | Reminders, OpenFDA drug conflict checks, Jan Aushadhi generic calculator & PDFs |
| **Smartwatch Risk Scoring Agent** | [`smartwatch-risk-agent.md`](file:///d:/college/PROJECTS/Swasthya-AI/docs/agents/smartwatch-risk-agent.md) | Both | Tracks wearable data constantly and runs RAG for risk scoring (0-100) |
| **Medical Scan & Record Analyzer Agent** | [`medical-scan-agent.md`](file:///d:/college/PROJECTS/Swasthya-AI/docs/agents/medical-scan-agent.md) | Patient App | Extracts profile details and vaccine cards from uploaded test reports and prescriptions |
| **Family Genetics & Similarity Agent** | [`family-genetics-agent.md`](file:///d:/college/PROJECTS/Swasthya-AI/docs/agents/family-genetics-agent.md) | Both | QR family linkage, genetics tracking, and household symptom similarity alert |
| **Appointment Automation Agent** | [`appointment-automation-agent.md`](file:///d:/college/PROJECTS/Swasthya-AI/docs/agents/appointment-automation-agent.md) | Patient App | Scans doctor calendars and auto-assigns slots to users based on urgency |
| **Escalation Agent** | [`escalation-agent.md`](file:///d:/college/PROJECTS/Swasthya-AI/docs/agents/escalation-agent.md) | Patient App | Two-signal escalation + 8 critical single-symptom overrides |
| **Doctor Q&A Agent** | [`doctor-qa-agent.md`](file:///d:/college/PROJECTS/Swasthya-AI/docs/agents/doctor-qa-agent.md) | Doctor Web | Grounded clinical question answering using patient-specific data |

---

## Shared Design Rules Across All Agents

These rules apply to every agent in the system without exception. They are enforced at the prompt level and validated in the backend response handler.

1. **No diagnosis language** — The word "diagnosis" never appears in any agent output. Agents use "risk indicator", "pattern", "flag", or "suggestion."
2. **Physician-decision framing** — Every output that could influence a patient or doctor decision carries: *"All clinical decisions rest with your licensed physician."*
3. **Confidence before saving** — Any extraction below 70% confidence triggers a clarification question. Nothing is saved from a low-confidence extraction.
4. **Grounded answers only (Doctor Q&A)** — The Doctor Q&A Agent only answers from data in that patient's actual records. It never fills gaps with general medical knowledge presented as patient-specific fact.
5. **Bounded LLM adjustments** — The Risk Agent's LLM can adjust the base score by ±15 maximum. It must cite a specific named guideline for any adjustment.
6. **Escalation is deterministic** — The Escalation Agent uses a hardcoded Python matrix for trigger decisions. The LLM writes the message language, but never decides whether to escalate.
7. **No PII in family outputs** — The Family Genetics/Summary Agent never outputs names or sensitive diagnoses (like HIV, mental health, STDs, cancer) under family views.

---

## Agent Communication Pattern

All agents follow the same request-response pattern:

```
Client (App / Dashboard)
        │
        ▼
POST /agent/{agent_name}
Body: { patient_id, context, message/data }
        │
        ▼
FastAPI route handler
        │
        ├── Fetch patient data from Supabase
        ├── Build prompt from data + template
        ├── (optional) RAG retrieval from FAISS
        ├── Call Groq LLaMA 3.3 70B (or Sarvam AI for chat translation)
        └── Validate response → Return
        │
        ▼
Client renders response
```

All agent endpoints are documented at `/docs` when the backend is running.
