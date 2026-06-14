# 🌅 Morning Briefing — Doctor Web Feature

## What It Is

The Morning Briefing is the first thing a doctor sees when they open the dashboard. It is an AI-generated daily summary of every patient who needs attention — generated every night at 11 PM and ready when the doctor arrives in the morning.

The briefing is the practical implementation of the **One-Look Rule**: a doctor should understand the full picture of their day's priorities in under 5 seconds, without reading through individual patient files.

---

## Generation Process

The Morning Briefing is generated nightly at 11 PM by an N8N automation workflow:

1. N8N triggers the backend endpoint `/agent/morning-briefing` for each doctor
2. The backend queries: all patients assigned to this doctor
3. For each patient, collects: risk score and delta, escalation events in last 24h, missed check-ins, wearable anomalies, symptom severity changes, medication adherence flags, pending doctor questions
4. Patients are ranked by urgency score (combination of risk level, escalation events, missed check-ins)
5. Patients below a quiet threshold with no alerts are **excluded** from the briefing entirely (they are fine; the doctor doesn't need to think about them)
6. Groq LLaMA 3.3 70B generates a brief, clinically relevant "reason for attention" line for each included patient
7. Briefing saved to Supabase and pushed to the doctor dashboard via Supabase Realtime

---

## Briefing Card Design

Each patient in the briefing appears as a card showing:

```
🔴 Arjun Sharma — Hypertension, Type 2 Diabetes
   Risk: 74–82 (↑ from 61–69 yesterday)
   Why: Chest tightness reported overnight + smartwatch HR anomaly
   Last check-in: 6 hours ago
   [View Patient] [Call Patient]

🟡 Priya Menon — CKD Stage 3
   Risk: 55–63 (stable)
   Why: Missed 3 consecutive check-ins — no data for 3 days
   Last check-in: 3 days ago
   [View Patient] [Send Reminder]

🟡 Kavita Rao — Hypothyroidism
   Risk: 42–50 (↓ improving)
   Why: Doctor question pending response for 5 days (expires in 2 days)
   Last check-in: Yesterday
   [View Patient]
```

**Colour coding:**
- 🔴 Red — Immediate attention needed (escalation event or critical risk)
- 🟡 Amber — Attention needed today (missed check-ins, pending questions, moderate risk rise)
- 🟢 Green — Not shown in briefing (patient is doing fine)

---

## Sorting Logic

Briefing cards are sorted by urgency in this order:

1. Patients with a Tier 1 escalation event in the last 24 hours
2. Patients with a Tier 2 Immediate escalation in the last 24 hours
3. Patients whose risk score increased by 10+ points since yesterday
4. Patients with 2+ consecutive missed check-ins
5. Patients with pending doctor questions expiring within 48 hours
6. Patients with new drug conflict flags
7. Patients with Tier 2 Urgent (24h) escalation recommendations

---

## What the Briefing Does Not Show

- Patients who had a routine day with no alerts
- Patients who are recovering steadily and are low risk
- Detailed clinical notes (these are in the patient detail page, one click away)
- Wearable raw data (just the anomaly flag and the AI interpretation)

The goal is signal, not noise. A briefing that shows every patient every day is not a briefing — it is a list.

---

## Interactivity

From the briefing, the doctor can:
- **View Patient** — opens the full patient detail page
- **Call Patient** — opens the device dialler with the patient's number
- **Send Reminder** — sends a push notification to the patient app asking them to complete their check-in
- **Mark Reviewed** — dismisses the card from the briefing (recorded as reviewed, not deleted)

Marking a card as reviewed does not affect the patient's data or risk score. It simply moves the card to a "reviewed today" section so the doctor can track what they've already acted on.

---

## Historical Briefings

Previous briefings are accessible from the dashboard under "Past Briefings." Each is stored with a timestamp and the urgency snapshot that generated it. Doctors can review what was flagged on any specific date — useful for understanding how a patient's situation evolved over time.
