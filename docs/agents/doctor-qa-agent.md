# 🩺 Doctor Q&A Agent

## Role

The Doctor Q&A Agent is the clinical intelligence assistant on the doctor web dashboard. It answers free-text clinical questions about a specific patient — grounded entirely in that patient's actual health data. It is the most powerful feature available to doctors on the platform, and the one with the strictest data grounding requirements.

This agent does not use general medical knowledge in isolation. If the answer to a question cannot be found or reasonably inferred from the patient's records, the agent says so — and offers to queue the question for the patient's next check-in.

---

## What Doctors Can Ask

The agent accepts any free-text clinical question about the patient currently open on the dashboard. Examples:

- *"Does this patient show any signs of liver stress based on what they've reported?"*
- *"Can I safely prescribe paracetamol given their current medication list?"*
- *"What's the risk of adding metformin given their recent kidney-related flags?"*
- *"Has this patient ever reported symptoms consistent with peripheral neuropathy?"*
- *"How has their blood pressure symptom pattern changed over the last month?"*
- *"Are there any drug interactions I should be aware of if I add amlodipine?"*
- *"This patient's HbA1c is 8.2 — what does their adherence record suggest about why?"*

---

## How the Agent Works

```
Doctor types question in dashboard AI assistant
        │
        ▼
POST /agent/doctor-answer
{ patient_id, question }
        │
        ▼
Fetch complete patient data:
  ├── Profile (conditions, medications, allergies, family history)
  ├── Symptom history (last 90 days, with dates and severity)
  ├── Risk score history (last 30 days with RAG adjustment breakdown)
  ├── Medication list + adherence logs
  ├── Wearable anomaly flags
  ├── Drug conflict history
  ├── Doctor Q&A history (previous questions + answers)
  └── AI 7-day summary (pre-generated)
        │
        ▼
RAG retrieval: semantic search over clinical guideline PDFs
(using the question + patient conditions as query)
        │
        ▼
Build grounded prompt:
  ├── Patient data injected as structured context
  ├── Retrieved guideline sections injected
  └── Question appended
        │
        ▼
Groq LLaMA 3.3 70B generates response
        │
        ▼
Response validation:
  ├── Must cite at least one patient data source with date
  ├── Must not assert a fact not present in the data
  ├── Must include physician-decision disclaimer
  └── If answer not found → must say so + offer queue option
        │
        ▼
Return to dashboard with:
  ├── Answer text
  ├── Data sources used (source type + date)
  ├── RAG guideline cited (if applicable)
  └── Confidence level (High / Moderate / Low / Not found in data)
```

---

## Response Format

Every response shown in the dashboard includes:

**Answer:** [The agent's response in clear clinical language]

**Data Used:**
- Symptom log — "chest tightness" — reported 3 days ago (severity 5)
- Medication record — Metformin 500mg BD — active since Jan 2024
- Adherence log — 78% adherence over last 14 days

**Guideline Referenced:** WHO Hypertension Guidelines 2023, Section 4.2 *(if applicable)*

**Confidence:** Moderate — answer grounded in 3 patient data points

**Disclaimer:** *Answer grounded in patient data on record as of [date]. Clinical decisions rest with the treating physician.*

---

## RAG Source Visibility

When the agent cites a clinical guideline, the dashboard shows:
- Guideline name and publication year
- Specific section referenced
- The exact claim the guideline supports
- How the guideline influenced the answer (supporting or modifying)

This is not a tooltip or a collapsed reference — it is shown inline in the response card. The doctor can see exactly what external knowledge was used and where it came from.

---

## "Not Found in Data" Handling

If the question cannot be answered from the patient's records, the agent responds:

*"I couldn't find enough information in [patient name]'s records to answer this question reliably. The records don't contain [relevant data type] for the requested time period."*

The doctor is then offered:

**Queue for next check-in?** [Yes] [No]

If Yes → the question is rewritten in conversational patient language and added to the patient's next check-in. When the patient answers, the doctor is notified.

---

## Drug Interaction Queries

When a doctor asks about adding a new medicine, the agent does not just use its own knowledge. It:

1. Takes the proposed medicine name from the question
2. Calls the same OpenFDA API used by the patient-side drug conflict detection
3. Checks the result against all medications in the patient's active list
4. Returns the interaction result with: which medicines interact, interaction type, severity level, and the patient's specific context (e.g. renal function flags that would make certain interactions more dangerous)

Drug interaction answers from this agent carry the same severity levels as the patient-side system: Informational / Caution / Do not prescribe without further review.

---

## Async Doctor–Patient Q&A Loop

Questions queued from this agent follow this lifecycle:

| State | Description |
|---|---|
| `pending` | Question awaiting patient answer |
| `queued_for_checkin` | Added to patient's next check-in |
| `answered` | Patient responded; doctor notified |
| `expired` | 7 days passed without answer; doctor notified |
| `cancelled` | Doctor cancelled before answer |

Questions are prioritised in the patient's check-in by the patient's current risk level — higher-risk patients get queued questions surfaced sooner.

---

## What the Agent Will Not Do

- Assert clinical facts not present in patient data
- Use general medical knowledge as if it were patient-specific fact
- Give a diagnosis
- Recommend a specific dosage without citing the patient's existing prescription context
- Override an existing prescription or contraindication without explicit physician action in the system
