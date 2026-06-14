# 📈 Patient Analytics — Doctor Web Feature

## What It Is

The Patient Analytics view is the full clinical intelligence panel for an individual patient, accessible from the Morning Briefing card or the patient list. It is the primary screen doctors use to understand a patient's health trajectory, review AI-generated summaries, and make informed decisions before or after a consultation.

The analytics view is loaded when a doctor scans a patient QR code or clicks into a patient from the list. It is designed to give a complete clinical picture in a single scrollable page — no tabs, no hidden sections, no clicking around to find context.

---

## AI 7-Day Summary

At the top of the analytics page, prominently placed, is the AI-generated 7-day patient summary. Generated on-demand with one click (or pre-generated overnight for flagged patients).

The summary includes:
- Symptoms reported and how they evolved (improving / stable / worsening)
- Medication adherence summary (overall rate + which medicines missed and when)
- Wearable anomalies detected (count, type, SQI-validated only)
- Concerning patterns identified
- AI guidance given to the patient this week (via chatbot or check-in responses)
- Body zones with new or worsening symptom flags
- Relevant clinical guideline reference if a pattern is flagged

**Format:** A concise clinical narrative (3–5 sentences per category), not a bullet dump. Designed to read like a colleague's handover note, not a data export.

---

## RAG Risk Score Panel

The risk score is shown with full transparency. Not a single number — every component is visible:

```
Risk Score: 58–72 / 100
├── Base Score:        62  (deterministic rules)
├── RAG Adjustment:    +8
│   ├── Guideline:     WHO Hypertension Guidelines 2023
│   └── Section:       4.2 — Target Organ Damage Assessment
│   └── Reason:        Patient has 2+ wearable HR anomalies + reported
│                      headache, consistent with Section 4.2 risk markers
└── Confidence Band:   ±7 (32 days of check-in data)

Trend:  ↑ Worsening  (linear regression over last 7 days)
```

The doctor can see:
- What the base score is and that it comes from deterministic rules (not AI)
- Exactly which guideline caused the AI adjustment and by how much
- What specific patient data pattern the guideline was matched to
- How confident the system is based on data availability

This is the **RAG Source Visibility** feature. The goal: a doctor who disagrees with the adjustment can see exactly what to disagree with and why.

---

## Charts and Visualisations (Recharts)

### Risk Score Trend Chart
- 30-day line chart of daily risk score (shown as range band, not single line)
- Escalation events marked with red circles
- Recovery milestone marked with green star
- Risk threshold zones (Moderate / Elevated / High / Critical) shown as horizontal bands

### Symptom Frequency Chart
- Bar chart: number of new symptoms logged per day (last 30 days)
- Coloured by severity (green → red)
- Hover shows: symptom names for that day

### Body Heatmap
- Same SVG heatmap as patient app
- Clinical terminology used (not lay descriptions)
- "New since last visit" badge on changed zones
- Wearable anomaly contributions shown separately from patient-reported

### Medication Adherence Timeline
- Per-medicine adherence rate over last 14 days
- Calendar grid (taken = green, missed = red, no data = grey)
- Overall adherence rate shown as percentage with trend arrow

### Wearable Data Charts (if wearable connected)
- Heart Rate: 7-day trend with personal baseline line, anomaly points in red, SQI-rejected points in grey
- SpO2: 7-day readings with alert threshold line
- Sleep: 7-day duration chart with stage breakdown (deep / light / REM)
- Steps: 7-day bar chart with patient's baseline average line

### Anomaly Flags Timeline
- Chronological list of all SQI-validated anomaly events
- Each entry: date, data type, detection method (Isolation Forest / Statistical / Both), severity, and whether it correlated with a patient-reported symptom

---

## Doctor Actions From This Page

- **Ask AI** — Opens the Doctor Q&A Agent panel for this patient
- **Send Question** — Queues a question for the patient's next check-in (async Q&A loop)
- **Add Note** — Internal clinical note attached to patient record (not visible to patient)
- **Override Drug Flag** — Add clinical note to override a drug conflict flag
- **Mark Recovered** — Manually trigger a Recovery Confirmation if the doctor confirms it clinically (for cases where the system hasn't auto-detected it)
- **Request Appointment** — Sends patient a notification asking them to schedule a visit

---

## Performance

The analytics page is designed to load the most critical information first:
- AI 7-day summary and risk panel load immediately (pre-computed or fast to generate)
- Charts load progressively as data is fetched
- Wearable charts load last (largest dataset)
- A loading skeleton is shown for each section while data fetches, so the doctor can start reading the top of the page while charts below are still loading
