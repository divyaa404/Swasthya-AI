# ⌚ Smartwatch Risk Scoring Agent

## Role

The Smartwatch Risk Scoring Agent monitors wearable sensor data streams (heart rate, SpO2, sleep patterns, steps) and uses RAG (Retrieval-Augmented Generation) over clinical guidelines (WHO/ICMR) to compute a patient's overall health risk score out of 100. 

To ensure clinical safety, the score is calculated via a hybrid pipeline: a deterministic Python rule base produces a secure "base score," and the LLM applies a bounded RAG adjustment. The final score is represented as a range with a confidence band, rather than a single absolute number.

---

## Architecture & Process

```
 Wearable Sensors (Apple HealthKit / Google Health Connect)
                          │
                          ▼
           Signal Quality Index (SQI) Filter
                          │ (Passes quality check?)
                          ▼
         Isolation Forest Anomaly Detection
                          │ (Flags heart rate/SpO2 anomalies)
                          ▼
             Deterministic Base Score (Python)
  (Evaluates age, symptoms, vitals anomalies, and adherence)
                          │
                          ▼
             RAG Guideline Retrieval (FAISS)
       (WHO/ICMR guidelines matched to patient symptoms)
                          │
                          ▼
           Groq LLM Bounded Adjustment (±15 Max)
    (Proposes adjustment; must cite guideline & section)
                          │
                          ▼
              Output Range & Confidence
```

---

## RAG-Augmented Score Breakdown

1. **Deterministic Base Score** — A Python engine calculates a base score from raw database facts (adherence, symptoms, age, wearable flags). No LLM is involved.
2. **Guideline Retrieval** — FAISS retrieves guidelines based on active symptoms (e.g., searches WHO Hypertension 2023 guidelines if blood pressure anomalies are detected).
3. **LLM Bounded Adjustment** — Groq LLaMA receives the patient context and guidelines. It can adjust the base score by a maximum of **±15 points**. 
4. **Citation Check** — The LLM must cite a specific section of the retrieved guideline (e.g., *"WHO Hypertension 2023, Section 3.1"*). If it tries to make a non-zero adjustment without a valid citation, the adjustment is rejected and set to `0`.
5. **Confidence Rating** — The range width is determined by data density. If the patient has worn their smartwatch for 7 consecutive days, the confidence is "High" (narrow range, e.g., 62-68). If data is scarce, the confidence is "Low" (wide range, e.g., 50-80).

---

## Safety Rules

- **Base Score Protection** — The LLM can never override the base score. It only suggests a minor adjustment.
- **RAG Visibility** — The doctor's dashboard displays the score components separately: `Base Score` + `Adjustment` + `Guideline Citation`.
- **No Diagnosis** — The output must always carry the disclaimer: *"This is a health risk score indicator only. All clinical diagnoses and decisions rest with your treating physician."*
- **SpO2 Exception** — If SpO2 drops below 85% at any time (SQI validated), it triggers a Tier 1 Critical Override immediately, bypassing standard score calculations.

---

## Output JSON Schema

```json
{
  "base_score": 60,
  "rag_adjustment": 5,
  "rag_guideline": "WHO Guidelines on Cardiovascular Risk, 2023",
  "rag_section": "Section 2.4",
  "risk_score_range": {
    "low": 58,
    "high": 67
  },
  "confidence": "high",
  "trend": "stable",
  "data_points_analyzed": {
    "wearable_days": 7,
    "symptoms_logged": 4,
    "adherence_rate": 92
  }
}
```
