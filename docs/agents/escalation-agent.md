# 🚨 Escalation Agent

## Role

The Escalation Agent is responsible for determining when a patient's reported symptoms warrant an urgent alert — to the patient, to their doctor, or both. It is the safety-critical core of the platform.

**The most important design decision in this agent: the LLM does not make escalation decisions.** All trigger logic is a deterministic Python matrix — hardcoded rules that run before any LLM is involved. The LLM's only role is to write the patient-facing message language after a trigger has already fired. This means the escalation logic cannot hallucinate, cannot be jailbroken, and cannot behave unexpectedly under unusual inputs.

---

## Escalation Architecture

```
New symptom saved (or check-in answered)
        │
        ▼
Python escalation matrix runs (no LLM)
        │
   ┌────┴──────────────────────────────────────────┐
   ▼                                               ▼
Check Tier 1                               Check Tier 2
(Critical Single-Symptom Override)         (Two-Signal Combinations)
   │                                               │
   ▼                                               ▼
Any match? ──► Immediate escalation        Two signals present? ──► Graded escalation
No match?  ──► Continue                    Not present? ──► No escalation
   │                                               │
   └──────────────────────┬────────────────────────┘
                          │
                   (if escalation fires)
                          │
                          ▼
                 Groq LLM generates message
                 (tone, personalisation only)
                          │
                          ▼
                 Patient sees escalation card
                          │
                          ▼
                 N8N webhook → Doctor notification
```

---

## Tier 1 — Critical Single-Symptom Override

These 8 symptoms bypass all two-signal logic. A single occurrence at any severity level triggers an immediate escalation. They are hardcoded and cannot be modified by any configuration, prompt, or user action.

| # | Symptom | Clinical Concern |
|---|---|---|
| 1 | Sudden severe headache | Subarachnoid haemorrhage, hypertensive emergency |
| 2 | Chest pain at rest | Acute coronary syndrome, STEMI |
| 3 | Unilateral arm or facial weakness | Stroke (FAST criteria) |
| 4 | Unilateral numbness | Stroke, TIA |
| 5 | Slurred or sudden speech difficulty | Stroke (FAST criteria) |
| 6 | Sudden vision loss (one or both eyes) | Stroke, retinal artery occlusion |
| 7 | Loss of consciousness or near-syncope | Cardiac arrhythmia, seizure, hypoglycaemia |
| 8 | Severe breathing difficulty at rest | Acute pulmonary oedema, PE, severe asthma |
| 9 | Severe allergic reaction (throat, tongue swelling) | Anaphylaxis |

**Tier 1 Response:**
- Inline escalation card (red, high-contrast) in the chat/check-in flow
- *"Based on what you've described, please contact your doctor or go to an emergency room immediately. Do not wait."*
- **Call Doctor** button prominently shown
- Doctor notified via N8N within seconds

---

## Tier 2 — Two-Signal Combinations

Escalation fires when two independent danger signals are detected simultaneously. Both signals must be present within the same 24-hour window.

| Signal A | Signal B | Response Level | Recommendation |
|---|---|---|---|
| Chest pain | Breathlessness | Immediate | Seek emergency care now |
| Chest pain | Palpitations | Immediate | Seek emergency care now |
| Fever ≥ 3 days | Joint pain | Urgent (24h) | Consult doctor within 24 hours |
| Severe abdominal pain | Vomiting | Urgent (24h) | Consult doctor within 24 hours |
| Headache | Vision changes | Urgent (24h) | Consult doctor within 24 hours |
| Dizziness | Unilateral weakness | Immediate | Seek emergency care now |
| High fever | Rash | Urgent (48h) | Consult doctor within 48 hours |
| Fatigue (≥5 days) | Unexplained weight loss | Scheduled (this week) | Book an appointment this week |
| Wearable HR anomaly | Chest symptom reported | Urgent (24h) | Consult doctor within 24 hours |
| Wearable SpO2 anomaly | Breathlessness reported | Immediate | Seek emergency care now |

The two-signal requirement prevents over-escalation for benign single symptoms. Fatigue alone does not escalate. Fatigue combined with significant unexplained weight loss does.

---

## Escalation Message Generation

After the Python matrix fires a trigger, the Groq LLM is called with:
- The patient's name
- The specific signals that triggered escalation
- The tier and response level
- A strict prompt constraining the message to: empathetic tone, plain language, no diagnosis language, specific action recommended, disclaimer included

The LLM cannot change the escalation level, the recommended action, or the disclaimer. It only makes the language feel human rather than robotic.

**Example Tier 2 Immediate output:**
> *"Rahul, we noticed you mentioned chest pain along with feeling short of breath. These two symptoms together need immediate attention. Please contact your doctor right away or go to an emergency department. This is an AI-generated pattern suggestion — your doctor makes the final call on what's needed."*

---

## Doctor Notification via N8N

When Tier 1 or Tier 2 Immediate fires:
- N8N webhook called with: patient name, patient ID, signals detected, escalation tier, timestamp
- Doctor receives an in-app notification on the dashboard
- Morning briefing is updated with the escalation event even if the doctor already saw it

Tier 2 Urgent (24h) and Scheduled notifications appear in the morning briefing but do not send an immediate push notification, to avoid alert fatigue.

---

## What the Agent Explicitly Does Not Do

- Make escalation trigger decisions (Python matrix does this)
- Use the word "diagnosis" or "emergency" in ways that could cause panic
- Escalate based on a single non-critical symptom
- Fire on wearable anomalies alone (wearable anomaly must combine with a patient-reported symptom for Tier 2 — unless the wearable anomaly is SpO2 < 85%, which is a Tier 1 override)
