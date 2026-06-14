# 💬 AI Health Chatbot — Patient App Feature

## What It Is

The AI Health Chatbot is the primary interaction surface of the Swasthya AI patient app. It is a conversational interface where patients report symptoms, ask health questions, and receive personalised AI guidance — all in plain, natural language. There are no forms, no dropdowns, no medical jargon required from the patient.

Every message the patient sends runs through a **dual-pipeline architecture**: one AI call generates the conversational reply the patient reads, and a parallel AI call silently extracts structured clinical data from the same message. The patient experiences a natural conversation; the backend builds a structured medical record.

---

## How a Message Is Processed

```
Patient types message
        │
        ▼
FastAPI /chat/message
        │
   ┌────┴────────────────┐  (run in parallel)
   ▼                     ▼
Groq LLM              Groq LLM
(conversational        (symptom extraction
 reply)                 → structured JSON)
   │                     │
   └──────────┬──────────┘
              │
   Extraction confidence check
              │
   < 70%  ──► Ask clarifying question (do not save)
   ≥ 70%  ──► Continue
              │
   Severity ≥ 7? ──► Ask explicit confirmation
   Severity < 7  ──► Continue
              │
   Save structured symptom → Supabase
              │
   Update risk score
              │
   Run escalation matrix check
              │
   (if triggered) → N8N webhook → doctor notification
```

---

## Symptom Extraction Pipeline

Every natural language input is parsed into a structured symptom object:

| Field | Description | Example |
|---|---|---|
| `symptom_type` | Clinical term | "dyspnea" |
| `body_zone` | Anatomical region | "chest" |
| `severity` | 1–10 patient-reported scale | 6 |
| `duration` | How long it has been present | "2 days" |
| `onset` | Sudden or gradual | "sudden" |
| `resolution_status` | Ongoing or resolved | "ongoing" |
| `confidence` | Extraction confidence 0–1 | 0.84 |

If confidence falls below **0.70**, the system asks a clarifying question and does not save anything. This prevents low-quality data from polluting the medical record.

If severity is **7 or above**, the system asks the patient to confirm explicitly before saving — preventing accidental exaggeration from corrupting risk scores.

---

## Escalation Logic

After every symptom save, the chatbot checks the deterministic escalation matrix.

### Critical Single-Symptom Override (Tier 1)
These 8 symptoms bypass all two-signal logic and trigger an immediate "Consult a doctor now" card with a Call Doctor button:

1. Sudden severe headache
2. Chest pain at rest
3. Unilateral weakness or numbness
4. Slurred speech
5. Sudden vision loss
6. Loss of consciousness
7. Severe breathing difficulty
8. Severe allergic reaction

### Two-Signal Combinations (Tier 2)
Escalation fires when two independent danger signals are detected simultaneously. Examples:
- Chest pain + breathlessness → immediate recommendation
- Fever 3+ days + joint pain → 24-hour recommendation
- Severe abdominal pain + vomiting → 48-hour recommendation

Every escalation message carries: *"This is an AI-generated pattern suggestion. Final clinical decisions rest with your licensed physician."*

---

## What the AI Will and Will Not Do

| Will Do | Will Not Do |
|---|---|
| Answer general health questions in plain language | Give a diagnosis |
| Explain what a symptom might indicate (as a range) | Prescribe or recommend specific medicines |
| Remind about medicine adherence | Override a doctor's existing instructions |
| Flag drug interactions before they are saved | Confirm or deny a specific disease |
| Trigger emergency escalation for critical symptoms | Make clinical decisions |

The word "diagnosis" never appears in any chatbot output. Risk indicators are always shown as ranges with confidence bands, never as single precise numbers.

---

## Context Awareness

The chatbot is not stateless. Every conversation has access to:
- Full patient profile (conditions, medications, allergies, family history)
- Recent symptom history (last 30 days)
- Current risk score and trend
- Last 24 hours of wearable data
- Pending doctor questions from the async Q&A loop
- Active drug conflict flags

This means the chatbot can say: *"You mentioned chest tightness last Tuesday and your smartwatch showed elevated resting heart rate last night — are you still experiencing this?"* — without the patient having to repeat themselves.

---

## Rolling Summary

Chat sessions maintain a **rolling AI summary** — a compressed representation of the conversation stored in Supabase. This prevents context windows from becoming unmanageable in long-term patient relationships, while preserving clinical continuity. The summary is updated after every session and is used as context for the doctor's AI assistant on the dashboard.

---

## UI Design Notes

- The chat interface uses a familiar messaging UI — not a medical form
- AI replies are kept concise: 2–4 sentences for reassurance, one question at a time for clarification
- Escalation cards appear inline in the chat — visually distinct (red border, icon, action button)
- Typing indicators shown while AI generates to signal the system is working
- All messages timestamped; session history scrollable with date dividers
