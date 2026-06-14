# 📊 Risk Score & RAG Risk Indicator — Patient App Feature

## What It Is

The Risk Score is the central health intelligence output of Swasthya AI. It is a composite, continuously-updated indicator of a patient's current health risk level — built from deterministic rules, machine learning anomaly detection, and RAG-augmented clinical guidelines.

**The score is always displayed as a range with a confidence band — never as a single precise number.** This is a deliberate design decision. A single number implies false precision. A range with a confidence band honestly communicates uncertainty: a patient with 30 days of check-in data gets a tighter band than a patient in their first week.

Example display: **Risk Level: 58–72 / 100 (Confidence: Moderate)**

---

## How the Score Is Built

### Step 1 — Deterministic Base Score (Python Rules)

The base score is computed from hard rules, not AI. It cannot be changed by any prompt or LLM output. Inputs:

| Input | Weight |
|---|---|
| Chronic conditions present | High |
| Active symptom severity (average, last 7 days) | High |
| Medication adherence rate (last 14 days) | Medium |
| Wearable anomaly count (last 7 days, SQI-validated) | Medium |
| Family history of high-risk conditions | Low-Medium |
| Age and comorbidity combination | Low-Medium |
| Missed check-ins (consecutive) | Low |

Each factor contributes a weighted sub-score. The base score is their sum, capped at 100.

### Step 2 — RAG Retrieval

The system performs a semantic search over embedded medical guideline PDFs (WHO, ICMR, AHA, IDF) using FAISS. The query is constructed from the patient's active conditions and top symptom flags.

Relevant guideline sections are retrieved and passed to the LLM as grounding context.

### Step 3 — LLM Adjustment (Bounded)

The Groq LLaMA 3.3 70B model reviews the patient's data and the retrieved guidelines, then proposes an adjustment to the base score. **This adjustment is hard-capped at ±15 points.** The LLM must cite a specific named guideline (e.g. "WHO Hypertension Guidelines 2023, Section 4.2") for any adjustment it proposes. If it cannot cite a guideline, the adjustment is rejected and the base score stands unchanged.

### Step 4 — Confidence Band Calculation

The confidence band width is calculated from data quantity:
- < 7 days of check-in data → wide band (±15)
- 7–30 days → medium band (±10)
- > 30 days → narrow band (±5)
- Additional wearable data available → band narrows further

The band communicates honest uncertainty. Less data = wider band = the system knows less.

### Step 5 — Storage and Display

The final output stored in Supabase:
```json
{
  "base_score": 62,
  "rag_adjustment": 8,
  "rag_guideline": "WHO Hypertension Guidelines 2023",
  "rag_guideline_section": "Section 4.2 — Target Organ Damage",
  "final_score_low": 58,
  "final_score_high": 72,
  "confidence": "moderate",
  "trend": "worsening"
}
```

The patient app shows: risk range, trend arrow, and confidence label.
The doctor dashboard shows: all fields above as separate data points — including exactly which guideline caused the adjustment and by how much.

---

## RAG Source Visibility (Doctor Dashboard)

This is a critical trust feature. On the patient detail page in the doctor dashboard, the risk score panel shows:

```
Risk Score: 58–72
├── Base Score:        62  (deterministic rules)
├── RAG Adjustment:    +8
│   ├── Guideline:     WHO Hypertension Guidelines 2023
│   └── Section:       4.2 — Target Organ Damage Assessment
└── Confidence Band:   ±7 (30+ days of data)
```

Doctors can see exactly why the AI raised or lowered a score. This is not buried in a tooltip — it is shown inline. The goal is that a doctor should be able to disagree with the adjustment and understand what to disagree with.

---

## Risk Trend Indicator

A 7-day trend is calculated using Linear Regression (scikit-learn) over the daily risk scores for the past 7 days. Output:

| Trend | Condition |
|---|---|
| 📈 Worsening | Positive slope > threshold |
| ➡️ Stable | Slope within flat threshold |
| 📉 Improving | Negative slope > threshold |

The trend is shown on both the patient home screen and the doctor dashboard.

---

## Risk Thresholds and Automatic Triggers

| Score Range | Level | Automatic Action |
|---|---|---|
| 0–30 | Low | No action |
| 31–55 | Moderate | Reminded to maintain check-ins |
| 56–75 | Elevated | Affordability engine triggered; flagged in morning briefing |
| 76–90 | High | Escalation review; doctor notified |
| 91–100 | Critical | Immediate escalation; emergency call prompt shown |

---

## Recovery Confirmation

When the risk score drops from Elevated/High to Low/Moderate and stays in that range for **3 consecutive days**, a Recovery Confirmation milestone fires:
- Patient receives a personalised positive message
- Episode logged as "Recovered" in medical timeline
- The linked doctor's Recovery Counter increments

This makes recovery a measurable, celebrated event — not just the absence of bad news.

---

## What the Score Is Not

- Not a diagnosis
- Not a probability of a specific disease
- Not a substitute for clinical assessment
- Not a single precise number

Every display of the risk score in the app and dashboard carries: *"Risk indicator only — all clinical decisions rest with your doctor."*
